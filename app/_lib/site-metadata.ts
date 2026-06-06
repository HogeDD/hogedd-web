import type { Metadata } from "next";

export const siteName = "HogeDD";
export const siteUrl = "https://www.hogedd.com";
export const siteDescription = "人は欲望によって進歩する。見たことないアプリを今スグ試そう。";
export const siteOgImageAlt = "HogeDD - 見たことないアプリを今スグ試そう。";

const siteOgImage = {
  url: "/opengraph-image.png",
  width: 1200,
  height: 630,
  alt: siteOgImageAlt,
};

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
};

export function createPageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
}: PageMetadataOptions): Metadata {
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "website",
      locale: "ja_JP",
      siteName,
      title,
      description,
      url: path,
      images: [siteOgImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [siteOgImage],
    },
  };
}

export function getAbsoluteUrl(path: string): string {
  return new URL(path, siteUrl).toString();
}
