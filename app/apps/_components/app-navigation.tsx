"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  appPageNavigationItems,
  getActiveAppPage,
  type AppPageId,
} from "@/app/apps/_lib/app-page-navigation";

export function AppNavigation({
  appName,
  appHref,
  availablePages,
}: {
  appName: string;
  appHref: string;
  availablePages: readonly AppPageId[];
}) {
  const pathname = usePathname();
  const activePage = getActiveAppPage(pathname, appHref);

  return (
    <div className="border-b border-[var(--border)] bg-[var(--background)]">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/apps"
          className="rounded-sm text-sm font-semibold text-[var(--muted)] transition hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
        >
          ← Apps
        </Link>

        <nav aria-label={`${appName} アプリ内ナビゲーション`}>
          <ul className="flex items-center rounded-full border border-[var(--border)] bg-[var(--surface)] p-1">
            {appPageNavigationItems.map((item) => {
              const isAvailable = availablePages.includes(item.id);
              const isActive = activePage === item.id;
              const className = [
                "rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]",
                isActive
                  ? "bg-[var(--accent)] text-white shadow-sm"
                  : isAvailable
                    ? "text-[var(--muted)] hover:bg-[var(--surface-strong)] hover:text-[var(--foreground)]"
                    : "cursor-not-allowed text-[var(--muted)]/40",
              ].join(" ");

              return (
                <li key={item.id}>
                  {isAvailable ? (
                    <Link
                      href={item.getHref(appHref)}
                      aria-current={isActive ? "page" : undefined}
                      className={className}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className={className} aria-disabled="true" title="準備中">
                      {item.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
