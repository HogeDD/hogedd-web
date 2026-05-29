"use client";

import { useEffect, useMemo, useState } from "react";
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
import type { OnlineMatchSnapshot, OnlinePlayer } from "@/app/apps/chinchin/_lib/online-matches";

type GameMode = "local" | "online";

type OnlineSession = {
  matchId: string;
  player: OnlinePlayer;
};

type JoinRandomMatchResponse = {
  match: OnlineMatchSnapshot;
  player: OnlinePlayer;
};

type MatchResponse = {
  match: OnlineMatchSnapshot;
};

export function ChinchinGame() {
  const [mode, setMode] = useState<GameMode>("local");
  const [board, setBoard] = useState<Board>(() => createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>(1);
  const [status, setStatus] = useState<GameStatus>({ type: "playing" });
  const [onlineSession, setOnlineSession] = useState<OnlineSession | null>(null);
  const [onlineMatch, setOnlineMatch] = useState<OnlineMatchSnapshot | null>(null);
  const [onlineMessage, setOnlineMessage] = useState("ランダム対戦を開始できます。");
  const [isJoining, setIsJoining] = useState(false);
  const [isSendingMove, setIsSendingMove] = useState(false);

  const activeBoard = mode === "online" && onlineMatch ? onlineMatch.board : board;
  const activeStatus = mode === "online" && onlineMatch ? onlineMatch.status : status;
  const activeCurrentPlayer =
    mode === "online" && onlineMatch ? onlineMatch.currentPlayer : currentPlayer;

  const winningCellSet = useMemo(() => {
    return new Set(activeStatus.type === "won" ? activeStatus.winningCells : []);
  }, [activeStatus]);

  useEffect(() => {
    if (mode !== "online" || !onlineSession) {
      return;
    }

    let isMounted = true;
    const session = onlineSession;

    async function refreshMatch() {
      try {
        const response = await fetch(`/apps/chinchin/api/matches/${session.matchId}`, {
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error("match refresh failed");
        }

        const data = (await response.json()) as MatchResponse;
        if (isMounted) {
          setOnlineMatch(data.match);
        }
      } catch {
        if (isMounted) {
          setOnlineMessage("対戦状態を取得できませんでした。");
        }
      }
    }

    void refreshMatch();
    const intervalId = window.setInterval(() => void refreshMatch(), 1200);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, [mode, onlineSession]);

  function handleCellClick(index: number) {
    if (mode === "online") {
      void handleOnlineCellClick(index);
      return;
    }

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

  async function handleOnlineCellClick(index: number) {
    if (!onlineSession || !onlineMatch || isSendingMove) {
      return;
    }

    if (!canPlaceOnlineMove(index)) {
      return;
    }

    setIsSendingMove(true);
    setOnlineMessage("送信中です。");

    try {
      const response = await fetch(`/apps/chinchin/api/matches/${onlineSession.matchId}/moves`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId: onlineSession.player.id, index }),
      });
      const data = (await response.json()) as Partial<MatchResponse> & { error?: string };

      if (!response.ok || !data.match) {
        setOnlineMessage(data.error ?? "手を送信できませんでした。");
        return;
      }

      setOnlineMatch(data.match);
      setOnlineMessage("手を送信しました。");
    } catch {
      setOnlineMessage("通信に失敗しました。");
    } finally {
      setIsSendingMove(false);
    }
  }

  function canPlaceOnlineMove(index: number): boolean {
    if (!onlineSession || !onlineMatch) {
      return false;
    }

    return (
      onlineMatch.status.type === "playing" &&
      onlineMatch.players.length === 2 &&
      onlineMatch.currentPlayer === onlineSession.player.player &&
      onlineMatch.board[index] === null
    );
  }

  function resetLocalGame() {
    setBoard(createEmptyBoard());
    setCurrentPlayer(1);
    setStatus({ type: "playing" });
  }

  async function joinOnlineMatch() {
    setMode("online");
    setIsJoining(true);
    setOnlineMessage("ランダム対戦を探しています。");

    try {
      const response = await fetch("/apps/chinchin/api/matches/random", { method: "POST" });
      if (!response.ok) {
        throw new Error("join failed");
      }

      const data = (await response.json()) as JoinRandomMatchResponse;
      setOnlineSession({ matchId: data.match.id, player: data.player });
      setOnlineMatch(data.match);
      setOnlineMessage(
        data.match.players.length === 1
          ? "相手を待っています。別端末でもランダム対戦を開始してください。"
          : "マッチしました。",
      );
    } catch {
      setOnlineMessage("ランダム対戦を開始できませんでした。");
    } finally {
      setIsJoining(false);
    }
  }

  function leaveOnlineMatch() {
    setMode("local");
    setOnlineSession(null);
    setOnlineMatch(null);
    setOnlineMessage("ランダム対戦を開始できます。");
  }

  const statusLabel = getStatusLabel({
    mode,
    status: activeStatus,
    currentPlayer: activeCurrentPlayer,
    onlineSession,
    onlineMatch,
  });

  const currentMark =
    mode === "online" && onlineSession
      ? getPlayerMark(onlineSession.player.player)
      : getPlayerMark(currentPlayer);

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 pb-16 pt-4 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-[var(--border)] pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
              /apps/chinchin
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-4xl">
              ちんちんゲーム
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base sm:leading-8">
              5x5 の盤面で、Player 1 は「ち」、Player 2 は「ん」を交互に置きます。
              4マス連続で対象の並びを作ったプレイヤーが勝利です。
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={resetLocalGame}
              disabled={mode === "online"}
              className="w-fit rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-semibold transition hover:bg-[var(--surface-strong)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              リセット
            </button>
            {mode === "online" ? (
              <button
                type="button"
                onClick={leaveOnlineMatch}
                className="w-fit rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-semibold transition hover:bg-[var(--surface-strong)]"
              >
                ローカルへ戻る
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void joinOnlineMatch()}
                disabled={isJoining}
                className="w-fit rounded-md bg-[var(--accent)] px-3 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                ランダム対戦
              </button>
            )}
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
          <div className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-3 sm:p-4">
            <div
              className="grid aspect-square w-full gap-2"
              style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))` }}
            >
              {activeBoard.map((mark, index) => {
                const { row, col } = toPosition(index);
                const isWinningCell = winningCellSet.has(index);
                const isDisabled =
                  mode === "online"
                    ? !canPlaceOnlineMove(index) || isSendingMove
                    : status.type !== "playing" || mark !== null;

                return (
                  <button
                    key={`${row}-${col}`}
                    type="button"
                    onClick={() => handleCellClick(index)}
                    disabled={isDisabled}
                    aria-label={`${row + 1}行${col + 1}列`}
                    className={[
                      "relative flex aspect-square touch-manipulation items-center justify-center rounded-md border text-3xl font-semibold transition sm:text-5xl",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]",
                      isWinningCell
                        ? "border-[#b58a64] bg-[#d5b28e]"
                        : "border-[var(--border)] bg-[var(--surface-strong)] hover:border-[var(--accent)] hover:bg-white",
                      isDisabled ? "cursor-default" : "cursor-pointer",
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

            {activeStatus.type === "playing" ? (
              <div className="mt-5 rounded-md border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                <p className="text-sm text-[var(--muted)]">
                  {mode === "online" ? "あなたの文字" : "置く文字"}
                </p>
                <p className="mt-2 text-5xl font-semibold">{currentMark}</p>
              </div>
            ) : null}

            {mode === "online" ? (
              <div className="mt-5 rounded-md border border-[var(--border)] bg-[var(--surface-strong)] p-4 text-sm leading-6 text-[var(--muted)]">
                <p>{onlineMessage}</p>
                {onlineSession ? (
                  <p className="mt-2">
                    Match: <span className="font-mono">{onlineSession.matchId.slice(0, 8)}</span>
                  </p>
                ) : null}
              </div>
            ) : null}

            <div className="mt-5 space-y-3 text-sm leading-6 text-[var(--muted)]">
              <p>縦、横、斜めのどの方向でも勝利判定します。</p>
              <p>完成した4マスだけ、薄茶色とブラーで隠します。</p>
              <p>オンライン対戦は開発用の簡易マッチングです。サーバー再起動で消えます。</p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

function getStatusLabel({
  mode,
  status,
  currentPlayer,
  onlineSession,
  onlineMatch,
}: {
  mode: GameMode;
  status: GameStatus;
  currentPlayer: Player;
  onlineSession: OnlineSession | null;
  onlineMatch: OnlineMatchSnapshot | null;
}): string {
  if (status.type === "won") {
    if (mode === "online" && onlineSession) {
      return status.winner === onlineSession.player.player ? "あなたの勝利" : "相手の勝利";
    }

    return `Player ${status.winner} の勝利`;
  }

  if (status.type === "draw") {
    return "引き分け";
  }

  if (mode === "online") {
    if (!onlineSession || !onlineMatch) {
      return "ランダム対戦";
    }

    if (onlineMatch.players.length < 2) {
      return "相手待ち";
    }

    return onlineMatch.currentPlayer === onlineSession.player.player
      ? "あなたの手番"
      : "相手の手番";
  }

  return `Player ${currentPlayer} の手番`;
}
