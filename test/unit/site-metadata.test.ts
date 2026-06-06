import { describe, expect, it } from "vitest";
import { createPageMetadata, getAbsoluteUrl } from "@/app/_lib/site-metadata";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";

describe("site metadata", () => {
  it("creates matching page, canonical, Open Graph, and Twitter metadata", () => {
    const metadata = createPageMetadata({
      title: "Apps",
      description: "HogeDD のアプリ紹介動画リンク集",
      path: "/apps",
    });

    expect(metadata).toMatchObject({
      title: "Apps",
      description: "HogeDD のアプリ紹介動画リンク集",
      alternates: { canonical: "/apps" },
      openGraph: {
        type: "website",
        locale: "ja_JP",
        siteName: "HogeDD",
        title: "Apps",
        description: "HogeDD のアプリ紹介動画リンク集",
        url: "/apps",
        images: [
          {
            url: "/opengraph-image.png",
            width: 1200,
            height: 630,
            alt: "HogeDD - 見たことないアプリを今スグ試そう。",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "Apps",
        description: "HogeDD のアプリ紹介動画リンク集",
        images: [
          {
            url: "/opengraph-image.png",
            width: 1200,
            height: 630,
            alt: "HogeDD - 見たことないアプリを今スグ試そう。",
          },
        ],
      },
    });
  });

  it("uses www.hogedd.com as the canonical origin", () => {
    expect(getAbsoluteUrl("/apps")).toBe("https://www.hogedd.com/apps");
  });

  it("allows crawling and publishes the sitemap location", () => {
    expect(robots()).toEqual({
      rules: {
        userAgent: "*",
        allow: "/",
      },
      sitemap: "https://www.hogedd.com/sitemap.xml",
    });
  });

  it("lists every public page in the sitemap", () => {
    expect(sitemap().map(({ url }) => url)).toEqual([
      "https://www.hogedd.com/",
      "https://www.hogedd.com/apps",
      "https://www.hogedd.com/apps/clean-tasks",
      "https://www.hogedd.com/apps/chinchin",
    ]);
  });
});
