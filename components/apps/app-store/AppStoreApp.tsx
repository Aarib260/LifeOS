"use client";

import { useMemo, useState } from "react";
import { Search, Package, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_STORE_CATALOG, APP_STORE_CATEGORIES, type AppStoreCategory } from "@/lib/appStoreCatalog";
import { useAppStoreStore } from "@/store/appStoreStore";
import { VISIBLE_APP_LIST } from "@/lib/appRegistry";
import { AppCard } from "./AppCard";
import { FeaturedBanner } from "./FeaturedBanner";

type Tab = "available" | "installed" | "updates";

export function AppStoreApp() {
  const [tab, setTab] = useState<Tab>("available");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<AppStoreCategory | "all">("all");

  const installedIds = useAppStoreStore((s) => s.installedIds);
  const updatesAvailable = useAppStoreStore((s) => s.updatesAvailable);

  const filteredCatalog = useMemo(() => {
    return APP_STORE_CATALOG.filter((app) => {
      if (category !== "all" && app.category !== category) return false;
      if (search.trim() && !app.name.toLowerCase().includes(search.trim().toLowerCase())) return false;
      return true;
    });
  }, [category, search]);

  const availableApps = filteredCatalog.filter((app) => !installedIds.includes(app.id));
  const featuredApps = APP_STORE_CATALOG.filter((app) => app.featured && !installedIds.includes(app.id));
  const installedCatalogApps = APP_STORE_CATALOG.filter((app) => installedIds.includes(app.id));
  const updateApps = APP_STORE_CATALOG.filter((app) => updatesAvailable.includes(app.id));

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center gap-1 border-b border-[var(--border-1)] p-2">
        <TabButton label="Available" isActive={tab === "available"} onClick={() => setTab("available")} />
        <TabButton
          label="Installed"
          isActive={tab === "installed"}
          onClick={() => setTab("installed")}
          count={VISIBLE_APP_LIST.length + installedCatalogApps.length}
        />
        <TabButton
          label="Updates"
          isActive={tab === "updates"}
          onClick={() => setTab("updates")}
          count={updateApps.length}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {tab === "available" && (
          <>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex flex-1 items-center gap-2 rounded-lg border border-[var(--border-2)] bg-[var(--surface-1)] px-3 py-1.5">
                <Search className="h-3.5 w-3.5 text-[var(--text-4)]" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search apps"
                  className="w-full bg-transparent text-[13px] outline-none placeholder:text-[var(--text-4)]"
                />
              </div>
            </div>

            <div className="mb-4 flex flex-wrap gap-1.5">
              <CategoryChip label="All" isActive={category === "all"} onClick={() => setCategory("all")} />
              {APP_STORE_CATEGORIES.map((c) => (
                <CategoryChip key={c} label={c} isActive={category === c} onClick={() => setCategory(c)} />
              ))}
            </div>

            {!search && category === "all" && <FeaturedBanner apps={featuredApps} />}

            {availableApps.length === 0 ? (
              <EmptyState message="No apps match your search." />
            ) : (
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                {availableApps.map((app) => (
                  <AppCard key={app.id} app={app} />
                ))}
              </div>
            )}
          </>
        )}

        {tab === "installed" && (
          <div className="flex flex-col gap-4">
            <div>
              <p className="mb-2 px-1 text-[12px] font-medium text-[var(--text-4)]">Built into LifeOS</p>
              <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
                {VISIBLE_APP_LIST.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center gap-2.5 rounded-lg border border-[var(--border-2)] bg-[var(--surface-1)] p-2.5"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border-2)] bg-[var(--surface-2)]">
                      <app.icon className="h-4 w-4 text-[var(--icon-accent)]" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[12px] text-[var(--text-1)]">{app.title}</p>
                      <p className="text-[10px] text-[var(--text-4)]">Built-in — can't be uninstalled</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {installedCatalogApps.length > 0 && (
              <div>
                <p className="mb-2 px-1 text-[12px] font-medium text-[var(--text-4)]">Installed from the Store</p>
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                  {installedCatalogApps.map((app) => (
                    <AppCard key={app.id} app={app} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "updates" &&
          (updateApps.length === 0 ? (
            <EmptyState icon={RefreshCw} message="Everything is up to date." />
          ) : (
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
              {updateApps.map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          ))}
      </div>
    </div>
  );
}

function TabButton({
  label,
  isActive,
  onClick,
  count,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
  count?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] transition-colors",
        isActive
          ? "bg-[var(--surface-3)] text-[var(--text-1)]"
          : "text-[var(--text-3)] hover:bg-[var(--surface-1)] hover:text-[var(--text-1)]"
      )}
    >
      {label}
      {typeof count === "number" && count > 0 && (
        <span className="rounded-full bg-[var(--surface-2)] px-1.5 py-0.5 text-[10px] text-[var(--text-3)]">
          {count}
        </span>
      )}
    </button>
  );
}

function CategoryChip({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-2.5 py-1 text-[11px] transition-colors",
        isActive
          ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-300"
          : "border-[var(--border-2)] text-[var(--text-3)] hover:bg-[var(--surface-1)]"
      )}
    >
      {label}
    </button>
  );
}

function EmptyState({
  message,
  icon: Icon = Package,
}: {
  message: string;
  icon?: typeof Package;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-[var(--text-4)]">
      <Icon className="h-8 w-8 opacity-50" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
