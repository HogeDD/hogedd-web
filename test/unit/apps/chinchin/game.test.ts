import { describe, expect, it } from "vitest";
import {
  BOARD_SIZE,
  createEmptyBoard,
  getGameStatus,
  placeMark,
} from "@/app/apps/chinchin/_lib/game";

describe("chinchin game", () => {
  it("creates an empty 5x5 board", () => {
    const board = createEmptyBoard();

    expect(board).toHaveLength(BOARD_SIZE * BOARD_SIZE);
    expect(board.every((cell) => cell === null)).toBe(true);
  });

  it("places a mark without mutating the original board", () => {
    const board = createEmptyBoard();
    const nextBoard = placeMark(board, 0, 1);

    expect(board[0]).toBeNull();
    expect(nextBoard[0]).toBe("ち");
  });

  it("detects a horizontal ちんちん line", () => {
    let board = createEmptyBoard();
    board = placeMark(board, 0, 1);
    board = placeMark(board, 1, 2);
    board = placeMark(board, 2, 1);
    board = placeMark(board, 3, 2);

    expect(getGameStatus(board, 3, 2)).toEqual({
      type: "won",
      winner: 2,
      winningCells: [0, 1, 2, 3],
    });
  });
});
