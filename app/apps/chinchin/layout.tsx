import type { ReactNode } from "react";
import { AppPageShell } from "@/app/apps/_components/app-page-shell";
import { appThemePresets } from "@/app/apps/_lib/app-theme";

export default function ChinchinLayout({ children }: { children: ReactNode }) {
  return (
    <AppPageShell
      appName="ちんちんゲーム"
      appHref="/apps/chinchin"
      availablePages={["app", "about", "guide"]}
      theme={appThemePresets.coral}
    >
      {children}
    </AppPageShell>
  );
}
