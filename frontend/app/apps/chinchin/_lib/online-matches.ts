import {
  type Board,
  type GameStatus,
  type Player,
  createEmptyBoard,
  getGameStatus,
  getNextPlayer,
  placeMark,
} from "@/app/apps/chinchin/_lib/game";

export type OnlinePlayer = {
  id: string;
  player: Player;
};

export type OnlineMatchSnapshot = {
  id: string;
  board: Board;
  currentPlayer: Player;
  status: GameStatus;
  players: readonly OnlinePlayer[];
  createdAt: string;
  updatedAt: string;
};

type OnlineMatch = {
  id: string;
  board: Board;
  currentPlayer: Player;
  status: GameStatus;
  players: OnlinePlayer[];
  createdAt: Date;
  updatedAt: Date;
};

type OnlineMatchStore = {
  waitingMatchId: string | null;
  matches: Map<string, OnlineMatch>;
};

const globalStore = globalThis as typeof globalThis & {
  __chinchinOnlineMatchStore?: OnlineMatchStore;
};

const store =
  globalStore.__chinchinOnlineMatchStore ??
  (globalStore.__chinchinOnlineMatchStore = {
    waitingMatchId: null,
    matches: new Map<string, OnlineMatch>(),
  });

export function joinRandomMatch(): { match: OnlineMatchSnapshot; player: OnlinePlayer } {
  const waitingMatch = store.waitingMatchId ? store.matches.get(store.waitingMatchId) : null;

  if (waitingMatch && waitingMatch.players.length === 1 && waitingMatch.status.type === "playing") {
    const player = createOnlinePlayer(2);
    waitingMatch.players.push(player);
    waitingMatch.updatedAt = new Date();
    store.waitingMatchId = null;

    return { match: toSnapshot(waitingMatch), player };
  }

  const player = createOnlinePlayer(1);
  const match = createOnlineMatch(player);
  store.matches.set(match.id, match);
  store.waitingMatchId = match.id;

  return { match: toSnapshot(match), player };
}

export function getMatch(matchId: string): OnlineMatchSnapshot | null {
  const match = store.matches.get(matchId);
  return match ? toSnapshot(match) : null;
}

export function placeOnlineMove({
  matchId,
  playerId,
  index,
}: {
  matchId: string;
  playerId: string;
  index: number;
}): { match: OnlineMatchSnapshot; error: null } | { match: null; error: string } {
  const match = store.matches.get(matchId);
  if (!match) {
    return { match: null, error: "match not found" };
  }

  if (match.status.type !== "playing") {
    return { match: null, error: "match is finished" };
  }

  const player = match.players.find((candidate) => candidate.id === playerId);
  if (!player) {
    return { match: null, error: "player not found" };
  }

  if (match.players.length < 2) {
    return { match: null, error: "waiting for opponent" };
  }

  if (player.player !== match.currentPlayer) {
    return { match: null, error: "not your turn" };
  }

  if (!Number.isInteger(index) || index < 0 || index >= match.board.length) {
    return { match: null, error: "invalid cell index" };
  }

  if (match.board[index] !== null) {
    return { match: null, error: "cell already filled" };
  }

  const nextBoard = placeMark(match.board, index, player.player);
  const nextStatus = getGameStatus(nextBoard, index, player.player);

  match.board = nextBoard;
  match.status = nextStatus;
  match.updatedAt = new Date();

  if (nextStatus.type === "playing") {
    match.currentPlayer = getNextPlayer(player.player);
  }

  return { match: toSnapshot(match), error: null };
}

function createOnlineMatch(player: OnlinePlayer): OnlineMatch {
  const now = new Date();

  return {
    id: crypto.randomUUID(),
    board: createEmptyBoard(),
    currentPlayer: 1,
    status: { type: "playing" },
    players: [player],
    createdAt: now,
    updatedAt: now,
  };
}

function createOnlinePlayer(player: Player): OnlinePlayer {
  return {
    id: crypto.randomUUID(),
    player,
  };
}

function toSnapshot(match: OnlineMatch): OnlineMatchSnapshot {
  return {
    id: match.id,
    board: [...match.board],
    currentPlayer: match.currentPlayer,
    status: match.status,
    players: match.players.map((player) => ({ ...player })),
    createdAt: match.createdAt.toISOString(),
    updatedAt: match.updatedAt.toISOString(),
  };
}
