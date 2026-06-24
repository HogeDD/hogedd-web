import { describe, expect, it } from "vitest";
import {
  BUTTONS_PER_PLAYER,
  MAX_PLAYER_COUNT,
  MIN_PLAYER_COUNT,
  createGame,
  getButtonCount,
  pressButton,
} from "@/app/apps/bakuon-kikiippatsu/_lib/game";

describe("bakuon kikiippatsu game", () => {
  it("places three buttons for each player", () => {
    expect(getButtonCount(MIN_PLAYER_COUNT)).toBe(MIN_PLAYER_COUNT * BUTTONS_PER_PLAYER);
    expect(getButtonCount(MAX_PLAYER_COUNT)).toBe(MAX_PLAYER_COUNT * BUTTONS_PER_PLAYER);
  });

  it("rejects unsupported player counts", () => {
    expect(() => getButtonCount(MIN_PLAYER_COUNT - 1)).toThrow("playerCount");
    expect(() => getButtonCount(MAX_PLAYER_COUNT + 1)).toThrow("playerCount");
    expect(() => getButtonCount(2.5)).toThrow("playerCount");
  });

  it("creates a game with exactly one bomb button", () => {
    const game = createGame({ playerCount: 4, bombIndex: 7 });

    expect(game.buttons).toHaveLength(12);
    expect(game.buttons.filter((button) => button.hasBomb)).toHaveLength(1);
    expect(game.buttons[7]).toMatchObject({ hasBomb: true, status: "hidden" });
    expect(game.status).toBe("playing");
  });

  it("marks a safe button without ending the game", () => {
    const game = createGame({ playerCount: 3, bombIndex: 4 });
    const nextGame = pressButton(game, 2);

    expect(nextGame.status).toBe("playing");
    expect(nextGame.buttons[2]).toMatchObject({ hasBomb: false, status: "safe" });
    expect(nextGame.safePressCount).toBe(1);
  });

  it("ends the game when the bomb button is pressed", () => {
    const game = createGame({ playerCount: 3, bombIndex: 4 });
    const nextGame = pressButton(game, 4);

    expect(nextGame.status).toBe("lost");
    expect(nextGame.lostButtonIndex).toBe(4);
    expect(nextGame.buttons[4]).toMatchObject({ hasBomb: true, status: "bomb" });
  });

  it("ignores presses after the game has ended", () => {
    const game = pressButton(createGame({ playerCount: 2, bombIndex: 0 }), 0);

    expect(pressButton(game, 1)).toBe(game);
  });
});
