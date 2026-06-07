import type { ReactNode } from "react";
import { SiteFooter } from "@/app/_components/site-footer";
import { SiteHeader } from "@/app/_components/site-header";

export function AppPageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <SiteHeader />
      {children}
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <SiteFooter />
      </div>
    </div>
  );
}
