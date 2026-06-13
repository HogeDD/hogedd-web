import { describe, expect, it } from "vitest";
import { appLinks, publishedAppLinks } from "@/app/apps/_lib/app-links";
import { getYouTubeThumbnailUrl, getYouTubeWatchUrl } from "@/app/apps/_lib/youtube";

describe("app links", () => {
  it("stores the development drive for each app", () => {
    expect(publishedAppLinks.find(({ slug }) => slug === "clean-tasks")?.developmentDrive).toBe(
      "学習DD",
    );
  });

  it("only exposes apps with a published video", () => {
    expect(publishedAppLinks.map(({ slug }) => slug)).toEqual(["clean-tasks"]);
  });

  it("registers ニシ打 at the nishida route without keeping the old lala-typing slug", () => {
    expect(appLinks.find(({ slug }) => slug === "nishida")).toMatchObject({
      title: "ニシ打",
      appHref: "/apps/nishida",
    });
    expect(appLinks.some(({ slug }) => slug === "lala-typing")).toBe(false);
  });

  it("keeps published app metadata aligned with the current implementation", () => {
    expect(publishedAppLinks.find(({ slug }) => slug === "clean-tasks")?.tags).toEqual([
      "Next.js",
      "TypeScript",
      "Clean Architecture",
    ]);
  });

  it("derives published video and sharing URLs from one YouTube video ID", () => {
    for (const app of publishedAppLinks) {
      expect(app.youtubeUrl).toBe(getYouTubeWatchUrl(app.videoId));
      expect(app.thumbnailUrl).toBe(getYouTubeThumbnailUrl(app.videoId));

      const shareUrl = new URL(app.xShareUrl);
      expect(shareUrl.origin + shareUrl.pathname).toBe("https://twitter.com/intent/tweet");
      expect(shareUrl.searchParams.get("text")).toBe(app.shareText);
      expect(shareUrl.searchParams.get("url")).toBe(app.youtubeUrl);
    }
  });
});
