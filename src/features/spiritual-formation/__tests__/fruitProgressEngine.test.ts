import { describe, expect, it } from "vitest";
import { calculateFruitProgress } from "../lib/fruitProgressEngine";

describe("calculateFruitProgress", () => {
  it("returns all fruits with zero count for empty data", () => {
    const progress = calculateFruitProgress({ dailyExamens: [] });
    expect(progress).toHaveLength(9);
    expect(progress.every((item) => item.count === 0)).toBe(true);
    expect(progress.every((item) => ["newly_practiced", "growing", "needs_attention", "ask_for_grace"].includes(item.label))).toBe(true);
  });

  it("counts fruits from daily examens and thought entries", () => {
    const progress = calculateFruitProgress({
      dailyExamens: [{
        id: "d1",
        userId: "u1",
        date: "2026-06-10T00:00:00.000Z",
        strongestEmotion: "anger",
        triggers: ["offense"],
        behaviorDescription: "anger",
        detectedSinPatterns: ["hatred_division"],
        coreLie: "lie",
        gospelTruth: "truth",
        confession: "confession",
        repentanceAction: "repent",
        obedienceAction: "gentle answer",
        fruitPracticed: ["gentleness"],
        virtuesPracticed: ["forgiveness"],
        prayer: "prayer",
        graceRecoveryNeeded: false,
        createdAt: "2026-06-10T00:00:00.000Z",
        updatedAt: "2026-06-10T00:00:00.000Z",
      }],
      thoughtEntries: [{
        id: "t1",
        userId: "u1",
        date: "2026-06-10T00:00:00.000Z",
        catchThought: "anger",
        namedSinPattern: "hatred_division",
        exposedLie: "lie",
        replacementTruth: "truth",
        obedienceAction: "pray for peace",
        createdAt: "2026-06-10T00:00:00.000Z",
      }],
    });
    expect(progress.find((item) => item.fruit === "gentleness")?.count).toBeGreaterThanOrEqual(2);
    expect(progress.map((item) => item.label)).not.toContain("bad");
  });
});
