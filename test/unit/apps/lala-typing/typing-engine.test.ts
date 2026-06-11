import { describe, expect, it } from "vitest";
import {
  UnsupportedKanaError,
  buildUnits,
  createSession,
  getRemainingRomaji,
  getTypedRomaji,
  isCompleted,
  typeKey,
  type TypingSession,
} from "@/app/apps/lala-typing/_lib/typing-engine";

function typeAll(session: TypingSession, keys: string): TypingSession {
  let current = session;
  for (const key of keys) {
    const result = typeKey(current, key);
    expect(result.kind, `key "${key}" in "${keys}" should hit`).not.toBe("miss");
    current = result.session;
  }
  return current;
}

describe("buildUnits", () => {
  it("splits plain kana into one unit per character", () => {
    const units = buildUnits("さや");

    expect(units.map((u) => u.kana)).toEqual(["さ", "や"]);
    expect(units[0].alternatives).toContain("sa");
    expect(units[1].alternatives).toContain("ya");
  });

  it("accepts multiple spellings for し (shi / si / ci)", () => {
    const [unit] = buildUnits("し");

    expect(unit.alternatives).toEqual(expect.arrayContaining(["shi", "si", "ci"]));
  });

  it("treats 拗音 as one unit with combined and decomposed spellings", () => {
    const [unit] = buildUnits("ちゅ");

    expect(unit.kana).toBe("ちゅ");
    expect(unit.alternatives).toEqual(expect.arrayContaining(["chu", "tyu", "cyu"]));
    // 分解入力(ち + 小さいゅ)も受け付ける
    expect(unit.alternatives).toContain("chixyu");
    expect(unit.alternatives).toContain("tilyu");
  });

  it("merges っ with the next unit and doubles its first consonant", () => {
    const units = buildUnits("つっこみ");

    expect(units.map((u) => u.kana)).toEqual(["つ", "っこ", "み"]);
    const sokuon = units[1];
    expect(sokuon.alternatives).toContain("kko");
    expect(sokuon.alternatives).toContain("xtuko");
    expect(sokuon.alternatives).toContain("ltuko");
  });

  it("doubles っちゃ as ccha or ttya", () => {
    const units = buildUnits("まっちゃ");
    const sokuon = units[1];

    expect(sokuon.kana).toBe("っちゃ");
    expect(sokuon.alternatives).toContain("ccha");
    expect(sokuon.alternatives).toContain("ttya");
    expect(sokuon.alternatives).toContain("xtucha");
  });

  it("merges ん with the next unit and allows single n only before a safe consonant", () => {
    const [, unit] = buildUnits("かんじ");

    expect(unit.kana).toBe("んじ");
    expect(unit.alternatives).toContain("nji");
    expect(unit.alternatives).toContain("nnji");
  });

  it("rejects single n before a vowel", () => {
    const [, unit] = buildUnits("かんい");

    expect(unit.kana).toBe("んい");
    expect(unit.alternatives).toContain("nni");
    expect(unit.alternatives).not.toContain("ni");
  });

  it("follows the conversion table for ん before や行", () => {
    const [, unit] = buildUnits("こんや");

    expect(unit.kana).toBe("んや");
    expect(unit.alternatives).toEqual(expect.arrayContaining(["nnya", "nya", "xnya"]));
  });

  it("follows the conversion table for ん before な行", () => {
    const [, unit] = buildUnits("おんな");

    expect(unit.kana).toBe("んな");
    expect(unit.alternatives).toEqual(expect.arrayContaining(["nna", "nnna", "xnna"]));
  });

  it("requires nn when ん is the last character", () => {
    const [, unit] = buildUnits("ぺん");

    expect(unit.kana).toBe("ん");
    expect(unit.alternatives).toEqual(expect.arrayContaining(["nn", "xn"]));
    expect(unit.alternatives).not.toContain("n");
  });

  it("maps ー to the hyphen key", () => {
    const [, unit] = buildUnits("らー");

    expect(unit.alternatives).toEqual(["-"]);
  });

  it("throws UnsupportedKanaError for characters outside the table", () => {
    expect(() => buildUnits("か漢")).toThrow(UnsupportedKanaError);
  });
});

describe("typeKey", () => {
  it("advances on a correct key and completes the word", () => {
    let session = createSession("さや");

    session = typeAll(session, "say");
    expect(isCompleted(session)).toBe(false);

    const result = typeKey(session, "a");
    expect(result.kind).toBe("completed");
    expect(isCompleted(result.session)).toBe(true);
  });

  it("returns miss and keeps the session unchanged on a wrong key", () => {
    const session = createSession("さや");

    const result = typeKey(session, "k");

    expect(result.kind).toBe("miss");
    expect(result.session).toBe(session);
    expect(getTypedRomaji(result.session)).toBe("");
  });

  it("completes し by either shi or si", () => {
    const viaShi = typeAll(createSession("し"), "shi");
    expect(isCompleted(viaShi)).toBe(true);

    const viaSi = typeAll(createSession("し"), "si");
    expect(isCompleted(viaSi)).toBe(true);
  });

  it("completes つっこみ by consonant doubling", () => {
    const session = typeAll(createSession("つっこみ"), "tukkomi");

    expect(isCompleted(session)).toBe(true);
  });

  it("completes かんじ by single n and by nn", () => {
    expect(isCompleted(typeAll(createSession("かんじ"), "kanji"))).toBe(true);
    expect(isCompleted(typeAll(createSession("かんじ"), "kannji"))).toBe(true);
  });

  it("treats keys after completion as miss", () => {
    const session = typeAll(createSession("や"), "ya");

    const result = typeKey(session, "a");

    expect(result.kind).toBe("miss");
  });
});

describe("typed and remaining romaji", () => {
  it("shows the shortest hint for a fresh session", () => {
    const session = createSession("かんじ");

    expect(getTypedRomaji(session)).toBe("");
    expect(getRemainingRomaji(session)).toBe("kanji");
  });

  it("keeps typed and remaining consistent while typing", () => {
    const session = typeAll(createSession("かんじ"), "kan");

    expect(getTypedRomaji(session)).toBe("kan");
    expect(getRemainingRomaji(session)).toBe("ji");
  });

  it("adapts the hint when the typist chooses nn", () => {
    const session = typeAll(createSession("かんじ"), "kann");

    expect(getTypedRomaji(session)).toBe("kann");
    expect(getRemainingRomaji(session)).toBe("ji");
  });

  it("adapts the hint after a non-default spelling is chosen", () => {
    const session = typeAll(createSession("し"), "s");

    // 最短候補(si)を基準に残りを示す
    expect(getRemainingRomaji(session)).toBe("i");
  });

  it("returns empty remaining romaji when completed", () => {
    const session = typeAll(createSession("さや"), "saya");

    expect(getRemainingRomaji(session)).toBe("");
  });
});
