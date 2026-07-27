"use client";

import { Sparkles } from "lucide-react";
import { AppCard } from "./AppCard";
import type { CatalogApp } from "@/lib/appStoreCatalog";

interface FeaturedBannerProps {
  apps: CatalogApp[];
}

export function FeaturedBanner({ apps }: FeaturedBannerProps) {
  if (apps.length === 0) return null;

  return (
    <div className="mb-4">
      <div className="mb-2 flex items-center gap-1.5 px-1 text-[13px] font-medium text-[var(--text-1)]">
        <Sparkles className="h-3.5 w-3.5 text-amber-400" />
        Featured
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {apps.map((app) => (
          <AppCard key={app.id} app={app} variant="featured" />
        ))}
      </div>
    </div>
  );
}
