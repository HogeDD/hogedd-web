import type { ReactNode } from "react";
import { AppPageShell } from "@/app/apps/_components/app-page-shell";
import { appThemePresets } from "@/app/apps/_lib/app-theme";

export default function JudoRouletteLayout({ children }: { children: ReactNode }) {
  return (
    <AppPageShell
      appName="柔道ルーレット"
      appHref="/apps/judo-roulette"
      availablePages={["app", "about", "guide"]}
      theme={appThemePresets.sumi}
    >
      {children}
    </AppPageShell>
  );
}
