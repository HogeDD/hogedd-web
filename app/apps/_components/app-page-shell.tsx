import type { ReactNode } from "react";
import { SiteFooter } from "@/app/_components/site-footer";
import { SiteHeader } from "@/app/_components/site-header";
import { AppNavigation } from "@/app/apps/_components/app-navigation";
import type { AppPageId } from "@/app/apps/_lib/app-page-navigation";

export function AppPageShell({
  appName,
  appHref,
  availablePages,
  children,
}: {
  appName: string;
  appHref: string;
  availablePages: readonly AppPageId[];
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <SiteHeader />
      <AppNavigation appName={appName} appHref={appHref} availablePages={availablePages} />
      {children}
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <SiteFooter />
      </div>
    </div>
  );
}
