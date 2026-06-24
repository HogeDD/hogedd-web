"use client";

import { useMemo, useState } from "react";
import {
  MAX_PLAYER_COUNT,
  MIN_PLAYER_COUNT,
  type BakuonGame,
  createGame,
  pressButton,
} from "@/app/apps/bakuon-kikiippatsu/_lib/game";

const playerCounts = Array.from(
  { length: MAX_PLAYER_COUNT - MIN_PLAYER_COUNT + 1 },
  (_, index) => MIN_PLAYER_COUNT + index,
);

export function BakuonKikiippatsuClient() {
  const [playerCount, setPlayerCount] = useState(3);
  const [game, setGame] = useState<BakuonGame | null>(null);

  const gridColumns = useMemo(() => {
    if (!game) return 3;
    if (game.buttons.length <= 9) return 3;
    if (game.buttons.length <= 18) return 4;
    return 5;
  }, [game]);

  function startGame() {
    setGame(createGame({ playerCount }));
  }

  function resetGame() {
    setGame(null);
  }

  function handleButtonPress(index: number) {
    if (!game) return;

    const selectedButton = game.buttons[index];
    if (!selectedButton || selectedButton.status !== "hidden") return;

    const nextGame = pressButton(game, index);
    setGame(nextGame);

    if (selectedButton.hasBomb) {
      playBakuon();
    } else {
      playSafeClick();
    }
  }

  const statusLabel = game
    ? game.status === "lost"
      ? "爆音。押した人の負け。"
      : `セーフ ${game.safePressCount} 回。次の人、どうぞ。`
    : "人数を選んで、音量を上げてから開始。";

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
            Sound Trap
          </p>
          <h1 className="mt-3 text-5xl font-semibold tracking-tight sm:text-7xl">爆音危機一髪</h1>
          <p className="mx-auto mt-5 max-w-md text-base leading-7 text-[var(--muted)]">
            1つだけ爆音が鳴るボタンがあります。順番は自分たちで決めて、1人ずつ押してください。
          </p>
        </header>

        <div
          className={[
            "mt-8 rounded-3xl px-5 py-5 text-center shadow-lg transition-colors sm:px-7",
            game?.status === "lost"
              ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
              : "bg-[var(--surface)] text-[var(--foreground)]",
          ].join(" ")}
          role="status"
          aria-live="polite"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] opacity-70">Status</p>
          <p className="mt-2 text-xl font-semibold">{statusLabel}</p>
        </div>

        {!game ? (
          <div className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xl sm:p-7">
            <p className="text-sm font-semibold text-[var(--muted)]">人数</p>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {playerCounts.map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setPlayerCount(count)}
                  className={[
                    "touch-manipulation rounded-2xl border px-4 py-4 text-lg font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]",
                    playerCount === count
                      ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-foreground)]"
                      : "border-[var(--border)] bg-[var(--surface-strong)] text-[var(--foreground)] hover:border-[var(--accent)]",
                  ].join(" ")}
                  aria-pressed={playerCount === count}
                >
                  {count}
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-[var(--surface-strong)] px-5 py-4">
              <p className="text-base font-semibold">音量MAXにしましたか？</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                端末の音量を上げてから始めてください。消音モードだと台無しです。
              </p>
            </div>

            <button
              type="button"
              onClick={startGame}
              className="mt-6 w-full touch-manipulation rounded-full bg-[var(--accent)] px-6 py-4 text-base font-semibold text-[var(--accent-foreground)] shadow-lg transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
            >
              音量MAXで開始
            </button>
          </div>
        ) : (
          <div className="mt-8">
            <div
              className="grid gap-2 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-xl sm:gap-3 sm:p-4"
              style={{ gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))` }}
            >
              {game.buttons.map((button) => {
                const isBomb = button.status === "bomb";
                const isSafe = button.status === "safe";
                const isDisabled = game.status !== "playing" || button.status !== "hidden";

                return (
                  <button
                    key={button.index}
                    type="button"
                    onClick={() => handleButtonPress(button.index)}
                    disabled={isDisabled}
                    aria-label={`${button.index + 1}番のボタン`}
                    className={[
                      "flex aspect-square touch-manipulation items-center justify-center rounded-2xl border text-2xl font-semibold shadow-sm transition sm:rounded-3xl sm:text-3xl",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]",
                      isBomb
                        ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-foreground)] motion-safe:animate-pulse"
                        : isSafe
                          ? "border-[var(--border)] bg-[var(--surface-strong)] text-[var(--muted)]"
                          : "border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:-translate-y-0.5 hover:border-[var(--accent)] motion-safe:active:scale-95",
                      isDisabled ? "cursor-default" : "cursor-pointer",
                    ].join(" ")}
                  >
                    {isBomb ? "爆" : isSafe ? "済" : button.index + 1}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={resetGame}
              className="mx-auto mt-7 block rounded-full border border-[var(--border)] bg-[var(--surface)] px-6 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
            >
              人数選択からやり直す
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function playSafeClick() {
  playTone({ frequencies: [360], durationMs: 120, gainValue: 0.04 });
}

function playBakuon() {
  playTone({ frequencies: [220, 330, 440], durationMs: 900, gainValue: 0.18 });
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
