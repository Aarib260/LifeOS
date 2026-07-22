import { DEFAULT_ROOT_FOLDER_IDS } from "@/types/fs";
import {
  createNode,
  findChildByName,
  getChildren,
  getNode,
  getPath,
  updateNode,
} from "@/lib/fsClient";
import type { FSNode } from "@/types/fs";

export interface TerminalContext {
  /** Current working directory — an fs_nodes folder id. */
  cwdId: string;
  /** Full command history, most recent last (for the `history` command). */
  history: string[];
}

export interface CommandResult {
  lines: string[];
  /** Present when the command changes directory (e.g. `cd`). */
  newCwdId?: string;
  /** Present when the command should wipe the visible output (`clear`). */
  clear?: boolean;
  /** True if `lines` represents an error message, for output styling. */
  isError?: boolean;
}

const HOME_ID = DEFAULT_ROOT_FOLDER_IDS.desktop;

function ok(lines: string[] = []): CommandResult {
  return { lines };
}

function err(message: string): CommandResult {
  return { lines: [message], isError: true };
}

async function cmdHelp(): Promise<CommandResult> {
  return ok([
    "Available commands:",
    "  help                 show this list",
    "  clear                clear the screen",
    "  pwd                  print working directory",
    "  ls                   list directory contents",
    "  cd <dir|..|/>        change directory",
    "  mkdir <name>         create a folder",
    "  touch <name>         create an empty file",
    "  rm <name>            move a file/folder to Recycle Bin",
    "  cat <name>           print a file's contents",
    "  echo <text>          print text",
    "  date                 print the current date/time",
    "  whoami               print the signed-in user",
    "  history              show command history",
    "  tree                 show the directory tree from here down",
  ]);
}

async function cmdPwd(ctx: TerminalContext): Promise<CommandResult> {
  const path = await getPath(ctx.cwdId);
  return ok(["/" + path.map((p) => p.name).join("/")]);
}

async function cmdLs(ctx: TerminalContext): Promise<CommandResult> {
  const children = await getChildren(ctx.cwdId);
  if (children.length === 0) return ok([]);
  return ok(children.map((n) => (n.type === "folder" ? `${n.name}/` : n.name)));
}

async function cmdCd(ctx: TerminalContext, arg: string | undefined): Promise<CommandResult> {
  if (!arg || arg === "~") {
    return { lines: [], newCwdId: HOME_ID };
  }
  if (arg === "/") {
    return { lines: [], newCwdId: HOME_ID };
  }
  if (arg === "..") {
    const current = await getNode(ctx.cwdId);
    if (!current.parentId) {
      return err("Already at the top-level folder.");
    }
    return { lines: [], newCwdId: current.parentId };
  }

  const target = await findChildByName(ctx.cwdId, arg);
  if (!target) return err(`cd: no such directory: ${arg}`);
  if (target.type !== "folder") return err(`cd: not a directory: ${arg}`);
  return { lines: [], newCwdId: target.id };
}

async function cmdMkdir(ctx: TerminalContext, arg: string | undefined): Promise<CommandResult> {
  if (!arg) return err("mkdir: missing folder name");
  await createNode({ parentId: ctx.cwdId, name: arg, type: "folder" });
  return ok();
}

async function cmdTouch(ctx: TerminalContext, arg: string | undefined): Promise<CommandResult> {
  if (!arg) return err("touch: missing file name");
  await createNode({ parentId: ctx.cwdId, name: arg, type: "file", content: "" });
  return ok();
}

async function cmdRm(ctx: TerminalContext, arg: string | undefined): Promise<CommandResult> {
  if (!arg) return err("rm: missing name");
  const target = await findChildByName(ctx.cwdId, arg);
  if (!target) return err(`rm: no such file or directory: ${arg}`);
  // Soft delete, same as Explorer's Delete — recoverable from Recycle Bin
  // rather than a real `rm`'s permanent removal.
  await updateNode(target.id, { isDeleted: true });
  return ok();
}

