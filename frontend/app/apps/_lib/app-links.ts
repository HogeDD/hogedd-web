import {
  getYouTubeThumbnailUrl,
  getYouTubeVideoId,
  getYouTubeWatchUrl,
} from "@/app/apps/_lib/youtube";

export type AppLink = {
  slug: string;
  title: string;
  description: string;
  appHref: string;
  youtubeUrl: string;
  videoId: string;
  thumbnailUrl: string;
  publishedAt: string;
  tags: readonly string[];
};

type DefineAppLinkOptions = {
  slug: string;
  title: string;
  description: string;
  appHref: string;
  publishedAt: string;
  tags?: readonly string[];
};

export function defineAppLink(youtubeUrl: string, options: DefineAppLinkOptions): AppLink {
  const videoId = getYouTubeVideoId(youtubeUrl);

  return {
    ...options,
    tags: options.tags ?? [],
    youtubeUrl: getYouTubeWatchUrl(videoId),
    videoId,
    thumbnailUrl: getYouTubeThumbnailUrl(videoId),
  };
}

export const appLinks: readonly AppLink[] = [
  defineAppLink("https://youtu.be/5mo0qnPuVTY?si=5comgyazMjAYnOJ9", {
    slug: "clean-tasks",
    title: "Clean Tasks",
    description: "Clean Architecture の練習として作った、最小構成のタスクアプリ。",
    appHref: "/apps/clean-tasks",
    publishedAt: "2026-05-30",
    tags: ["Next.js", "Go", "Clean Architecture"],
  }),
];
