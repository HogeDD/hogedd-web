import type { CSSProperties } from "react";

export type AppTheme = Readonly<{
  background: string;
  foreground: string;
  surface: string;
  surfaceStrong: string;
  border: string;
  muted: string;
  accent: string;
  accentText?: string;
  accentForeground?: string;
  accentSoft: string;
  highlight: string;
}>;

export const defaultAppTheme: AppTheme = {
  background: "#f5f7f5",
  foreground: "#141816",
  surface: "#ffffff",
  surfaceStrong: "#eef3ef",
  border: "#d6ddd6",
  muted: "#5f6761",
  accent: "#173f34",
  accentText: "#173f34",
  accentForeground: "#ffffff",
  accentSoft: "#dde8e3",
  highlight: "#e5b841",
};

export const appThemePresets = {
  hogedd: defaultAppTheme,
  ocean: {
    background: "#f4f7f9",
    foreground: "#111820",
    surface: "#ffffff",
    surfaceStrong: "#eaf1f5",
    border: "#cedbe3",
    muted: "#56636c",
    accent: "#2393d5",
    accentText: "#174a68",
    accentSoft: "#dcebf3",
    highlight: "#e7a93f",
  },
  plum: {
    background: "#f8f5f8",
    foreground: "#1d171e",
    surface: "#ffffff",
    surfaceStrong: "#f2eaf2",
    border: "#dfd2df",
    muted: "#6a5c6b",
    accent: "#e24bd5",
    accentText: "#63355f",
    accentSoft: "#eedfec",
    highlight: "#d7a83d",
  },
  sunset: {
    background: "#faf6f2",
    foreground: "#211814",
    surface: "#ffffff",
    surfaceStrong: "#f4e9df",
    border: "#e2d2c4",
    muted: "#6c5b50",
    accent: "#e16547",
    accentText: "#7a3828",
    accentSoft: "#f2ddd5",
    highlight: "#d9a62e",
  },
  indigo: {
    background: "#f5f6fa",
    foreground: "#171923",
    surface: "#ffffff",
    surfaceStrong: "#ebedf6",
    border: "#d4d7e4",
    muted: "#5e6273",
    accent: "#6e85e7",
    accentText: "#39488a",
    accentSoft: "#e0e4f5",
    highlight: "#d6a930",
  },
  sakura: {
    background: "#faf5f7",
    foreground: "#201318",
    surface: "#ffffff",
    surfaceStrong: "#f4e7ed",
    border: "#e4cdd8",
    muted: "#695561",
    accent: "#e45b89",
    accentText: "#963656",
    accentSoft: "#f3dce4",
    highlight: "#dba838",
  },
  coral: {
    background: "#fff7f7",
    foreground: "#261718",
    surface: "#ffffff",
    surfaceStrong: "#ffe8e8",
    border: "#f3cccc",
    muted: "#705658",
    accent: "#f4514c",
    accentText: "#b52f35",
    accentForeground: "#ffffff",
    accentSoft: "#ffdede",
    highlight: "#ffd166",
  },
  mikan: {
    background: "#fcf8f1",
    foreground: "#231a0f",
    surface: "#ffffff",
    surfaceStrong: "#f8ecd9",
    border: "#ecd9ba",
    muted: "#6e5c44",
    accent: "#de6a0c",
    accentText: "#904508",
    accentSoft: "#f7e6cf",
    highlight: "#e5aa2c",
  },
  lemon: {
    background: "#fcfaee",
    foreground: "#1f1c0e",
    surface: "#ffffff",
    surfaceStrong: "#f6f0d0",
    border: "#e6dcab",
    muted: "#686244",
    accent: "#a88807",
    accentText: "#5f4d04",
    accentSoft: "#f2ecc8",
    highlight: "#e0bc26",
  },
  matcha: {
    background: "#f6f8ef",
    foreground: "#171a0f",
    surface: "#ffffff",
    surfaceStrong: "#ecf0da",
    border: "#d7dcbb",
    muted: "#5d6347",
    accent: "#769719",
    accentText: "#50621d",
    accentSoft: "#e7ecd1",
    highlight: "#d9a62e",
  },
  mint: {
    background: "#f1f9f6",
    foreground: "#102019",
    surface: "#ffffff",
    surfaceStrong: "#def0e9",
    border: "#bfded3",
    muted: "#4c6a5e",
    accent: "#119d7e",
    accentText: "#0b6450",
    accentSoft: "#d4ece3",
    highlight: "#dea92f",
  },
  sky: {
    background: "#f3f9fc",
    foreground: "#111a21",
    surface: "#ffffff",
    surfaceStrong: "#e1eff7",
    border: "#c3ddeb",
    muted: "#506470",
    accent: "#1e92d8",
    accentText: "#14618f",
    accentSoft: "#d8eaf4",
    highlight: "#dfa733",
  },
  lavender: {
    background: "#f8f6fb",
    foreground: "#171420",
    surface: "#ffffff",
    surfaceStrong: "#efeaf7",
    border: "#d9cfe9",
    muted: "#5f5871",
    accent: "#9c76e9",
    accentText: "#5f4496",
    accentSoft: "#e9e1f4",
    highlight: "#d6a930",
  },
  wine: {
    background: "#fbf5f6",
    foreground: "#201417",
    surface: "#ffffff",
    surfaceStrong: "#f4e6e9",
    border: "#e3cad1",
    muted: "#6d5159",
    accent: "#e45c85",
    accentText: "#7d2640",
    accentSoft: "#f2dde2",
    highlight: "#d9a62e",
  },
  sumi: {
    background: "#f6f6f4",
    foreground: "#161614",
    surface: "#ffffff",
    surfaceStrong: "#ebebe7",
    border: "#d5d5cf",
    muted: "#5c5c56",
    accent: "#767676",
    accentText: "#33332e",
    accentSoft: "#e7e7e1",
    highlight: "#d4a838",
  },
  melon: {
    background: "#eaf8ef",
    foreground: "#122418",
    surface: "#ffffff",
    surfaceStrong: "#d3f0de",
    border: "#a3dcb9",
    muted: "#3d6750",
    accent: "#1a9f5f",
    accentText: "#20714a",
    accentSoft: "#bdeacd",
    highlight: "#57d695",
  },
  flamingo: {
    background: "#fbeef2",
    foreground: "#2e0d1a",
    surface: "#ffffff",
    surfaceStrong: "#f7d9e2",
    border: "#e8aec3",
    muted: "#6f4254",
    accent: "#e45995",
    accentText: "#8c2a54",
    accentSoft: "#f3c8d6",
    highlight: "#ef7fa4",
  },
  tomato: {
    background: "#fcefed",
    foreground: "#2f100c",
    surface: "#ffffff",
    surfaceStrong: "#f8dcd6",
    border: "#ecaca1",
    muted: "#714842",
    accent: "#e4615a",
    accentText: "#882823",
    accentSoft: "#f5cdc5",
    highlight: "#ee7b67",
  },
  carrot: {
    background: "#fdf3e7",
    foreground: "#2e1d09",
    surface: "#ffffff",
    surfaceStrong: "#f9e5cb",
    border: "#ecc99c",
    muted: "#6f5331",
    accent: "#d76f15",
    accentText: "#8f4a0e",
    accentSoft: "#f6d9b3",
    highlight: "#f2a553",
  },
  himawari: {
    background: "#fdf9e3",
    foreground: "#292208",
    surface: "#ffffff",
    surfaceStrong: "#f8f0c0",
    border: "#e3d491",
    muted: "#696040",
    accent: "#a5891a",
    accentText: "#806a14",
    accentSoft: "#f3e9a8",
    highlight: "#ecd35e",
  },
  soda: {
    background: "#e9f7fa",
    foreground: "#0c2630",
    surface: "#ffffff",
    surfaceStrong: "#d0eef5",
    border: "#9bd6e4",
    muted: "#38636e",
    accent: "#1f96be",
    accentText: "#1b7390",
    accentSoft: "#bce6ef",
    highlight: "#65d4e8",
  },
  ruri: {
    background: "#eef4fc",
    foreground: "#101e35",
    surface: "#ffffff",
    surfaceStrong: "#dbe8f8",
    border: "#b1cbed",
    muted: "#46597d",
    accent: "#6088e5",
    accentText: "#2f4f99",
    accentSoft: "#cadcf4",
    highlight: "#7fa8ef",
  },
  grape: {
    background: "#f6f1fc",
    foreground: "#20123a",
    surface: "#ffffff",
    surfaceStrong: "#e9def7",
    border: "#c8b3ea",
    muted: "#5a4a78",
    accent: "#9e75e9",
    accentText: "#5d3a9e",
    accentSoft: "#dccdf2",
    highlight: "#b095ea",
  },
} as const satisfies Record<string, AppTheme>;

export function createAppTheme(overrides: Partial<AppTheme> = {}): AppTheme {
  return {
    ...defaultAppTheme,
    ...overrides,
  };
}

type AppThemeStyle = CSSProperties &
  Record<
    | "--background"
    | "--foreground"
    | "--surface"
    | "--surface-strong"
    | "--border"
    | "--muted"
    | "--accent"
    | "--accent-text"
    | "--accent-foreground"
    | "--accent-soft"
    | "--highlight",
    string
  >;

export function getAppThemeStyle(theme: AppTheme): AppThemeStyle {
  return {
    "--background": theme.background,
    "--foreground": theme.foreground,
    "--surface": theme.surface,
    "--surface-strong": theme.surfaceStrong,
    "--border": theme.border,
    "--muted": theme.muted,
    "--accent": theme.accent,
    "--accent-text": theme.accentText ?? theme.accent,
    "--accent-foreground": theme.accentForeground ?? "#ffffff",
    "--accent-soft": theme.accentSoft,
    "--highlight": theme.highlight,
  };
}
