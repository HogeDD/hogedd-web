import type { ReactNode } from "react";
import { AppPageShell } from "@/app/apps/_components/app-page-shell";
import { appThemePresets } from "@/app/apps/_lib/app-theme";

export default function BakuonKikiippatsuLayout({ children }: { children: ReactNode }) {
  return (
    <AppPageShell
      appName="爆音危機一髪"
      appHref="/apps/bakuon-kikiippatsu"
      availablePages={["app", "about", "guide"]}
      theme={appThemePresets.tomato}
    >
      {children}
    </AppPageShell>
  );
}
