import { describe, expect, it } from "vitest";
import { generateTransformationPlan } from "../lib/planGenerator";

describe("generateTransformationPlan", () => {
  it("generates a 7-day awareness plan with correct end date", () => {
    const plan = generateTransformationPlan({ userId: "u1", duration: "7_days", intensity: "normal", primarySinPattern: "entertainment_escapism", startDate: "2026-06-01" });
    expect(plan.endDate).toBe("2026-06-08");
    expect(plan.title).toContain("7-Day Awareness");
    expect(plan.targetFruits).toContain("self_control");
  });

  it("generates a 30-day battle plan with accountability language", () => {
    const plan = generateTransformationPlan({ userId: "u1", duration: "30_days", intensity: "battle", primarySinPattern: "sexual_disorder", startDate: "2026-06-01" });
    expect(plan.endDate).toBe("2026-07-01");
    expect(plan.progressSummary).toContain("not meant to be fought alone");
    expect(plan.dailyPractices.length).toBeGreaterThan(3);
  });

  it("generates 90-day and 1-year structures", () => {
    const ninety = generateTransformationPlan({ userId: "u1", duration: "90_days", intensity: "deep", primarySinPattern: "pride", startDate: "2026-06-01" });
    const year = generateTransformationPlan({ userId: "u1", duration: "1_year", intensity: "light", primarySinPattern: "self_centeredness", startDate: "2026-06-01" });
    expect(ninety.endDate).toBe("2026-08-30");
    expect(ninety.reviewQuestions.some((q) => q.includes("Month 1"))).toBe(true);
    expect(year.endDate).toBe("2027-06-01");
    expect(year.reviewQuestions.some((q) => q.includes("Quarter 1"))).toBe(true);
  });
});
