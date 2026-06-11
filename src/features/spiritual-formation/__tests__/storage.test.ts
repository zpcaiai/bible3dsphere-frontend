import { beforeEach, describe, expect, it } from "vitest";
import { generateTransformationPlan } from "../lib/planGenerator";
import {
  getActiveTransformationPlan,
  listDailyExamens,
  listGraceRecoveryEntries,
  listThoughtCaptiveEntries,
  saveDailyExamen,
  saveGraceRecoveryEntry,
  saveThoughtCaptiveEntry,
  saveTransformationPlan,
  STORAGE_KEYS,
} from "../lib/storage";

const now = "2026-06-10T00:00:00.000Z";

beforeEach(() => {
  Object.values(STORAGE_KEYS).forEach((key) => window.localStorage.removeItem(key));
});

describe("spiritual formation storage", () => {
  it("saves and filters daily examens by user", () => {
    saveDailyExamen({
      id: "d1",
      userId: "u1",
      date: now,
      strongestEmotion: "anxiety",
      triggers: ["financial_insecurity"],
      behaviorDescription: "money fear",
      detectedSinPatterns: ["greed_consumerism"],
      coreLie: "lie",
      gospelTruth: "truth",
      confession: "confession",
      repentanceAction: "repent",
      obedienceAction: "obey",
      fruitPracticed: ["peace"],
      virtuesPracticed: ["contentment"],
      prayer: "prayer",
      graceRecoveryNeeded: false,
      createdAt: now,
      updatedAt: now,
    });
    expect(listDailyExamens("u1")).toHaveLength(1);
    expect(listDailyExamens("u2")).toHaveLength(0);
  });

  it("stores thought, recovery, and active transformation plan records", () => {
    saveThoughtCaptiveEntry({ id: "t1", userId: "u1", date: now, catchThought: "thought", namedSinPattern: "pride", exposedLie: "lie", replacementTruth: "truth", obedienceAction: "obey", createdAt: now });
    saveGraceRecoveryEntry({ id: "r1", userId: "u1", date: now, whatHappened: "fell", confession: "confession", receivedGraceStatement: "grace", nextObedienceStep: "obey", createdAt: now });
    const plan = generateTransformationPlan({ userId: "u1", duration: "7_days", intensity: "normal", primarySinPattern: "pride", startDate: "2026-06-01" });
    saveTransformationPlan(plan);
    expect(listThoughtCaptiveEntries("u1")).toHaveLength(1);
    expect(listGraceRecoveryEntries("u1")).toHaveLength(1);
    expect(getActiveTransformationPlan("u1")?.id).toBe(plan.id);
  });

  it("rejects invalid daily examen data", () => {
    expect(() => saveDailyExamen({ id: "bad" } as never)).toThrow("We could not save this entry");
  });
});
