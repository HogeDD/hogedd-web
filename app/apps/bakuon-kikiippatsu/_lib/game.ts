export const MIN_PLAYER_COUNT = 2;
export const MAX_PLAYER_COUNT = 8;
export const BUTTONS_PER_PLAYER = 3;

export type BakuonButtonStatus = "hidden" | "safe" | "bomb";

export type BakuonButton = Readonly<{
  index: number;
  hasBomb: boolean;
  status: BakuonButtonStatus;
}>;

export type BakuonGameStatus = "playing" | "lost";

export type BakuonGame = Readonly<{
  playerCount: number;
  buttons: readonly BakuonButton[];
  status: BakuonGameStatus;
  safePressCount: number;
  lostButtonIndex: number | null;
}>;

type CreateGameOptions = {
  playerCount: number;
  bombIndex?: number;
  random?: () => number;
};

export function getButtonCount(playerCount: number): number {
  assertPlayerCount(playerCount);
  return playerCount * BUTTONS_PER_PLAYER;
}

export function createGame({
  playerCount,
  bombIndex,
  random = Math.random,
}: CreateGameOptions): BakuonGame {
  const buttonCount = getButtonCount(playerCount);
  const resolvedBombIndex = bombIndex ?? Math.floor(random() * buttonCount);

  if (
    !Number.isInteger(resolvedBombIndex) ||
    resolvedBombIndex < 0 ||
    resolvedBombIndex >= buttonCount
  ) {
    throw new Error("bombIndex must point to an existing button");
  }

  return {
    playerCount,
    buttons: Array.from({ length: buttonCount }, (_, index) => ({
      index,
      hasBomb: index === resolvedBombIndex,
      status: "hidden",
    })),
    status: "playing",
    safePressCount: 0,
    lostButtonIndex: null,
  };
}

export function pressButton(game: BakuonGame, index: number): BakuonGame {
  if (game.status !== "playing") {
    return game;
  }

  const selectedButton = game.buttons[index];
  if (!selectedButton || selectedButton.status !== "hidden") {
    return game;
  }

  const nextStatus: BakuonButtonStatus = selectedButton.hasBomb ? "bomb" : "safe";
  const buttons = game.buttons.map((button) =>
    button.index === index ? { ...button, status: nextStatus } : button,
  );

  if (selectedButton.hasBomb) {
    return {
      ...game,
      buttons,
      status: "lost",
      lostButtonIndex: index,
    };
  }

  return {
    ...game,
    buttons,
    safePressCount: game.safePressCount + 1,
  };
}

function assertPlayerCount(playerCount: number) {
  if (
    !Number.isInteger(playerCount) ||
    playerCount < MIN_PLAYER_COUNT ||
    playerCount > MAX_PLAYER_COUNT
  ) {
    throw new Error(
      `playerCount must be an integer from ${MIN_PLAYER_COUNT} to ${MAX_PLAYER_COUNT}`,
    );
  }
}
