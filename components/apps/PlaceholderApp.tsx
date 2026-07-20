import type { LucideIcon } from "lucide-react";

interface PlaceholderAppProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

/**
 * Shared shell for apps whose real functionality is scoped to Phase 2.
 * Each app file below is just this layout + its own icon/copy — real
 * logic replaces the description prop entirely once that app is built.
 */
export function PlaceholderApp({ icon: Icon, title, description }: PlaceholderAppProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.06]">
        <Icon className="h-7 w-7 text-cyan-300/90" />
      </div>
      <h2 className="text-sm font-medium text-[var(--text-1)]">{title}</h2>
      <p className="max-w-xs text-xs leading-relaxed text-[var(--text-4)]">{description}</p>
    </div>
  );
}
