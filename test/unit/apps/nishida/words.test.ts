import { describe, expect, it } from "vitest";
import { buildUnits } from "@/app/apps/nishida/_lib/typing-engine";
import { WORDS_PER_GAME, pickWords, typingWords } from "@/app/apps/nishida/_lib/words";

/** テスト用の決定的な乱数(線形合同法)。 */
function createSeededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

describe("typingWords", () => {
  it("provides enough words for one game", () => {
    expect(typingWords.length).toBeGreaterThanOrEqual(WORDS_PER_GAME);
  });

  it("can build typing units for every reading", () => {
    for (const word of typingWords) {
      expect(() => buildUnits(word.reading), `"${word.reading}" should be typable`).not.toThrow();
    }
  });

  it("keeps every unit's alternatives prefix-free so completion is unambiguous", () => {
    for (const word of typingWords) {
      for (const unit of buildUnits(word.reading)) {
        for (const a of unit.alternatives) {
          for (const b of unit.alternatives) {
            if (a === b) continue;
            expect(
              b.startsWith(a),
              `"${a}" is a prefix of "${b}" in unit "${unit.kana}" of "${word.reading}"`,
            ).toBe(false);
          }
        }
      }
    }
  });
});

describe("pickWords", () => {
  it("returns the requested number of distinct words", () => {
    const picked = pickWords(typingWords, WORDS_PER_GAME, createSeededRandom(1));

    expect(picked).toHaveLength(WORDS_PER_GAME);
    expect(new Set(picked.map((w) => w.reading)).size).toBe(WORDS_PER_GAME);
  });

  it("is deterministic for the same random source", () => {
    const first = pickWords(typingWords, WORDS_PER_GAME, createSeededRandom(42));
    const second = pickWords(typingWords, WORDS_PER_GAME, createSeededRandom(42));

    expect(first).toEqual(second);
  });

  it("does not mutate the source list", () => {
    const before = [...typingWords];
    pickWords(typingWords, WORDS_PER_GAME, createSeededRandom(7));

    expect(typingWords).toEqual(before);
  });
});