async function cmdCat(ctx: TerminalContext, arg: string | undefined): Promise<CommandResult> {
  if (!arg) return err("cat: missing file name");
  const target = await findChildByName(ctx.cwdId, arg);
  if (!target) return err(`cat: no such file: ${arg}`);
  if (target.type !== "file") return err(`cat: ${arg}: is a directory`);
  const content = target.content ?? "";
  return ok(content.length > 0 ? content.split("\n") : [""]);
}

function cmdEcho(args: string[]): CommandResult {
  return ok([args.join(" ")]);
}

function cmdDate(): CommandResult {
  return ok([new Date().toString()]);
}

async function cmdWhoami(): Promise<CommandResult> {
  try {
    const res = await fetch("/api/auth/session");
    if (res.ok) {
      const session = await res.json();
      const name = session?.user?.name ?? session?.user?.email;
      if (name) return ok([name]);
    }
  } catch {
    // fall through to guest
  }
  return ok(["guest"]);
}

function cmdHistory(ctx: TerminalContext): CommandResult {
  if (ctx.history.length === 0) return ok(["(no commands yet)"]);
  return ok(ctx.history.map((cmd, i) => `  ${i + 1}  ${cmd}`));
}

/**
 * Depth-limited recursive tree print. The limit isn't about the file
 * system being untrustworthy — it's a safety net against accidentally
 * printing thousands of lines if someone builds a very deep structure.
 */
async function buildTreeLines(folderId: string, prefix: string, depth: number): Promise<string[]> {
  if (depth > 10) return [`${prefix}... (depth limit reached)`];

  const children = await getChildren(folderId);
  const lines: string[] = [];

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const isLast = i === children.length - 1;
    const branch = isLast ? "└── " : "├── ";
    const nextPrefix = prefix + (isLast ? "    " : "│   ");

    lines.push(`${prefix}${branch}${child.type === "folder" ? child.name + "/" : child.name}`);

    if (child.type === "folder") {
      lines.push(...(await buildTreeLines(child.id, nextPrefix, depth + 1)));
    }
  }

  return lines;
}

async function cmdTree(ctx: TerminalContext): Promise<CommandResult> {
  const current = await getNode(ctx.cwdId);
  const lines = await buildTreeLines(ctx.cwdId, "", 0);
  return ok([`${current.name}/`, ...lines]);
}

/**
 * Splits a command line into [command, ...args]. Basic double-quote
 * support so `touch "my file.txt"` works, matching what people expect
 * from a real shell for names with spaces.
 */
function tokenize(input: string): string[] {
  const tokens: string[] = [];
  const regex = /"([^"]*)"|(\S+)/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(input)) !== null) {
    tokens.push(match[1] !== undefined ? match[1] : match[2]);
  }
  return tokens;
}

export async function executeCommand(
  raw: string,
  ctx: TerminalContext
): Promise<CommandResult> {
  const trimmed = raw.trim();
  if (!trimmed) return ok();

  const [command, ...args] = tokenize(trimmed);

  try {
    switch (command) {
      case "help":
        return await cmdHelp();
      case "clear":
        return { lines: [], clear: true };
      case "pwd":
        return await cmdPwd(ctx);
      case "ls":
        return await cmdLs(ctx);
      case "cd":
        return await cmdCd(ctx, args[0]);
      case "mkdir":
        return await cmdMkdir(ctx, args[0]);
      case "touch":
        return await cmdTouch(ctx, args[0]);
      case "rm":
        return await cmdRm(ctx, args[0]);
      case "cat":
        return await cmdCat(ctx, args[0]);
      case "echo":
        return cmdEcho(args);
      case "date":
        return cmdDate();
      case "whoami":
        return await cmdWhoami();
      case "history":
        return cmdHistory(ctx);
      case "tree":
        return await cmdTree(ctx);
      default:
        return err(`${command}: command not found`);
    }
  } catch (error) {
    return err(error instanceof Error ? error.message : "Something went wrong");
  }
}

export type { FSNode };