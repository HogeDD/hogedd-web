import type { ReactNode } from "react";
import { AppPageShell } from "@/app/apps/_components/app-page-shell";

export default function ChinchinLayout({ children }: { children: ReactNode }) {
  return <AppPageShell>{children}</AppPageShell>;
}
