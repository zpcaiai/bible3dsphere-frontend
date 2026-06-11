import { HOLY_SPIRIT_FRUITS, type DailyExamen, type GraceRecoveryEntry, type HolySpiritFruit, type ThoughtCaptiveEntry } from "../types/spiritualFormation";
import { sinPatternMap } from "../data/sinPatterns";

export type FruitProgressLabel = "newly_practiced" | "growing" | "needs_attention" | "ask_for_grace";

export type FruitProgress = {
  fruit: HolySpiritFruit;
  count: number;
  relatedObedienceActions: string[];
  label: FruitProgressLabel;
  encouragement: string;
};

function labelFor(count: number): FruitProgressLabel {
  if (count >= 6) return "growing";
  if (count >= 2) return "newly_practiced";
  if (count === 1) return "ask_for_grace";
  return "needs_attention";
}

export function calculateFruitProgress(input: {
  dailyExamens: DailyExamen[];
  thoughtEntries?: ThoughtCaptiveEntry[];
  graceRecoveryEntries?: GraceRecoveryEntry[];
}): FruitProgress[] {
  return HOLY_SPIRIT_FRUITS.map((fruit) => {
    const dailyMatches = input.dailyExamens.filter((entry) => entry.fruitPracticed.includes(fruit));
    const thoughtMatches = (input.thoughtEntries ?? []).filter((entry) => sinPatternMap[entry.namedSinPattern].targetHolySpiritFruits.includes(fruit));
    const recoveryMatches = (input.graceRecoveryEntries ?? []).filter((entry) => entry.sinPattern && sinPatternMap[entry.sinPattern].targetHolySpiritFruits.includes(fruit));
    const count = dailyMatches.length + thoughtMatches.length + recoveryMatches.length;
    return {
      fruit,
      count,
      relatedObedienceActions: [
        ...dailyMatches.map((entry) => entry.obedienceAction),
        ...thoughtMatches.map((entry) => entry.obedienceAction),
        ...recoveryMatches.map((entry) => entry.nextObedienceStep),
      ].filter(Boolean).slice(0, 5),
      label: labelFor(count),
      encouragement: count > 0
        ? "This is a sign of grace. You are asking the Holy Spirit to form Christlike life in this area."
        : "Ask for grace here without shame. Fruit is formed by the Spirit, not earned as a badge.",
    };
  });
}
