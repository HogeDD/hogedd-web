import {
  getYouTubeThumbnailUrl,
  getYouTubeVideoId,
  getYouTubeWatchUrl,
} from "@/app/apps/_lib/youtube";

type AppLinkBase = {
  slug: string;
  title: string;
  description: string;
  appHref: string;
  publishedAt: string;
  tags: readonly string[];
};

export type PublishedAppLink = AppLinkBase & {
  status: "published";
  youtubeUrl: string;
  xShareUrl: string;
  videoId: string;
  thumbnailUrl: string;
  shareText: string;
};

export type PendingAppLink = AppLinkBase & {
  status: "preparing";
};

export type AppLink = PublishedAppLink | PendingAppLink;

type DefineAppLinkOptions = {
  slug: string;
  title: string;
  description: string;
  appHref: string;
  publishedAt: string;
  tags?: readonly string[];
  shareText?: string;
};

export function defineAppLink(youtubeUrl: string, options: DefineAppLinkOptions): AppLink {
  const videoId = getYouTubeVideoId(youtubeUrl);
  const normalizedYouTubeUrl = getYouTubeWatchUrl(videoId);
  const shareText = options.shareText ?? `${options.title} を見ました`;

  return {
    ...options,
    status: "published",
    tags: options.tags ?? [],
    youtubeUrl: normalizedYouTubeUrl,
    xShareUrl: getXShareUrl({ text: shareText, url: normalizedYouTubeUrl }),
    shareText,
    videoId,
    thumbnailUrl: getYouTubeThumbnailUrl(videoId),
  };
}

export function definePreparingAppLink(options: DefineAppLinkOptions): AppLink {
  return {
    ...options,
    status: "preparing",
    tags: options.tags ?? [],
  };
}

function getXShareUrl({ text, url }: { text: string; url: string }): string {
  const searchParams = new URLSearchParams({ text, url });
  return `https://twitter.com/intent/tweet?${searchParams.toString()}`;
}

export const appLinks: readonly AppLink[] = [
  defineAppLink("https://youtu.be/5mo0qnPuVTY?si=5comgyazMjAYnOJ9", {
    slug: "clean-tasks",
    title: "Clean Tasks",
    description: "Clean Architecture の練習として作った、最小構成のタスクアプリ。",
    appHref: "/apps/clean-tasks",
    publishedAt: "2026-05-30",
    shareText: "Clean Architecture の練習アプリ Clean Tasks を見ました",
    tags: ["Next.js", "Go", "Clean Architecture"],
  }),
  definePreparingAppLink({
    slug: "chinchin",
    title: "ちんちんゲーム",
    description: "5x5 の盤面で「ち」と「ん」を交互に置く2人対戦ゲーム。",
    appHref: "/apps/chinchin",
    publishedAt: "動画準備中",
    tags: ["Game", "Online Match", "Next.js"],
  }),
];
