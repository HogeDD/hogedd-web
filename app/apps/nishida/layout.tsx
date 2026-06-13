import type { ReactNode } from "react";
import { AppPageShell } from "@/app/apps/_components/app-page-shell";
import { appThemePresets } from "@/app/apps/_lib/app-theme";

export default function NishidaLayout({ children }: { children: ReactNode }) {
  return (
    <AppPageShell
      appName="ニシ打"
      appHref="/apps/nishida"
      availablePages={["app", "about", "guide"]}
      theme={appThemePresets.mikan}
    >
      {children}
    </AppPageShell>
  );
}
