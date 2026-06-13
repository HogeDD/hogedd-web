export type TypingWord = Readonly<{
  /** 画面に大きく表示する表記。 */
  display: string;
  /** タイピング判定に使うひらがなの読み。変換表にある文字だけを使う。 */
  reading: string;
}>;

// ↓ ここを編集する
export const typingWords: readonly TypingWord[] = [
  { display: "ラランド", reading: "ららんど" },
  { display: "サーヤ", reading: "さーや" },
  { display: "ニシダ", reading: "にしだ" },
  { display: "レモンジャム", reading: "れもんじゃむ" },
  { display: "ララチューン", reading: "ららちゅーん" },
  { display: "上智大学", reading: "じょうちだいがく" },
  { display: "ボケとツッコミ", reading: "ぼけとつっこみ" },
  { display: "単独ライブ", reading: "たんどくらいぶ" },
  { display: "ネタ合わせ", reading: "ねたあわせ" },
  { display: "兼業芸人", reading: "けんぎょうげいにん" },
  { display: "お笑いコンビ", reading: "おわらいこんび" },
  { display: "漫才", reading: "まんざい" },
  { display: "コント", reading: "こんと" },
  { display: "優勝候補", reading: "ゆうしょうこうほ" },
];
// ↑ ここまで

/** 1ゲームで出題する単語数。 */
export const WORDS_PER_GAME = 8;

/**
 * 出題用に単語を重複なくシャッフルして選ぶ。
 * 乱数を引数で受け取ることで、テストから決定的に検証できる。
 */
export function pickWords(
  words: readonly TypingWord[],
  count: number,
  random: () => number,
): TypingWord[] {
  const shuffled = [...words];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
