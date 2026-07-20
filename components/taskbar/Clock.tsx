"use client";

import { useEffect, useState } from "react";

export function Clock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    // Minute precision is plenty for a taskbar clock — no need to re-render every second.
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  // Render nothing time-dependent until mounted, so server and client markup match.
  if (!now) {
    return <div className="w-16" />;
  }

  const time = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const date = now.toLocaleDateString([], { month: "numeric", day: "numeric", year: "numeric" });

  return (
    <div className="flex flex-col items-end px-1 font-mono leading-tight text-[var(--text-2)]">
      <span className="text-xs">{time}</span>
      <span className="text-[10px] text-[var(--text-3)]">{date}</span>
    </div>
  );
}
