"use client";

import { useEffect, useState } from "react";
import {
  calculateAccuracy,
  calculateKps,
  formatSeconds,
  judgeRank,
} from "@/app/apps/lala-typing/_lib/score";
import {
  createSession,
  getRemainingRomaji,
  getTypedRomaji,
  typeKey,
  type TypingSession,
} from "@/app/apps/lala-typing/_lib/typing-engine";
import {
  WORDS_PER_GAME,
  pickWords,
  typingWords,
  type TypingWord,
} from "@/app/apps/lala-typing/_lib/words";

type Phase =
  | { name: "idle" }
  | {
      name: "playing";
      words: readonly TypingWord[];
      wordIndex: number;
      session: TypingSession;
      hitCount: number;
      missCount: number;
      startedAt: number;
    }
  | { name: "finished"; hitCount: number; missCount: number; elapsedMs: number };

function startGame(): Phase {
  const words = pickWords(typingWords, WORDS_PER_GAME, Math.random);
  return {
    name: "playing",
    words,
    wordIndex: 0,
    session: createSession(words[0].reading),
    hitCount: 0,
    missCount: 0,
    startedAt: Date.now(),
  };
}

/** キー入力1回ぶんの状態遷移。描画から独立させ、見通しを保つ。 */
function handleKey(phase: Phase, key: string): Phase {
  if (phase.name === "idle") {
    return key === "Enter" || key === " " ? startGame() : phase;
  }

  if (phase.name === "finished") {
    return key === "Enter" ? startGame() : phase;
  }

  if (key === "Escape") {
    return { name: "idle" };
  }
  if (!/^[a-z-]$/.test(key)) {
    return phase;
  }

  const result = typeKey(phase.session, key);
  if (result.kind === "miss") {
    return { ...phase, missCount: phase.missCount + 1 };
  }

  const hitCount = phase.hitCount + 1;
  if (result.kind === "hit") {
    return { ...phase, session: result.session, hitCount };
  }

  const nextWordIndex = phase.wordIndex + 1;
  if (nextWordIndex < phase.words.length) {
    return {
      ...phase,
      wordIndex: nextWordIndex,
      session: createSession(phase.words[nextWordIndex].reading),
      hitCount,
    };
  }
  return {
    name: "finished",
    hitCount,
    missCount: phase.missCount,
    elapsedMs: Date.now() - phase.startedAt,
  };
}

export function TypingGameClient() {
  const [phase, setPhase] = useState<Phase>({ name: "idle" });

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey || event.repeat) {
        return;
      }
      if (event.key === " ") {
        event.preventDefault();
      }
      setPhase((prev) => handleKey(prev, event.key));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      {phase.name === "idle" && <IdleScreen onStart={() => setPhase(startGame())} />}
      {phase.name === "playing" && (
        <PlayingScreen phase={phase} onQuit={() => setPhase({ name: "idle" })} />
      )}
      {phase.name === "finished" && (
        <FinishedScreen phase={phase} onRetry={() => setPhase(startGame())} />
      )}
      {phase.name === "playing" && (
        <TouchKeyboard onKey={(key) => setPhase((prev) => handleKey(prev, key))} />
      )}
    </section>
  );
}

const KEY_ROWS = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", "-"],
  ["z", "x", "c", "v", "b", "n", "m"],
] as const;

/** タッチ主体の端末(スマホ・タブレット)向けの画面内キーボード。マウス等の精密ポインタ端末では表示しない。 */
function TouchKeyboard({ onKey }: { onKey: (key: string) => void }) {
  return (
    <div className="mt-12 select-none pointer-fine:hidden">
      {KEY_ROWS.map((row) => (
        <div key={row[0]} className="mb-1.5 flex justify-center gap-1.5">
          {row.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => onKey(key)}
              className="h-12 max-w-9 flex-1 basis-0 touch-manipulation rounded-md bg-[var(--surface-strong)] font-mono text-sm font-semibold text-[var(--foreground)] active:bg-[var(--accent)] active:text-white"
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

function IdleScreen({ onStart }: { onStart: () => void }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
        Ready
      </p>
      <h2 className="mt-6 text-5xl font-semibold tracking-tight sm:text-6xl">
        全{WORDS_PER_GAME}問、
        <br />
        最速で打て。
      </h2>
      <p className="mt-8 text-base leading-7 text-[var(--muted)]">
        表示される単語をローマ字で入力する。PCはキーボード、スマホ・タブレットは画面に出るキーをタップする。
      </p>
      <button
        type="button"
        onClick={onStart}
        className="mt-12 rounded-full bg-[var(--accent)] px-10 py-4 text-sm font-semibold text-white transition hover:opacity-85"
      >
        スタート(Enter)
      </button>
    </div>
  );
}

function PlayingScreen({
  phase,
  onQuit,
}: {
  phase: Extract<Phase, { name: "playing" }>;
  onQuit: () => void;
}) {
  const word = phase.words[phase.wordIndex];
  const typed = getTypedRomaji(phase.session);
  const remaining = getRemainingRomaji(phase.session);

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
          Word {phase.wordIndex + 1} / {phase.words.length}
        </p>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
          Miss {phase.missCount}
        </p>
      </div>
      <p className="mt-14 text-5xl font-semibold tracking-tight sm:text-6xl">{word.display}</p>
      <p className="mt-4 text-lg text-[var(--muted)]">{word.reading}</p>
      <p
        className="mt-10 break-all font-mono text-2xl tracking-wide sm:text-3xl"
        aria-hidden="true"
      >
        <span className="font-semibold text-[var(--accent)]">{typed}</span>
        <span className="text-[var(--foreground)]/35">{remaining}</span>
      </p>
      <p className="mt-16 hidden text-xs text-[var(--muted)] pointer-fine:block">
        Escで中断してスタート画面に戻る
      </p>
      <button
        type="button"
        onClick={onQuit}
        className="mt-16 text-xs text-[var(--muted)] underline underline-offset-4 pointer-fine:hidden"
      >
        中断してスタート画面に戻る
      </button>
    </div>
  );
}

function FinishedScreen({
  phase,
  onRetry,
}: {
  phase: Extract<Phase, { name: "finished" }>;
  onRetry: () => void;
}) {
  const accuracy = calculateAccuracy(phase);
  const kps = calculateKps(phase);
  const rank = judgeRank({ kps, accuracy });

  return (
    <div role="status">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
        Result
      </p>
      <p className="mt-6 text-8xl font-semibold tracking-tight text-[var(--accent)]">{rank}</p>
      <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">
        <ResultItem label="タイム" value={`${formatSeconds(phase.elapsedMs)}秒`} />
        <ResultItem label="速さ" value={`${kps.toFixed(1)}打/秒`} />
        <ResultItem label="正確さ" value={`${Math.round(accuracy * 100)}%`} />
        <ResultItem label="ミス" value={`${phase.missCount}回`} />
      </dl>
      <button
        type="button"
        onClick={onRetry}
        className="mt-14 rounded-full bg-[var(--accent)] px-10 py-4 text-sm font-semibold text-white transition hover:opacity-85"
      >
        もう一度(Enter)
      </button>
    </div>
  );
}

function ResultItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
        {label}
      </dt>
      <dd className="mt-2 text-xl font-semibold tracking-tight">{value}</dd>
    </div>
  );
}
