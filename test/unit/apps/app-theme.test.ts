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

  it("provides five palettes with readable text and active navigation", () => {
    expect(Object.keys(appThemePresets)).toHaveLength(5);

    for (const theme of Object.values(appThemePresets)) {
      expect(getContrastRatio(theme.foreground, theme.background)).toBeGreaterThanOrEqual(4.5);
      expect(getContrastRatio(theme.muted, theme.background)).toBeGreaterThanOrEqual(4.5);
      expect(getContrastRatio("#ffffff", theme.accent)).toBeGreaterThanOrEqual(4.5);
    }
  });
});
