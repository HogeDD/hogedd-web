import type { CSSProperties } from "react";

export type AppTheme = Readonly<{
  background: string;
  foreground: string;
  surface: string;
  surfaceStrong: string;
  border: string;
  muted: string;
  accent: string;
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
    accent: "#174a68",
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
    accent: "#63355f",
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
    accent: "#7a3828",
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
    accent: "#39488a",
    accentSoft: "#e0e4f5",
    highlight: "#d6a930",
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
    "--accent-soft": theme.accentSoft,
    "--highlight": theme.highlight,
  };
}
