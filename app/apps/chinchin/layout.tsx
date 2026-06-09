import type { ReactNode } from "react";
import { AppPageShell } from "@/app/apps/_components/app-page-shell";

export default function ChinchinLayout({ children }: { children: ReactNode }) {
  return (
    <AppPageShell appName="ちんちんゲーム" appHref="/apps/chinchin" availablePages={["app"]}>
      {children}
    </AppPageShell>
  );
}
