import type { Metadata } from "next";
import { createPageMetadata } from "@/app/_lib/site-metadata";
import { AppGuideShell } from "@/app/apps/_components/app-guide-shell";

export const metadata: Metadata = createPageMetadata({
  title: "Guide | ちんちんゲーム",
  description: "ちんちんゲームの遊び方と勝利条件。",
  path: "/apps/chinchin/guide",
});

// ↓ ここを編集する
const firstSteps = [
  "2人で同じ画面を囲み、Player 1から空いているマスを選ぶ",
  "Player 1は「ち」、Player 2は「ん」を交互に置く",
  "縦、横、斜めのどこかに4文字の並びを作る",
] as const;

const basicControls = [
  "空いているマスを押すと、手番の文字が置かれる",
  "リセット: 盤面を空にしてPlayer 1の手番からやり直す",
] as const;

const screenGuide = [
  "盤面の右側または下側に、現在の手番と置く文字が表示される",
  "勝利した4マスは薄茶色になり、文字へぼかしがかかる",
] as const;

const rules = [
  "5×5の盤面を使い、すでに文字があるマスには置けない",
  "Player 1の「ち」とPlayer 2の「ん」を交互に置く",
  "縦、横、斜めのいずれかで「ちんちん」または「んちんち」を完成させたプレイヤーが勝ち",
  "勝敗が決まらないまま25マスが埋まると引き分け",
] as const;

const tips = ["途中からやり直したいときは、リセットを押して盤面を空にする"] as const;
// ↑ ここまで

const winningExamples = [
  {
    label: "横",
    marks: [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      "ち",
      "ん",
      "ち",
      "ん",
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ],
    winningCells: [10, 11, 12, 13],
  },
  {
    label: "縦",
    marks: [
      null,
      "ん",
      null,
      null,
      null,
      null,
      "ち",
      null,
      null,
      null,
      null,
      "ん",
      null,
      null,
      null,
      null,
      "ち",
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ],
    winningCells: [1, 6, 11, 16],
  },
  {
    label: "斜め",
    marks: [
      "ち",
      null,
      null,
      null,
      null,
      null,
      "ん",
      null,
      null,
      null,
      null,
      null,
      "ち",
      null,
      null,
      null,
      null,
      null,
      "ん",
      null,
      null,
      null,
      null,
      null,
      null,
    ],
    winningCells: [0, 6, 12, 18],
  },
] as const;

export default function ChinchinGuidePage() {
  return (
    <AppGuideShell
      appName="ちんちんゲーム"
      firstSteps={firstSteps}
      basicControls={basicControls}
      screenGuide={screenGuide}
      rules={rules}
      ruleExample={<WinningExamples />}
      tips={tips}
    />
  );
}

function WinningExamples() {
  return (
    <div className="mt-10">
      <p className="text-sm font-semibold text-[var(--foreground)]">勝ち方の例</p>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
        色の付いた4マスが「ちんちん」または「んちんち」になれば勝ちです。
      </p>
      <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-5">
        {winningExamples.map((example) => (
          <figure key={example.label}>
            <div
              className="grid aspect-square grid-cols-5 gap-0.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-1.5 sm:gap-1 sm:rounded-xl sm:p-2"
              role="img"
              aria-label={`${example.label}方向に「${example.marks.filter(Boolean).join("")}」が並んだ勝利例`}
            >
              {example.marks.map((mark, index) => {
                const isWinningCell = example.winningCells.some((cell) => cell === index);

                return (
                  <span
                    key={index}
                    className={[
                      "flex aspect-square items-center justify-center rounded border text-xs font-semibold sm:text-lg",
                      isWinningCell
                        ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                        : "border-[var(--border)] bg-[var(--surface-strong)]",
                    ].join(" ")}
                    aria-hidden="true"
                  >
                    {mark}
                  </span>
                );
              })}
            </div>
            <figcaption className="mt-2 text-center text-sm font-semibold text-[var(--muted)]">
              {example.label}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
