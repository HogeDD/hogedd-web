import { describe, expect, it } from "vitest";
import { getSelectedIndexAtPointer, getStopRotation } from "@/app/apps/judo-roulette/_lib/roulette";

describe("getStopRotation", () => {
  it("stops the selected option at the pointer", () => {
    for (let selectedIndex = 0; selectedIndex < 6; selectedIndex += 1) {
      const rotation = getStopRotation({
        choiceCount: 6,
        selectedIndex,
        currentRotation: 0,
        extraTurns: 5,
      });

      expect(getSelectedIndexAtPointer(6, rotation)).toBe(selectedIndex);
    }
  });

  it("always moves forward by the requested number of full turns", () => {
    const currentRotation = 713;
    const rotation = getStopRotation({
      choiceCount: 4,
      selectedIndex: 2,
      currentRotation,
      extraTurns: 4,
    });

    expect(rotation).toBeGreaterThanOrEqual(currentRotation + 4 * 360);
    expect(getSelectedIndexAtPointer(4, rotation)).toBe(2);
  });

  it("rejects invalid choice counts and selected indexes", () => {
    expect(() =>
      getStopRotation({
        choiceCount: 1,
        selectedIndex: 0,
        currentRotation: 0,
      }),
    ).toThrow();
    expect(() =>
      getStopRotation({
        choiceCount: 3,
        selectedIndex: 3,
        currentRotation: 0,
      }),
    ).toThrow();
  });
});
