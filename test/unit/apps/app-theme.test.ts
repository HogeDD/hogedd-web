import { describe, expect, it } from "vitest";
import {
  appThemePresets,
  createAppTheme,
  defaultAppTheme,
  getAppThemeStyle,
} from "@/app/apps/_lib/app-theme";

function getRelativeLuminance(hex: string) {
  const channels = hex
    .slice(1)
    .match(/.{2}/g)
    ?.map((channel) => Number.parseInt(channel, 16) / 255);

  if (!channels || channels.length !== 3) {
    throw new Error(`Unsupported color: ${hex}`);
  }

  const [red, green, blue] = channels.map((channel) =>
    channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  );

  return red * 0.2126 + green * 0.7152 + blue * 0.0722;
}

function getContrastRatio(first: string, second: string) {
  const lighter = Math.max(getRelativeLuminance(first), getRelativeLuminance(second));
  const darker = Math.min(getRelativeLuminance(first), getRelativeLuminance(second));

  return (lighter + 0.05) / (darker + 0.05);
}

describe("app theme", () => {
  it("uses the current HogeDD colors as the default theme", () => {
    expect(createAppTheme()).toEqual(defaultAppTheme);
    expect(defaultAppTheme).toEqual({
      background: "#f5f7f5",
      foreground: "#141816",
      surface: "#ffffff",
      surfaceStrong: "#eef3ef",
      border: "#d6ddd6",
      muted: "#5f6761",
      accent: "#173f34",
      accentSoft: "#dde8e3",
      highlight: "#e5b841",
    });
  });

  it("allows an app to replace colors without accepting layout classes", () => {
    expect(createAppTheme({ accent: "#123456", highlight: "#abcdef" })).toEqual({
      ...defaultAppTheme,
      accent: "#123456",
      highlight: "#abcdef",
    });
  });

  it("maps a theme to the CSS custom properties used by app pages", () => {
    expect(getAppThemeStyle(defaultAppTheme)).toEqual({
      "--background": "#f5f7f5",
      "--foreground": "#141816",
      "--surface": "#ffffff",
      "--surface-strong": "#eef3ef",
      "--border": "#d6ddd6",
      "--muted": "#5f6761",
      "--accent": "#173f34",
      "--accent-soft": "#dde8e3",
      "--highlight": "#e5b841",
    });
  });

  it("provides at least 15 distinct palettes", () => {
    expect(Object.keys(appThemePresets).length).toBeGreaterThanOrEqual(15);

    const accents = Object.values(appThemePresets).map((theme) => theme.accent);
    expect(new Set(accents).size).toBe(accents.length);
  });

  it("keeps every palette readable", () => {
    for (const [name, theme] of Object.entries(appThemePresets)) {
      const expectAtLeast = (value: number, min: number, pair: string) => {
        expect(value, `${name}: ${pair}`).toBeGreaterThanOrEqual(min);
      };

      // AGENTS.mdのルール: 通常文字・補助文字・accent上の白文字はWCAG AAの4.5:1以上。
      expectAtLeast(getContrastRatio(theme.foreground, theme.background), 4.5, "fg/bg");
      expectAtLeast(getContrastRatio(theme.muted, theme.background), 4.5, "muted/bg");
      expectAtLeast(getContrastRatio("#ffffff", theme.accent), 4.5, "white/accent");

      // 文字はsurfaceStrongの節背景にも載る。
      expectAtLeast(getContrastRatio(theme.foreground, theme.surfaceStrong), 4.5, "fg/strong");
      expectAtLeast(getContrastRatio(theme.muted, theme.surfaceStrong), 4.5, "muted/strong");

      // accentは節ラベルの文字色としてbackground上で使う。
      expectAtLeast(getContrastRatio(theme.accent, theme.background), 4.5, "accent/bg");

      // highlightはaccent背景のヘッダーでラベルに使う。既存presetの実績(最小3.88)を
      // 踏まえ、WCAG AAの大きい文字・UI部品の基準(3:1)以上を最低ラインとする。
      expectAtLeast(getContrastRatio(theme.highlight, theme.accent), 3.0, "highlight/accent");
    }
  });
});
