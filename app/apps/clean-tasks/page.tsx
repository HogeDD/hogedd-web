import type { Metadata } from "next";
import { createPageMetadata } from "@/app/_lib/site-metadata";
import { TasksClient } from "@/app/apps/clean-tasks/_components/tasks-client";

export const metadata: Metadata = createPageMetadata({
  title: "Clean Tasks",
  description: "HogeDD の最初のデモアプリ",
  path: "/apps/clean-tasks",
});

export default function CleanTasksPage() {
  return <TasksClient />;
}
