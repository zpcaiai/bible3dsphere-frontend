import { sinPatternMap } from "../data/sinPatterns";
import type { DailyExamen, GraceRecoveryEntry, HolySpiritFruit, NewLifeVirtue, Practice, SinPatternId, ThoughtCaptiveEntry, TriggerCategory, WeeklyReview } from "../types/spiritualFormation";

function countBy<T extends string>(items: T[]) {
  const map = new Map<T, number>();
  items.forEach((item) => map.set(item, (map.get(item) ?? 0) + 1));
  return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
}

function inRange(date: string, start: string, end: string) {
  return date.slice(0, 10) >= start.slice(0, 10) && date.slice(0, 10) <= end.slice(0, 10);
}

export function generateWeeklyReview(input: {
  userId: string;
  weekStartDate: string;
  weekEndDate: string;
  dailyExamens: DailyExamen[];
  thoughtEntries?: ThoughtCaptiveEntry[];
  graceRecoveryEntries?: GraceRecoveryEntry[];
}): WeeklyReview {
  const daily = input.dailyExamens.filter((entry) => entry.userId === input.userId && inRange(entry.date, input.weekStartDate, input.weekEndDate));
  const thoughts = (input.thoughtEntries ?? []).filter((entry) => entry.userId === input.userId && inRange(entry.date, input.weekStartDate, input.weekEndDate));
  const recoveries = (input.graceRecoveryEntries ?? []).filter((entry) => entry.userId === input.userId && inRange(entry.date, input.weekStartDate, input.weekEndDate));
  const patterns = countBy<SinPatternId>([
    ...daily.flatMap((entry) => entry.selectedPrimarySinPattern ? [entry.selectedPrimarySinPattern] : entry.detectedSinPatterns),
    ...thoughts.map((entry) => entry.namedSinPattern),
    ...recoveries.flatMap((entry) => entry.sinPattern ? [entry.sinPattern] : []),
  ]);
  const recommendedNextPractices: Practice[] = patterns.length
    ? patterns.slice(0, 2).flatMap(([pattern]) => sinPatternMap[pattern].dailyPractices.slice(0, 2))
    : [];

  return {
    id: `weekly_${input.userId}_${input.weekStartDate}`,
    userId: input.userId,
    weekStartDate: input.weekStartDate,
    weekEndDate: input.weekEndDate,
    mostFrequentSinPatterns: patterns.map(([sinPatternId, count]) => ({ sinPatternId, count })),
    topTriggers: countBy<TriggerCategory>(daily.flatMap((entry) => entry.triggers)).map(([trigger, count]) => ({ trigger, count })),
    recurringCoreLies: Array.from(new Set(daily.map((entry) => entry.coreLie).filter(Boolean))).slice(0, 5),
    fruitsPracticed: countBy<HolySpiritFruit>(daily.flatMap((entry) => entry.fruitPracticed)).map(([fruit, count]) => ({ fruit, count })),
    virtuesPracticed: countBy<NewLifeVirtue>(daily.flatMap((entry) => entry.virtuesPracticed)).map(([virtue, count]) => ({ virtue, count })),
    obedienceActionsCompleted: daily.map((entry) => entry.obedienceAction).filter(Boolean).slice(0, 12),
    graceRecoveryCount: recoveries.length + daily.filter((entry) => entry.graceRecoveryNeeded).length,
    pastoralEncouragement:
      daily.length || thoughts.length || recoveries.length
        ? "God is bringing this pattern into the light. Do not despise small beginnings. Awareness, confession, and one act of obedience are real signs of grace."
        : "No entries yet. Begin with a simple daily scan. The goal is not perfection, but bringing life before God honestly.",
    recommendedNextPractices,
    createdAt: new Date().toISOString(),
  };
}
