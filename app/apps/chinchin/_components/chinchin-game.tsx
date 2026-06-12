"use client";

import { useMemo, useState } from "react";
import {
  BOARD_SIZE,
  type Board,
  type GameStatus,
  type Player,
  createEmptyBoard,
  getGameStatus,
  getNextPlayer,
  getPlayerMark,
  placeMark,
  toPosition,
} from "@/app/apps/chinchin/_lib/game";

export function ChinchinGame() {
  const [board, setBoard] = useState<Board>(() => createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>(1);
  const [status, setStatus] = useState<GameStatus>({ type: "playing" });
  const [lastMoveIndex, setLastMoveIndex] = useState<number | null>(null);

  const winningCellSet = useMemo(() => {
    return new Set(status.type === "won" ? status.winningCells : []);
  }, [status]);

  function handleCellClick(index: number) {
    if (status.type !== "playing" || board[index] !== null) {
      return;
    }

    const nextBoard = placeMark(board, index, currentPlayer);
    const nextStatus = getGameStatus(nextBoard, index, currentPlayer);

    setBoard(nextBoard);
    setStatus(nextStatus);
    setLastMoveIndex(index);

    if (nextStatus.type === "playing") {
      setCurrentPlayer((player) => getNextPlayer(player));
    }
  }

  function resetGame() {
    setBoard(createEmptyBoard());
    setCurrentPlayer(1);
    setStatus({ type: "playing" });
    setLastMoveIndex(null);
  }

  const statusLabel = getStatusLabel(status, currentPlayer);
  const currentMark = getPlayerMark(currentPlayer);

  return (
    <main className="relative overflow-hidden">
      <div
        className="absolute -right-24 top-16 h-64 w-64 rounded-full border border-[var(--accent)]/10 sm:h-80 sm:w-80"
        aria-hidden="true"
      />
      <div
        className="absolute -left-20 bottom-20 h-52 w-52 rounded-full bg-[var(--accent-soft)]/60"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-10">
        <header className="mb-6 flex items-end justify-between gap-4 sm:mb-8 lg:mx-auto lg:w-full lg:max-w-[46.5rem]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Board
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">
              ちんちんゲーム
            </h1>
          </div>
          <button
            type="button"
            onClick={resetGame}
            className="shrink-0 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] motion-reduce:hover:translate-y-0"
          >
            リセット
          </button>
        </header>

        <section className="grid gap-4 sm:gap-6 lg:grid-cols-[minmax(0,30rem)_15rem] lg:items-start lg:justify-center">
          <aside
            aria-live="polite"
            aria-atomic="true"
            className={[
              "flex items-center justify-between rounded-2xl bg-[var(--accent)] px-5 py-4 text-white shadow-lg transition-shadow lg:col-start-2 lg:row-start-1 lg:block lg:rounded-3xl lg:px-6 lg:py-7",
              status.type === "won" ? "ring-4 ring-[var(--highlight)]/35" : "",
            ].join(" ")}
          >
            <div
              key={statusLabel}
              className="motion-safe:animate-[chinchin-status-in_240ms_ease-out]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                Status
              </p>
              <p className="mt-1 text-lg font-semibold lg:mt-3 lg:text-xl">{statusLabel}</p>
            </div>

            {status.type === "playing" ? (
              <div className="flex items-center gap-3 lg:mt-8 lg:block">
                <p className="text-xs font-medium text-white/70 lg:text-sm">置く文字</p>
                <p className="text-4xl font-semibold leading-none text-[var(--highlight)] lg:mt-2 lg:text-7xl">
                  {currentMark}
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={resetGame}
                className="rounded-full bg-[var(--highlight)] px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] shadow-sm transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--accent)] lg:mt-8"
              >
                もう一度
              </button>
            )}
          </aside>

          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-xl sm:p-4 lg:col-start-1 lg:row-start-1">
            <div
              className="grid aspect-square w-full gap-1.5 sm:gap-2"
              style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))` }}
            >
              {board.map((mark, index) => {
                const { row, col } = toPosition(index);
                const isWinningCell = winningCellSet.has(index);
                const isDisabled = status.type !== "playing" || mark !== null;
                const winningCellIndex =
                  status.type === "won" ? status.winningCells.indexOf(index) : -1;

                return (
                  <button
                    key={`${row}-${col}`}
                    type="button"
                    onClick={() => handleCellClick(index)}
                    disabled={isDisabled}
                    aria-label={`${row + 1}行${col + 1}列`}
                    className={[
                      "relative flex aspect-square touch-manipulation items-center justify-center rounded-xl border text-3xl font-semibold transition duration-200 sm:rounded-2xl sm:text-5xl",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]",
                      isWinningCell
                        ? "z-10 border-[var(--accent)] bg-[var(--highlight)] text-[var(--foreground)] shadow-lg motion-safe:animate-[chinchin-win_620ms_ease-out_both]"
                        : "border-[var(--border)] bg-[var(--surface-strong)]",
                      isDisabled
                        ? "cursor-default"
                        : "cursor-pointer hover:border-[var(--accent)] hover:bg-[var(--surface)] motion-safe:active:scale-95",
                    ].join(" ")}
                    style={
                      winningCellIndex >= 0
                        ? { animationDelay: `${winningCellIndex * 90}ms` }
                        : undefined
                    }
                  >
                    {mark ? (
                      <span
                        key={`${index}-${mark}-${index === lastMoveIndex ? "latest" : "placed"}`}
                        className={[
                          isWinningCell ? "select-none blur-sm" : "",
                          index === lastMoveIndex && !isWinningCell
                            ? "motion-safe:animate-[chinchin-mark-in_240ms_ease-out]"
                            : "",
                        ].join(" ")}
                      >
                        {mark}
                      </span>
                    ) : null}
                    {isWinningCell ? (
                      <span className="pointer-events-none absolute inset-2 rounded-lg bg-white/20 backdrop-blur-[2px] sm:rounded-xl" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function getStatusLabel(status: GameStatus, currentPlayer: Player): string {
  if (status.type === "won") {
    return `Player ${status.winner} の勝利`;
  }

  if (status.type === "draw") {
    return "引き分け";
  }

  return `Player ${currentPlayer} の手番`;
}
