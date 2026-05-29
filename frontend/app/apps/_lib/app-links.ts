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
  // YouTube 公開後は、ここに defineAppLink("https://youtu.be/...", {...}) を足す。
];
