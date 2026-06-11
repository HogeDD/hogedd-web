import { describe, expect, it } from "vitest";
import {
  calculateAccuracy,
  calculateKps,
  formatSeconds,
  judgeRank,
} from "@/app/apps/lala-typing/_lib/score";

describe("calculateAccuracy", () => {
  it("returns 1 when nothing has been typed", () => {
    expect(calculateAccuracy({ hitCount: 0, missCount: 0 })).toBe(1);
  });

  it("returns the ratio of hits to total keystrokes", () => {
    expect(calculateAccuracy({ hitCount: 9, missCount: 1 })).toBe(0.9);
  });
});

describe("calculateKps", () => {
  it("returns keystrokes per second", () => {
    expect(calculateKps({ hitCount: 50, elapsedMs: 10000 })).toBe(5);
  });

  it("returns 0 when elapsed time is not positive", () => {
    expect(calculateKps({ hitCount: 10, elapsedMs: 0 })).toBe(0);
  });
});

describe("judgeRank", () => {
  it("returns S at the S boundary", () => {
    expect(judgeRank({ kps: 4, accuracy: 0.95 })).toBe("S");
  });

  it("returns A just below the S boundary", () => {
    expect(judgeRank({ kps: 3.99, accuracy: 1 })).toBe("A");
    expect(judgeRank({ kps: 5, accuracy: 0.949 })).toBe("A");
  });

  it("returns A at the A boundary", () => {
    expect(judgeRank({ kps: 3, accuracy: 0.9 })).toBe("A");
  });

  it("returns B at the B boundary", () => {
    expect(judgeRank({ kps: 2, accuracy: 0.8 })).toBe("B");
  });

  it("returns C at the C boundary", () => {
    expect(judgeRank({ kps: 1, accuracy: 0 })).toBe("C");
  });

  it("returns D below every boundary", () => {
    expect(judgeRank({ kps: 0.99, accuracy: 1 })).toBe("D");
  });
});

describe("formatSeconds", () => {
  it("formats milliseconds as seconds with two digits", () => {
    expect(formatSeconds(12340)).toBe("12.34");
  });

  it("pads whole seconds", () => {
    expect(formatSeconds(9000)).toBe("9.00");
  });
});
