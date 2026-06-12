import {
  HOLY_SPIRIT_FRUITS,
  NEW_LIFE_VIRTUES,
  SIN_PATTERN_IDS,
  type DailyExamen,
  type GraceRecoveryEntry,
  type HolySpiritFruit,
  type NewLifeVirtue,
  type SinPatternId,
  type ThoughtCaptiveEntry,
  type TransformationPlan,
} from "./spiritualFormation";

type ParseResult<T> = { success: true; data: T } | { success: false; error: Error };

type Schema<T> = {
  parse(value: unknown): T;
  safeParse(value: unknown): ParseResult<T>;
};

function makeSchema<T>(validator: (value: unknown) => string[]): Schema<T> {
  return {
    parse(value: unknown) {
      const errors = validator(value);
      if (errors.length) throw new Error(errors.join("; "));
      return value as T;
    },
    safeParse(value: unknown) {
      const errors = validator(value);
      if (errors.length) return { success: false, error: new Error(errors.join("; ")) };
      return { success: true, data: value as T };
    },
  };
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const isNonEmptyString = (value: unknown) => typeof value === "string" && value.trim().length > 0;
const isStringArray = (value: unknown) => Array.isArray(value) && value.every((item) => typeof item === "string");
const isFruitArray = (value: unknown): value is HolySpiritFruit[] =>
  Array.isArray(value) && value.every((item) => HOLY_SPIRIT_FRUITS.includes(item));
const isVirtueArray = (value: unknown): value is NewLifeVirtue[] =>
  Array.isArray(value) && value.every((item) => NEW_LIFE_VIRTUES.includes(item));
const isPatternArray = (value: unknown): value is SinPatternId[] =>
  Array.isArray(value) && value.every((item) => SIN_PATTERN_IDS.includes(item));
const isPracticeArray = (value: unknown) =>
  Array.isArray(value) && value.every((item) => isRecord(item) && isNonEmptyString(item.id) && isNonEmptyString(item.name));

function requireFields(obj: Record<string, unknown>, fields: string[]) {
  return fields.filter((field) => !isNonEmptyString(obj[field])).map((field) => `${field} is required`);
}

export const DailyExamenSchema = makeSchema<DailyExamen>((value) => {
  if (!isRecord(value)) return ["DailyExamen must be an object"];
  const errors = requireFields(value, [
    "id",
    "userId",
    "date",
    "strongestEmotion",
    "behaviorDescription",
    "coreLie",
    "gospelTruth",
    "confession",
    "repentanceAction",
    "obedienceAction",
    "prayer",
    "createdAt",
    "updatedAt",
  ]);
  if (!isStringArray(value.triggers)) errors.push("triggers must be an array");
  if (!isPatternArray(value.detectedSinPatterns)) errors.push("detectedSinPatterns must contain known sin pattern ids");
  if (value.selectedPrimarySinPattern && !SIN_PATTERN_IDS.includes(value.selectedPrimarySinPattern as SinPatternId)) {
    errors.push("selectedPrimarySinPattern must be a known sin pattern id");
  }
  if (!isFruitArray(value.fruitPracticed)) errors.push("fruitPracticed must contain known fruits");
  if (!isVirtueArray(value.virtuesPracticed)) errors.push("virtuesPracticed must contain known virtues");
  if (typeof value.graceRecoveryNeeded !== "boolean") errors.push("graceRecoveryNeeded must be boolean");
  return errors;
});

export const ThoughtCaptiveEntrySchema = makeSchema<ThoughtCaptiveEntry>((value) => {
  if (!isRecord(value)) return ["ThoughtCaptiveEntry must be an object"];
  const errors = requireFields(value, [
    "id",
    "userId",
    "date",
    "catchThought",
    "namedSinPattern",
    "exposedLie",
    "replacementTruth",
    "obedienceAction",
    "createdAt",
  ]);
  if (!SIN_PATTERN_IDS.includes(value.namedSinPattern as SinPatternId)) errors.push("namedSinPattern must be known");
  return errors;
});

export const GraceRecoveryEntrySchema = makeSchema<GraceRecoveryEntry>((value) => {
  if (!isRecord(value)) return ["GraceRecoveryEntry must be an object"];
  const errors = requireFields(value, [
    "id",
    "userId",
    "date",
    "whatHappened",
    "confession",
    "receivedGraceStatement",
    "nextObedienceStep",
    "createdAt",
  ]);
  if (value.sinPattern && !SIN_PATTERN_IDS.includes(value.sinPattern as SinPatternId)) errors.push("sinPattern must be known");
  return errors;
});

export const TransformationPlanSchema = makeSchema<TransformationPlan>((value) => {
  if (!isRecord(value)) return ["TransformationPlan must be an object"];
  const errors = requireFields(value, [
    "id",
    "userId",
    "title",
    "duration",
    "intensity",
    "primarySinPattern",
    "startDate",
    "endDate",
    "status",
    "progressSummary",
    "recommendedNextStep",
    "createdAt",
    "updatedAt",
  ]);
  if (!SIN_PATTERN_IDS.includes(value.primarySinPattern as SinPatternId)) errors.push("primarySinPattern must be known");
  if (value.secondarySinPattern && !SIN_PATTERN_IDS.includes(value.secondarySinPattern as SinPatternId)) errors.push("secondarySinPattern must be known");
  if (!isFruitArray(value.targetFruits)) errors.push("targetFruits must contain known fruits");
  if (!isVirtueArray(value.targetVirtues)) errors.push("targetVirtues must contain known virtues");
  if (!isPracticeArray(value.dailyPractices)) errors.push("dailyPractices must contain practice objects");
  if (!isPracticeArray(value.weeklyPractices)) errors.push("weeklyPractices must contain practice objects");
  if (!isStringArray(value.reviewQuestions)) errors.push("reviewQuestions must be an array of strings");
  return errors;
});
