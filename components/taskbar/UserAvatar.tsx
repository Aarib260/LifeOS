"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { User, LogOut } from "lucide-react";

export function UserAvatar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const initial =
    session?.user?.name?.[0]?.toUpperCase() ?? session?.user?.email?.[0]?.toUpperCase() ?? null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        aria-label="User menu"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-2)] bg-gradient-to-br from-cyan-400/30 to-indigo-400/30 text-xs font-medium text-[var(--text-2)] transition-colors hover:border-cyan-400/40"
      >
        {initial ?? <User className="h-4 w-4" />}
      </button>

      {isOpen && (
        <>
          {/* Click-outside dismiss */}
          <div className="fixed inset-0" onClick={() => setIsOpen(false)} />
          <div className="absolute bottom-11 right-0 z-10 w-44 rounded-lg border border-[var(--border-2)] bg-[var(--bg-panel)] p-2 shadow-2xl">
            <p className="truncate px-2 py-1 text-xs text-[var(--text-2)]">
              {session?.user?.name || session?.user?.email || "Signed in"}
            </p>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs text-[var(--text-3)] transition-colors hover:bg-[var(--surface-2)] hover:text-red-300"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
