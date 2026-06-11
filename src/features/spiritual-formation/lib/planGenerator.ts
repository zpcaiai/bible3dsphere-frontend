import { generalPractices } from "../data/practices";
import { sinPatternMap } from "../data/sinPatterns";
import type { SpiritualIntensity, TransformationPlan, TransformationPlanDuration, SinPatternId } from "../types/spiritualFormation";

const durationDays: Record<TransformationPlanDuration, number> = {
  "7_days": 7,
  "30_days": 30,
  "90_days": 90,
  "1_year": 365,
};

export function getIntensityDescription(intensity: SpiritualIntensity): { title: string; dailyMinutes: string; description: string } {
  const copy = {
    light: { title: "Light", dailyMinutes: "10 minutes", description: "For beginners, spiritually weak users, or users recovering from burnout." },
    normal: { title: "Normal", dailyMinutes: "25-40 minutes", description: "For stable believers with a sustainable daily rhythm." },
    deep: { title: "Deep", dailyMinutes: "60-90 minutes", description: "For mature disciples, leaders, or serious spiritual formation." },
    battle: { title: "Battle", dailyMinutes: "morning + midday + evening check-ins", description: "For acute temptation or recurring bondage with boundaries and accountability." },
  };
  return copy[intensity];
}

function addDays(date: string, days: number) {
  const [year, month, day] = date.split("-").map(Number);
  const d = new Date(Date.UTC(year, month - 1, day));
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function uid() {
  return `sf_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function durationLabel(duration: TransformationPlanDuration) {
  return {
    "7_days": "7-Day Awareness",
    "30_days": "30-Day Mortification",
    "90_days": "90-Day Formation",
    "1_year": "1-Year New Creation Map",
  }[duration];
}

function reviewQuestions(duration: TransformationPlanDuration) {
  if (duration === "7_days") {
    return ["Which sin pattern appeared most often?", "What emotion usually came before it?", "What trigger usually activated it?", "What lie did I believe?", "Where did I see God's grace?"];
  }
  if (duration === "30_days") {
    return ["What did I put off this week?", "What did I put on this week?", "When did temptation become strongest?", "What boundary needs strengthening?", "What fruit is beginning to appear?"];
  }
  if (duration === "90_days") {
    return ["Month 1: where did awareness and confession increase?", "Month 2: what boundaries helped mortification?", "Month 3: what new obedience and fruit are becoming more natural?", "Which relationships show fruit?", "Where do I still resist God?"];
  }
  return ["Quarter 1: where is holiness and self-control needed?", "Quarter 2: where is humility and obedience needed?", "Quarter 3: where is love, mercy, and compassion needed?", "Quarter 4: where is justice, faithfulness, and worship needed?", "What next formation theme is God bringing into the light?"];
}

function titleFor(duration: TransformationPlanDuration, patternName: string, virtue: string) {
  if (duration === "7_days") return `7-Day Awareness: Seeing ${patternName}`;
  if (duration === "30_days") return `30-Day Mortification: Putting Off ${patternName} and Putting On ${virtue}`;
  if (duration === "90_days") return `90-Day Formation: From ${patternName} to Christlike ${virtue}`;
  return "1-Year New Creation Map: Growing in Holiness, Love, and Obedience";
}

export function generateTransformationPlan(input: {
  userId: string;
  duration: TransformationPlanDuration;
  intensity: SpiritualIntensity;
  primarySinPattern: SinPatternId;
  secondarySinPattern?: SinPatternId;
  startDate?: string;
}): TransformationPlan {
  const primary = sinPatternMap[input.primarySinPattern];
  const secondary = input.secondarySinPattern ? sinPatternMap[input.secondarySinPattern] : null;
  const startDate = input.startDate ?? todayIsoDate();
  const now = new Date().toISOString();
  const baseDaily =
    input.duration === "7_days"
      ? [generalPractices.scriptureMeditation, generalPractices.eveningExamen, ...primary.dailyPractices.slice(0, 2)]
      : [generalPractices.morningSurrender, generalPractices.scriptureMeditation, generalPractices.eveningExamen, ...primary.dailyPractices.slice(0, 3)];
  const battleDaily = input.intensity === "battle" ? [...baseDaily, ...primary.emergencyPractices.slice(0, 3)] : baseDaily;
  const deepDaily = input.intensity === "deep" ? [...battleDaily, generalPractices.confessionPrayer, generalPractices.hiddenService] : battleDaily;
  const weekly = [generalPractices.accountabilityCheckIn, ...primary.weeklyPractices.slice(0, 3), ...(secondary ? secondary.weeklyPractices.slice(0, 1) : [])];
  const targetFruits = Array.from(new Set([...primary.targetHolySpiritFruits, ...(secondary?.targetHolySpiritFruits ?? [])]));
  const targetVirtues = Array.from(new Set([...primary.oppositeVirtues, ...(secondary?.oppositeVirtues ?? [])]));
  const accountability =
    input.intensity === "battle"
      ? " This plan is not meant to be fought alone. If this pattern is recurring or destructive, invite a mature believer, pastor, counselor, or trusted accountability partner into the process."
      : "";

  return {
    id: uid(),
    userId: input.userId,
    title: titleFor(input.duration, primary.name, targetVirtues[0] ?? "Obedience"),
    duration: input.duration,
    intensity: input.intensity,
    primarySinPattern: input.primarySinPattern,
    secondarySinPattern: input.secondarySinPattern,
    targetFruits,
    targetVirtues,
    dailyPractices: input.intensity === "light" ? deepDaily.slice(0, 2) : deepDaily,
    weeklyPractices: input.intensity === "light" ? weekly.slice(0, 2) : weekly,
    reviewQuestions: reviewQuestions(input.duration),
    progressSummary: `${durationLabel(input.duration)} follows this movement: identify, bring into light, confess, repent, put off, put on, practice, bear fruit, and review.${accountability}`,
    recommendedNextStep: input.intensity === "battle" ? "Invite real accountability today and remove access to the strongest trigger." : "Begin with today's Scripture, confession, and one concrete obedience action.",
    startDate,
    endDate: addDays(startDate, durationDays[input.duration]),
    status: "active",
    completedPracticeIds: [],
    createdAt: now,
    updatedAt: now,
  };
}
