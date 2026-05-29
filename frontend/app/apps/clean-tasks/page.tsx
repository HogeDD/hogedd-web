import type { Metadata } from "next";
import { TasksClient } from "@/app/tasks-client";

export const metadata: Metadata = {
  title: "Clean Tasks",
  description: "HogeDD の最初のデモアプリ",
};

export default function CleanTasksPage() {
  return <TasksClient />;
}
