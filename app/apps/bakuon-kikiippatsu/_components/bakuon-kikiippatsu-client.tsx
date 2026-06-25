"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  MAX_PLAYER_COUNT,
  MIN_PLAYER_COUNT,
  type BakuonGame,
  createGame,
  pressButton,
} from "@/app/apps/bakuon-kikiippatsu/_lib/game";

const REVEAL_DURATION_MS = 1400;

export function BakuonKikiippatsuClient() {
  const [playerCount, setPlayerCount] = useState(3);
  const [setupStep, setSetupStep] = useState<"players" | "volume">("players");
  const [game, setGame] = useState<BakuonGame | null>(null);
  const [revealingButton, setRevealingButton] = useState<{
    index: number;
    isFilling: boolean;
  } | null>(null);
  const revealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const revealFrameRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
      if (revealFrameRef.current) cancelAnimationFrame(revealFrameRef.current);
    },
    [],
  );

  const gridColumns = useMemo(() => {
    if (!game) return 3;
    if (game.buttons.length <= 9) return 3;
    if (game.buttons.length <= 18) return 4;
    return 5;
  }, [game]);

  function startGame() {
    setGame(createGame({ playerCount }));
    setRevealingButton(null);
  }

  function resetGame() {
    if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
    if (revealFrameRef.current) cancelAnimationFrame(revealFrameRef.current);
    setGame(null);
    setRevealingButton(null);
    setSetupStep("players");
  }

  function selectPreviousPlayerCount() {
    setPlayerCount((count) => Math.max(MIN_PLAYER_COUNT, count - 1));
  }

  function selectNextPlayerCount() {
    setPlayerCount((count) => Math.min(MAX_PLAYER_COUNT, count + 1));
  }

  function handleButtonPress(index: number) {
    if (!game || revealingButton) return;

    const selectedButton = game.buttons[index];
    if (!selectedButton || selectedButton.status !== "hidden") return;

    setRevealingButton({ index, isFilling: false });
    revealFrameRef.current = requestAnimationFrame(() => {
      setRevealingButton({ index, isFilling: true });
    });

    revealTimerRef.current = setTimeout(() => {
      const nextGame = pressButton(game, index);
      setGame(nextGame);
      setRevealingButton(null);

      if (selectedButton.hasBomb) {
        playBakuon();
      }
    }, REVEAL_DURATION_MS);
  }

  const remainingSafeCount = game ? game.buttons.length - 1 - game.safePressCount : 0;
  const statusLabel = game
    ? game.status === "lost"
      ? "OUT"
      : `SAFE 残り ${remainingSafeCount}`
    : null;

  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute -right-20 top-12 h-56 w-56 rounded-full bg-[var(--accent-soft)]"
        aria-hidden="true"
      />
      <div
        className="absolute -left-24 bottom-20 h-72 w-72 rounded-full border border-[var(--accent)]/15"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <header className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent-text)]">
            Silent or Out
          </p>
          <h1 className="mt-3 text-5xl font-semibold tracking-tight sm:text-7xl">爆音危機一髪</h1>
        </header>

        {game ? (
          <div
            className={[
              "mt-8 rounded-3xl px-5 py-4 text-center shadow-lg transition-colors sm:px-7",
              game.status === "lost"
                ? "bg-[var(--accent)] text-4xl text-[var(--accent-foreground)] ring-4 ring-[var(--accent)]/25"
                : "bg-[var(--surface)] text-[var(--foreground)]",
            ].join(" ")}
            role="status"
            aria-live="polite"
          >
            <p className="text-2xl font-semibold tracking-tight">{statusLabel}</p>
          </div>
        ) : null}

        {!game ? (
          <div className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xl sm:p-7">
            {setupStep === "players" ? (
              <>
                <p className="mb-5 text-center text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                  プレイヤー人数選択
                </p>
                <PlayerCountRollSelector
                  count={playerCount}
                  onPrevious={selectPreviousPlayerCount}
                  onNext={selectNextPlayerCount}
                />

                <button
                  type="button"
                  onClick={() => setSetupStep("volume")}
                  className="mt-6 w-full touch-manipulation rounded-full bg-[var(--accent)] px-6 py-4 text-base font-semibold text-[var(--accent-foreground)] shadow-lg transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
                >
                  決定
                </button>
              </>
            ) : (
              <div className="text-center">
                <p className="mb-5 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                  音量を上げる
                </p>
                <p className="text-4xl font-semibold tracking-tight text-[var(--foreground)]">
                  READY
                </p>
                <div className="mt-6 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSetupStep("players")}
                    className="min-w-0 flex-1 touch-manipulation rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-4 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
                  >
                    戻る
                  </button>
                  <button
                    type="button"
                    onClick={startGame}
                    className="min-w-0 flex-[2] touch-manipulation rounded-full bg-[var(--accent)] px-6 py-4 text-base font-semibold text-[var(--accent-foreground)] shadow-lg transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
                  >
                    開始
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-8">
            <div
              className={[
                "grid gap-2 rounded-3xl border p-3 shadow-xl transition-colors sm:gap-3 sm:p-4",
                game.status === "lost"
                  ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                  : "border-[var(--border)] bg-[var(--surface)]",
              ].join(" ")}
              style={{ gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))` }}
            >
              {game.buttons.map((button) => {
                const isBomb = button.status === "bomb";
                const isSafe = button.status === "safe";
                const isRevealing = revealingButton?.index === button.index;
                const isDisabled =
                  game.status !== "playing" ||
                  button.status !== "hidden" ||
                  revealingButton !== null;

                return (
                  <button
                    key={button.index}
                    type="button"
                    onClick={() => handleButtonPress(button.index)}
                    disabled={isDisabled}
                    aria-label={`${button.index + 1}番のボタン`}
                    className={[
                      "relative flex aspect-square touch-manipulation items-center justify-center overflow-hidden rounded-2xl border text-2xl font-semibold shadow-sm transition sm:rounded-3xl sm:text-3xl",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]",
                      isBomb
                        ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-foreground)] shadow-2xl motion-safe:animate-pulse"
                        : isSafe
                          ? "border-[var(--border)] bg-[var(--surface-strong)] text-[var(--muted)]"
                          : "border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:-translate-y-0.5 hover:border-[var(--accent)] motion-safe:active:scale-95",
                      isDisabled ? "cursor-default" : "cursor-pointer",
                    ].join(" ")}
                  >
                    {isRevealing ? (
                      <span
                        className={[
                          "absolute inset-x-0 bottom-0 bg-[var(--accent)]/80 transition-[height] ease-out",
                          revealingButton?.isFilling ? "h-full" : "h-0",
                        ].join(" ")}
                        style={{ transitionDuration: `${REVEAL_DURATION_MS}ms` }}
                        aria-hidden="true"
                      />
                    ) : null}
                    <span className="relative z-10">
                      {isBomb ? "OUT" : isSafe ? "SAFE" : button.index + 1}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={resetGame}
              className="mx-auto mt-7 block rounded-full border border-[var(--border)] bg-[var(--surface)] px-6 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
            >
              やり直す
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function PlayerCountRollSelector({
  count,
  onPrevious,
  onNext,
}: {
  count: number;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const canSelectPrevious = count > MIN_PLAYER_COUNT;
  const canSelectNext = count < MAX_PLAYER_COUNT;

  return (
    <div
      className="rounded-3xl bg-[var(--surface-strong)] p-3 text-center sm:p-4"
      role="group"
      aria-label="プレイヤー人数"
    >
      <div className="flex items-stretch gap-3">
        <button
          type="button"
          onClick={onPrevious}
          disabled={!canSelectPrevious}
          className="flex w-14 touch-manipulation items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-3xl font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] disabled:opacity-25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-strong)] sm:w-16"
          aria-label="人数を減らす"
        >
          −
        </button>

        <div
          className="min-w-0 flex-1 rounded-3xl bg-[var(--accent)] px-5 py-5 text-[var(--accent-foreground)] shadow-lg"
          aria-live="polite"
          aria-atomic="true"
        >
          <p className="text-6xl font-semibold leading-none tracking-tight">{count}</p>
          <PlayerIconRows count={count} />
        </div>

        <button
          type="button"
          onClick={onNext}
          disabled={!canSelectNext}
          className="flex w-14 touch-manipulation items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-3xl font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] disabled:opacity-25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-strong)] sm:w-16"
          aria-label="人数を増やす"
        >
          ＋
        </button>
      </div>
    </div>
  );
}

function PlayerIconRows({ count }: { count: number }) {
  return (
    <div
      className="mt-4 flex min-h-10 flex-col items-center justify-center gap-1"
      aria-hidden="true"
    >
      {getPlayerIconRows(count).map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1.5">
          {row.map((iconIndex) => (
            <span key={iconIndex} className="h-4 w-3 rounded-full bg-[var(--accent-foreground)]" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function getPlayerIconRows(count: number): number[][] {
  const firstRowCount = count <= 4 ? count : Math.ceil(count / 2);
  const indexes = Array.from({ length: count }, (_, index) => index);

  return [indexes.slice(0, firstRowCount), indexes.slice(firstRowCount)].filter(
    (row) => row.length > 0,
  );
}

function playBakuon() {
  playTone({ frequencies: [120, 180, 240, 360], durationMs: 1500, gainValue: 0.42 });
}

function playTone({
  frequencies,
  durationMs,
  gainValue,
}: {
  frequencies: readonly number[];
  durationMs: number;
  gainValue: number;
}) {
  const AudioContextClass =
    window.AudioContext ??
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  if (!AudioContextClass) return;

  const audioContext = new AudioContextClass();
  const gain = audioContext.createGain();
  const now = audioContext.currentTime;
  const stopAt = now + durationMs / 1000;

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(gainValue, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, stopAt);
  gain.connect(audioContext.destination);

  for (const frequency of frequencies) {
    const oscillator = audioContext.createOscillator();
    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(frequency, now);
    oscillator.connect(gain);
    oscillator.start(now);
    oscillator.stop(stopAt);
  }

  window.setTimeout(() => void audioContext.close(), durationMs + 120);
}
