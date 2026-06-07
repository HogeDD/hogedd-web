import type { ReactNode } from "react";
import { AppPageShell } from "@/app/apps/_components/app-page-shell";

export default function CleanTasksLayout({ children }: { children: ReactNode }) {
  return <AppPageShell>{children}</AppPageShell>;
}
