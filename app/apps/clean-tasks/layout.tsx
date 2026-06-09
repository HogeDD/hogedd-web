import type { ReactNode } from "react";
import { AppPageShell } from "@/app/apps/_components/app-page-shell";

export default function CleanTasksLayout({ children }: { children: ReactNode }) {
  return (
    <AppPageShell appName="Clean Tasks" appHref="/apps/clean-tasks" availablePages={["app"]}>
      {children}
    </AppPageShell>
  );
}
