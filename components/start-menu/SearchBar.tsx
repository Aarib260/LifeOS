"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-[var(--border-2)] bg-[var(--surface-1)] px-3 py-2.5">
      <Search className="h-4 w-4 text-[var(--text-4)]" />
      <input
        autoFocus
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search apps..."
        className="w-full bg-transparent text-sm text-[var(--text-1)] outline-none placeholder:text-[var(--text-4)]"
      />
    </div>
  );
}
