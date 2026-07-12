"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Explore" },
  { href: "/compare", label: "Compare" },
  { href: "/favorites", label: "Favorites" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <div className="sticky top-4 z-50 flex justify-center px-6">
      <nav className="glass w-full max-w-3xl rounded-2xl">
        <div className="px-6 py-3 flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold tracking-tight text-white">
            Atlas
          </Link>

          <div className="flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "px-3.5 py-1.5 rounded-lg text-sm transition-colors",
                    isActive
                      ? "bg-white/[0.08] text-white"
                      : "text-[#94A3B8] hover:text-white"
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}