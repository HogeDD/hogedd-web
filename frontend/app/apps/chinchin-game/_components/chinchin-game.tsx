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
} from "@/app/apps/chinchin-game/_lib/game";

export function ChinchinGame() {
  const [board, setBoard] = useState<Board>(() => createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>(1);
  const [status, setStatus] = useState<GameStatus>({ type: "playing" });

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

    if (nextStatus.type === "playing") {
      setCurrentPlayer((player) => getNextPlayer(player));
    }
  }

  function resetGame() {
    setBoard(createEmptyBoard());
    setCurrentPlayer(1);
    setStatus({ type: "playing" });
  }

  const statusLabel =
    status.type === "won"
      ? `Player ${status.winner} の勝利`
      : status.type === "draw"
        ? "引き分け"
        : `Player ${currentPlayer} の手番`;

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 pb-16 pt-4 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-[var(--border)] pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
              /apps/chinchin-game
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-4xl">
              ちんちんゲーム
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base sm:leading-8">
              5x5 の盤面で、Player 1 は「ち」、Player 2 は「ん」を交互に置きます。
              4マス連続で対象の並びを作ったプレイヤーが勝利です。
            </p>
          </div>

          <button
            type="button"
            onClick={resetGame}
            className="w-fit rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-semibold transition hover:bg-[var(--surface-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            リセット
          </button>
        </header>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
          <div className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-3 sm:p-4">
            <div
              className="grid aspect-square w-full gap-2"
              style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))` }}
            >
              {board.map((mark, index) => {
                const { row, col } = toPosition(index);
                const isWinningCell = winningCellSet.has(index);

                return (
                  <button
                    key={`${row}-${col}`}
                    type="button"
                    onClick={() => handleCellClick(index)}
                    disabled={status.type !== "playing" || mark !== null}
                    aria-label={`${row + 1}行${col + 1}列`}
                    className={[
                      "relative flex aspect-square items-center justify-center rounded-md border text-3xl font-semibold transition sm:text-5xl",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]",
                      isWinningCell
                        ? "border-[#b58a64] bg-[#d5b28e]"
                        : "border-[var(--border)] bg-[var(--surface-strong)] hover:border-[var(--accent)] hover:bg-white",
                      mark === null ? "cursor-pointer" : "cursor-default",
                    ].join(" ")}
                  >
                    {isWinningCell ? (
                      <span className="select-none blur-sm">{mark}</span>
                    ) : (
                      <span>{mark}</span>
                    )}
                    {isWinningCell ? (
                      <span className="pointer-events-none absolute inset-2 rounded bg-[rgba(255,255,255,0.22)] backdrop-blur-[2px]" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          <aside className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              Status
            </p>
            <p className="mt-2 text-xl font-semibold">{statusLabel}</p>

            {status.type === "playing" ? (
              <div className="mt-5 rounded-md border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                <p className="text-sm text-[var(--muted)]">置く文字</p>
                <p className="mt-2 text-5xl font-semibold">{getPlayerMark(currentPlayer)}</p>
              </div>
            ) : null}

            <div className="mt-5 space-y-3 text-sm leading-6 text-[var(--muted)]">
              <p>縦、横、斜めのどの方向でも勝利判定します。</p>
              <p>完成した4マスだけ、薄茶色とブラーで隠します。</p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
