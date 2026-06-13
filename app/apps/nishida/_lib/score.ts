export type Rank = "S" | "A" | "B" | "C" | "D";

export type RankInput = Readonly<{
  /** 1秒あたりの正タイプ数。 */
  kps: number;
  /** 正タイプ率(0〜1)。 */
  accuracy: number;
}>;

export function calculateAccuracy({
  hitCount,
  missCount,
}: Readonly<{ hitCount: number; missCount: number }>): number {
  const total = hitCount + missCount;
  if (total === 0) {
    return 1;
  }
  return hitCount / total;
}

export function calculateKps({
  hitCount,
  elapsedMs,
}: Readonly<{ hitCount: number; elapsedMs: number }>): number {
  if (elapsedMs <= 0) {
    return 0;
  }
  return hitCount / (elapsedMs / 1000);
}

/** 速さ(kps)と正確さ(accuracy)の両方を満たした最上位のランクを返す。 */
export function judgeRank({ kps, accuracy }: RankInput): Rank {
  if (kps >= 4 && accuracy >= 0.95) {
    return "S";
  }
  if (kps >= 3 && accuracy >= 0.9) {
    return "A";
  }
  if (kps >= 2 && accuracy >= 0.8) {
    return "B";
  }
  if (kps >= 1) {
    return "C";
  }
  return "D";
}

export function formatSeconds(elapsedMs: number): string {
  return (elapsedMs / 1000).toFixed(2);
}
