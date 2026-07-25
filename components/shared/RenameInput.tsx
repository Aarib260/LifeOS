"use client";

interface RenameInputProps {
  initialValue: string;
  onCommit: (value: string) => void;
  onCancel: () => void;
  className?: string;
}

export function RenameInput({ initialValue, onCommit, onCancel, className }: RenameInputProps) {
  return (
    <input
      autoFocus
      defaultValue={initialValue}
      onClick={(e) => e.stopPropagation()}
      onFocus={(e) => e.target.select()}
      onKeyDown={(e) => {
        e.stopPropagation();
        if (e.key === "Enter") onCommit(e.currentTarget.value);
        if (e.key === "Escape") onCancel();
      }}
      onBlur={(e) => onCommit(e.currentTarget.value)}
      className={
        className ??
        "w-full rounded border border-cyan-400/50 bg-[var(--surface-1)] px-1 text-center text-[11px] text-[var(--text-1)] outline-none"
      }
    />
  );
}
