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
  developmentDrive: string;
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

type DefinePublishedAppLinkOptions = DefineAppLinkOptions & {
  developmentDrive: string;
};

export function defineAppLink(
  youtubeUrl: string,
  options: DefinePublishedAppLinkOptions,
): PublishedAppLink {
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
    developmentDrive: "学習DD",
    shareText: "Clean Architecture の練習アプリ Clean Tasks を見ました",
    tags: ["Next.js", "TypeScript", "Clean Architecture"],
  }),
  definePreparingAppLink({
    slug: "chinchin",
    title: "ちんちんゲーム",
    description: "5x5 の盤面で「ち」と「ん」を交互に置く2人対戦ゲーム。",
    appHref: "/apps/chinchin",
    publishedAt: "動画準備中",
    tags: ["Game", "Local Multiplayer", "Next.js"],
  }),
  definePreparingAppLink({
    slug: "lala-typing",
    title: "ララ打",
    description: "ラランドの語彙で遊ぶ、ローマ字タイピングゲーム。",
    appHref: "/apps/lala-typing",
    publishedAt: "動画準備中",
    tags: ["Game", "Typing", "Next.js"],
  }),
  definePreparingAppLink({
    slug: "judo-roulette",
    title: "柔道ルーレット",
    description: "選択肢を追加して回せる、仕込み可能なルーレット。",
    appHref: "/apps/judo-roulette",
    publishedAt: "動画準備中",
    tags: ["Game", "Roulette", "Next.js"],
  }),
];

export const publishedAppLinks: readonly PublishedAppLink[] = appLinks.filter(
  (app): app is PublishedAppLink => app.status === "published",
);
