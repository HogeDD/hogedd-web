export const BOARD_SIZE = 5;
export const WIN_LENGTH = 4;

export type Player = 1 | 2;
export type Mark = "ち" | "ん";
export type Cell = Mark | null;
export type Board = readonly Cell[];

export type Position = {
  row: number;
  col: number;
};

export type GameStatus =
  | { type: "playing" }
  | { type: "won"; winner: Player; winningCells: readonly number[] }
  | { type: "draw" };

const DIRECTIONS: readonly Position[] = [
  { row: 0, col: 1 },
  { row: 1, col: 0 },
  { row: 1, col: 1 },
  { row: 1, col: -1 },
];

export function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_SIZE * BOARD_SIZE }, () => null);
}

export function getPlayerMark(player: Player): Mark {
  return player === 1 ? "ち" : "ん";
}

export function getNextPlayer(player: Player): Player {
  return player === 1 ? 2 : 1;
}

export function toIndex({ row, col }: Position): number {
  return row * BOARD_SIZE + col;
}

export function toPosition(index: number): Position {
  return {
    row: Math.floor(index / BOARD_SIZE),
    col: index % BOARD_SIZE,
  };
}

export function placeMark(board: Board, index: number, player: Player): Board {
  if (board[index] !== null) {
    return board;
  }

  const nextBoard = [...board];
  nextBoard[index] = getPlayerMark(player);
  return nextBoard;
}

export function getGameStatus(
  board: Board,
  lastMoveIndex: number | null,
  player: Player,
): GameStatus {
  if (lastMoveIndex !== null) {
    const winningCells = findWinningCells(board, lastMoveIndex);
    if (winningCells.length > 0) {
      return { type: "won", winner: player, winningCells };
    }
  }

  if (board.every(Boolean)) {
    return { type: "draw" };
  }

  return { type: "playing" };
}

function findWinningCells(board: Board, lastMoveIndex: number): readonly number[] {
  const lastMove = toPosition(lastMoveIndex);

  for (const direction of DIRECTIONS) {
    for (let offset = 0; offset < WIN_LENGTH; offset += 1) {
      const start = {
        row: lastMove.row - direction.row * offset,
        col: lastMove.col - direction.col * offset,
      };
      const cells = getLineCells(start, direction);

      if (cells.includes(lastMoveIndex) && isWinningLine(board, cells)) {
        return cells;
      }
    }
  }

  return [];
}

function getLineCells(start: Position, direction: Position): readonly number[] {
  const cells: number[] = [];

  for (let step = 0; step < WIN_LENGTH; step += 1) {
    const row = start.row + direction.row * step;
    const col = start.col + direction.col * step;

    if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) {
      return [];
    }

    cells.push(toIndex({ row, col }));
  }

  return cells;
}

function isWinningLine(board: Board, cells: readonly number[]): boolean {
  if (cells.length !== WIN_LENGTH) {
    return false;
  }

  const marks = cells.map((index) => board[index]).join("");
  return marks === "ちんちん" || marks === "んちんち";
}
