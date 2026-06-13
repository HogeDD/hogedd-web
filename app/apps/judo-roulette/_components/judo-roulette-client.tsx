"use client";

import { useEffect, useRef, useState, type FormEvent, type PointerEvent } from "react";
import { getStopRotation } from "@/app/apps/judo-roulette/_lib/roulette";

type Choice = {
  id: string;
  label: string;
};

const INITIAL_CHOICES: readonly Choice[] = [
  { id: "red", label: "赤" },
  { id: "blue", label: "青" },
  { id: "white", label: "白" },
  { id: "black", label: "黒" },
];

const MAX_CHOICES = 12;
const SPIN_DURATION_MS = 4000;

export function JudoRouletteClient() {
  const [choices, setChoices] = useState<readonly Choice[]>(INITIAL_CHOICES);
  const [newChoice, setNewChoice] = useState("");
  const [riggedChoiceId, setRiggedChoiceId] = useState(INITIAL_CHOICES[0].id);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isRigging, setIsRigging] = useState(false);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resultTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
      if (resultTimerRef.current) clearTimeout(resultTimerRef.current);
    },
    [],
  );

  function addChoice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const label = newChoice.trim();
    if (!label || choices.length >= MAX_CHOICES || isSpinning) return;

    setChoices((current) => [...current, { id: crypto.randomUUID(), label: label.slice(0, 20) }]);
    setNewChoice("");
    setResult(null);
  }

  function removeChoice(id: string) {
    if (choices.length <= 2 || isSpinning) return;

    const remaining = choices.filter((choice) => choice.id !== id);
    setChoices(remaining);
    if (riggedChoiceId === id) {
      setRiggedChoiceId(remaining[0].id);
    }
    setResult(null);
  }

  function spin() {
    if (isSpinning) return;

    const selectedIndex = Math.max(
      0,
      choices.findIndex((choice) => choice.id === riggedChoiceId),
    );
    const nextRotation = getStopRotation({
      choiceCount: choices.length,
      selectedIndex,
      currentRotation: rotation,
      extraTurns: 5 + Math.floor(Math.random() * 3),
    });

    setResult(null);
    setIsSpinning(true);
    setRotation(nextRotation);
    resultTimerRef.current = setTimeout(() => {
      setIsSpinning(false);
      setResult(choices[selectedIndex].label);
    }, SPIN_DURATION_MS);
  }

  function beginRigging(event: PointerEvent<HTMLButtonElement>) {
    if (isSpinning) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    holdTimerRef.current = setTimeout(() => setIsRigging(true), 900);
  }

  function cancelRiggingHold() {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  }

  const wheelBackground = buildWheelBackground(choices.length);

  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <button
        type="button"
        onPointerDown={beginRigging}
        onPointerUp={cancelRiggingHold}
        onPointerCancel={cancelRiggingHold}
        onContextMenu={(event) => event.preventDefault()}
        className="touch-none text-left"
        aria-label="柔道ルーレット"
      >
        <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
          Judo Roulette
        </span>
        <span className="mt-4 block text-5xl font-semibold tracking-tight sm:text-6xl">
          柔道ルーレット
        </span>
      </button>

      <div className="relative mx-auto mt-14 aspect-square w-full max-w-md">
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-[-0.5rem] z-10 h-0 w-0 -translate-x-1/2 border-x-[14px] border-t-[24px] border-x-transparent border-t-[var(--accent)]"
        />
        <div
          className="relative h-full w-full overflow-hidden rounded-full border-8 border-[var(--surface)] shadow-[0_18px_50px_rgba(0,0,0,0.12)]"
          style={{
            background: wheelBackground,
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning
              ? `transform ${SPIN_DURATION_MS}ms cubic-bezier(0.12, 0.7, 0.08, 1)`
              : "none",
          }}
        >
          {choices.map((choice, index) => (
            <div
              key={choice.id}
              className="absolute inset-0"
              style={{ transform: `rotate(${(index + 0.5) * (360 / choices.length)}deg)` }}
            >
              <span className="absolute left-1/2 top-[9%] max-w-[35%] -translate-x-1/2 truncate text-sm font-semibold text-white drop-shadow-sm sm:text-base">
                {choice.label}
              </span>
            </div>
          ))}
          <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-8 border-[var(--surface)] bg-[var(--accent)]" />
        </div>
      </div>

      <div className="mt-10 text-center">
        <button
          type="button"
          onClick={spin}
          disabled={isSpinning}
          className="rounded-full bg-[var(--accent)] px-12 py-4 text-base font-semibold text-white transition hover:opacity-85 disabled:cursor-wait disabled:opacity-55"
        >
          {isSpinning ? "回転中..." : "回す"}
        </button>
        <p className="mt-6 min-h-9 text-2xl font-semibold" role="status" aria-live="polite">
          {result ? `${result}！` : ""}
        </p>
      </div>

      <div className="mt-14 bg-[var(--surface-strong)] px-5 py-6 sm:px-7">
        <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
          選択肢
        </h2>
        <form onSubmit={addChoice} className="mt-5 flex gap-2">
          <input
            value={newChoice}
            onChange={(event) => setNewChoice(event.target.value)}
            disabled={isSpinning || choices.length >= MAX_CHOICES}
            maxLength={20}
            placeholder="選択肢を入力"
            aria-label="追加する選択肢"
            className="min-w-0 flex-1 rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-3 text-base outline-none focus:border-[var(--accent)]"
          />
          <button
            type="submit"
            disabled={!newChoice.trim() || isSpinning || choices.length >= MAX_CHOICES}
            className="rounded-full border border-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--accent)] disabled:opacity-40"
          >
            追加
          </button>
        </form>
        <ul className="mt-5 space-y-2">
          {choices.map((choice) => (
            <li
              key={choice.id}
              className="flex items-center justify-between gap-4 border-b border-[var(--border)] py-2"
            >
              <span className="min-w-0 truncate">{choice.label}</span>
              <button
                type="button"
                onClick={() => removeChoice(choice.id)}
                disabled={choices.length <= 2 || isSpinning}
                className="shrink-0 text-xs text-[var(--muted)] underline underline-offset-4 disabled:no-underline disabled:opacity-35"
              >
                削除
              </button>
            </li>
          ))}
        </ul>
      </div>

      {isRigging && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/55 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="rigging-title"
            className="w-full max-w-sm bg-[var(--surface)] p-7 text-[var(--foreground)] shadow-2xl"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Secret
            </p>
            <h2 id="rigging-title" className="mt-3 text-2xl font-semibold">
              仕込み先を選ぶ
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-2">
              {choices.map((choice) => (
                <button
                  key={choice.id}
                  type="button"
                  onClick={() => {
                    setRiggedChoiceId(choice.id);
                    setIsRigging(false);
                  }}
                  className="truncate border border-[var(--border)] px-4 py-3 text-sm font-semibold hover:border-[var(--accent)]"
                >
                  {choice.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setIsRigging(false)}
              className="mt-6 text-sm text-[var(--muted)] underline underline-offset-4"
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function buildWheelBackground(choiceCount: number): string {
  const sector = 360 / choiceCount;
  const segments = Array.from({ length: choiceCount }, (_, index) => {
    const color = index % 2 === 0 ? "var(--accent)" : "var(--highlight)";
    return `${color} ${index * sector}deg ${(index + 1) * sector}deg`;
  });
  return `conic-gradient(${segments.join(", ")})`;
}
