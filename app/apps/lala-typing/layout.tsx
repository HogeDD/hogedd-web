import type { ReactNode } from "react";
import { AppPageShell } from "@/app/apps/_components/app-page-shell";
import { appThemePresets } from "@/app/apps/_lib/app-theme";

export default function LalaTypingLayout({ children }: { children: ReactNode }) {
  return (
    <AppPageShell
      appName="ララ打"
      appHref="/apps/lala-typing"
      availablePages={["app", "about", "guide"]}
      theme={appThemePresets.sunset}
    >
      {children}
    </AppPageShell>
  );
}
