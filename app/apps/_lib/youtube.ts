const YOUTUBE_HOSTS = new Set(["youtube.com", "www.youtube.com", "m.youtube.com"]);

export function getYouTubeVideoId(youtubeUrl: string): string {
  const url = new URL(youtubeUrl);

  if (url.hostname === "youtu.be") {
    return normalizeVideoId(url.pathname.slice(1));
  }

  if (!YOUTUBE_HOSTS.has(url.hostname)) {
    throw new Error(`Unsupported YouTube host: ${url.hostname}`);
  }

  if (url.pathname === "/watch") {
    return normalizeVideoId(url.searchParams.get("v") ?? "");
  }

  const [, route, videoId] = url.pathname.split("/");
  if (route === "embed" || route === "shorts" || route === "live") {
    return normalizeVideoId(videoId ?? "");
  }

  throw new Error(`Unsupported YouTube URL: ${youtubeUrl}`);
}

export function getYouTubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export function getYouTubeThumbnailUrl(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

function normalizeVideoId(videoId: string): string {
  const normalized = videoId.trim();
  if (!/^[\w-]{6,}$/.test(normalized)) {
    throw new Error(`Invalid YouTube video ID: ${videoId}`);
  }

  return normalized;
}
