import { describe, expect, it } from "vitest";
import { generateWeeklyReview } from "../lib/weeklyReviewEngine";
import type { DailyExamen } from "../types/spiritualFormation";

function daily(partial: Partial<DailyExamen>): DailyExamen {
  return {
    id: "d1",
    userId: "u1",
    date: "2026-06-10T00:00:00.000Z",
    strongestEmotion: "anger",
    triggers: ["offense"],
    behaviorDescription: "angry words",
    detectedSinPatterns: ["hatred_division"],
    selectedPrimarySinPattern: "hatred_division",
    coreLie: "I have the right to punish.",
    gospelTruth: "Christ has forgiven me.",
    confession: "Lord, I confess my anger.",
    repentanceAction: "Stop rehearsing revenge.",
    obedienceAction: "Pray for peace.",
    fruitPracticed: ["gentleness"],
    virtuesPracticed: ["forgiveness"],
    prayer: "Amen",
    graceRecoveryNeeded: false,
    createdAt: "2026-06-10T00:00:00.000Z",
    updatedAt: "2026-06-10T00:00:00.000Z",
    ...partial,
  };
}

describe("generateWeeklyReview", () => {
  it("summarizes patterns, triggers, lies, fruits, and practices", () => {
    const review = generateWeeklyReview({
      userId: "u1",
      weekStartDate: "2026-06-07",
      weekEndDate: "2026-06-13",
      dailyExamens: [
        daily({ id: "d1" }),
        daily({ id: "d2", triggers: ["offense", "conflict"], fruitPracticed: ["gentleness", "peace"] }),
      ],
    });
    expect(review.mostFrequentSinPatterns[0]).toEqual({ sinPatternId: "hatred_division", count: 2 });
    expect(review.topTriggers[0].trigger).toBe("offense");
    expect(review.fruitsPracticed.some((item) => item.fruit === "gentleness" && item.count === 2)).toBe(true);
    expect(review.recurringCoreLies).toContain("I have the right to punish.");
    expect(review.pastoralEncouragement).not.toContain("failed");
    expect(review.recommendedNextPractices.length).toBeGreaterThan(0);
  });
});
