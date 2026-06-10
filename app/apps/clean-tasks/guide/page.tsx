import type { Metadata } from "next";
import { createPageMetadata } from "@/app/_lib/site-metadata";
import { AppGuideShell } from "@/app/apps/_components/app-guide-shell";

export const metadata: Metadata = createPageMetadata({
  title: "Guide | Clean Tasks",
  description: "Clean Architecture の練習として作った、最小構成のタスクアプリ。",
  path: "/apps/clean-tasks/guide",
});

// ↓ ここを編集する
const firstSteps = [
  "Title欄にやることを入力する",
  "Createボタンを押すとTasksに追加される",
] as const;

const basicControls = [
  "Createボタン: 入力したタスクを追加する",
  "Refreshボタン: タスク一覧を最新の状態に更新する",
] as const;

const screenGuide = [
  "上部のTotal / Completed / Pendingで件数のサマリーを確認できる",
  "右側のTasks一覧に、追加したタスクが新しい順に並ぶ",
  "各タスクの右側に Done / Pending の状態が表示される",
] as const;

const rules = ["タスクのタイトルは空にできない", "一覧の完了状態はサーバー側で管理される"] as const;

const tips = ["特にありません。気軽に追加して試してください。"] as const;
// ↑ ここまで

export default function CleanTasksGuidePage() {
  return (
    <AppGuideShell
      appName="Clean Tasks"
      firstSteps={firstSteps}
      basicControls={basicControls}
      screenGuide={screenGuide}
      rules={rules}
      tips={tips}
    />
  );
}
