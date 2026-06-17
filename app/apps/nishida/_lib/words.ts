export type TypingWord = Readonly<{
  /** 画面に大きく表示する表記。 */
  display: string;
  /** タイピング判定に使うひらがなの読み。変換表にある文字だけを使う。 */
  reading: string;
}>;

// ↓ ここを編集する
export const typingWords: readonly TypingWord[] = [
  {
    display: "昔さ，服装めっちゃダサかったけどさ今もホント見てらんないよね",
    reading: "むかしさふくそうめっちゃださかったけどさいまもほんとみてらんないよね",
  },
  {
    display: "ニシダもさ汗かくけどさ歯も黄色いじゃん",
    reading: "にしだもさあせかくけどさはもきいろいじゃん",
  },
  {
    display: "昔はもっと汚かったけど今は家畜に近い",
    reading: "むかしはもっときたなかったけどいまはかちくにちかい",
  },
  {
    display: "メール一本で親から百万羨ましいです",
    reading: "めーるいっぽんでおやからひゃくまんうらやましいです",
  },
  {
    display: "市民税も親に払わせてて嬉しいですね",
    reading: "しみんぜいもおやにはらわせててうれしいですね",
  },
  { display: "怠惰の集合住宅だ", reading: "たいだのしゅうごうじゅうたくだ" },
  {
    display: "エレベーター一人でブザー鳴っちゃうよ",
    reading: "えれべーたーひとりでぶざーなっちゃうよ",
  },
  { display: "悪玉菌が歩いてる", reading: "あくだまきんがあるいてる" },
  { display: "脂のタワーマンションだよ", reading: "あぶらのたわーまんしょんだよ" },
  {
    display: "家族なしハリポタニワカの呪いの子",
    reading: "かぞくなしはりぽたにわかののろいのこ",
  },
  {
    display: "親不孝でモラハラ気質でカ行の滑舌が終わっている",
    reading: "おやふこうでもらはらきしつでかぎょうのかつぜつがおわっている",
  },
  { display: "二重なだけ", reading: "ふたえなだけ" },
  {
    display: "電車で隣に座られたら1日ちょっと凹む",
    reading: "でんしゃでとなりにすわられたらいちにちちょっとへこむ",
  },
  { display: "つまずけ", reading: "つまずけ" },
  { display: "笑うな", reading: "わらうな" },
  { display: "今世は諦めろ", reading: "こんせはあきらめろ" },
  { display: "一生浄水器使うな", reading: "いっしょうじょうすいきつかうな" },
  {
    display: "お洒落はダサいという価値観がダサい",
    reading: "おしゃれはださいというかちかんがださい",
  },
  { display: "毒息子", reading: "どくむすこ" },
  { display: "脂肪がテンパってるだけ", reading: "しぼうがてんぱってるだけ" },
  { display: "私は両親の失敗作です", reading: "わたしはりょうしんのしっぱいさくです" },
  {
    display: "ニシダさん単品で好きな人いなくないですか？",
    reading: "にしださんたんぴんですきなひといなくないですか",
  },
  { display: "きっうわぁ", reading: "きっうわぁ" },
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
