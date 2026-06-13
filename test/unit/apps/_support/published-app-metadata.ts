import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import type { PublishedAppLink } from "@/app/apps/_lib/app-links";

const metadataImages = [
  {
    imageFileName: "opengraph-image.png",
    altFileName: "opengraph-image.alt.txt",
  },
  {
    imageFileName: "twitter-image.png",
    altFileName: "twitter-image.alt.txt",
  },
] as const;
const expectedOgImageSize = { width: 1200, height: 630 } as const;

export function findPublishedAppMetadataProblems(
  appsDirectory: string,
  app: PublishedAppLink,
): string[] {
  const problems: string[] = [];
  const appDirectory = path.join(appsDirectory, app.slug);

  if (app.appHref !== `/apps/${app.slug}`) {
    problems.push(`${app.slug}: appHref must be /apps/${app.slug}`);
  }

  if (!isIsoDate(app.publishedAt)) {
    problems.push(`${app.slug}: publishedAt must use YYYY-MM-DD`);
  }

  for (const { imageFileName, altFileName } of metadataImages) {
    const imagePath = path.join(appDirectory, imageFileName);
    const altPath = path.join(appDirectory, altFileName);

    if (!existsSync(imagePath)) {
      problems.push(`${app.slug}: missing ${imageFileName}`);
    } else {
      const size = readPngSize(imagePath);
      if (
        !size ||
        size.width !== expectedOgImageSize.width ||
        size.height !== expectedOgImageSize.height
      ) {
        problems.push(`${app.slug}: ${imageFileName} must be 1200x630 PNG`);
      }
    }

    if (!existsSync(altPath)) {
      problems.push(`${app.slug}: missing ${altFileName}`);
    } else if (readFileSync(altPath, "utf8").trim().length === 0) {
      problems.push(`${app.slug}: ${altFileName} must not be empty`);
    }
  }

  const [openGraphImage, twitterImage] = metadataImages.map(({ imageFileName }) =>
    path.join(appDirectory, imageFileName),
  );
  if (
    existsSync(openGraphImage) &&
    existsSync(twitterImage) &&
    !readFileSync(openGraphImage).equals(readFileSync(twitterImage))
  ) {
    problems.push(`${app.slug}: Open Graph and Twitter images must match`);
  }

  const [openGraphAlt, twitterAlt] = metadataImages.map(({ altFileName }) =>
    path.join(appDirectory, altFileName),
  );
  if (
    existsSync(openGraphAlt) &&
    existsSync(twitterAlt) &&
    readFileSync(openGraphAlt, "utf8").trim() !== readFileSync(twitterAlt, "utf8").trim()
  ) {
    problems.push(`${app.slug}: Open Graph and Twitter alt text must match`);
  }

  return problems;
}

function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().startsWith(value);
}

function readPngSize(filePath: string): { width: number; height: number } | undefined {
  const image = readFileSync(filePath);
  const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  if (image.length < 24 || !image.subarray(0, 8).equals(pngSignature)) {
    return undefined;
  }

  return {
    width: image.readUInt32BE(16),
    height: image.readUInt32BE(20),
  };
}
