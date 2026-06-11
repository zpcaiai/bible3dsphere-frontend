import { sinPatternMap, sinPatterns } from "../data/sinPatterns";
import type { HolySpiritFruit, NewLifeVirtue, RecommendationInput, RecommendationResult, SinPatternId, SpiritualEmotion, TriggerCategory } from "../types/spiritualFormation";

const emotionRules: Partial<Record<SpiritualEmotion, { patterns: SinPatternId[]; lies: string[]; fruits: HolySpiritFruit[] }>> = {
  anxiety: {
    patterns: ["greed_consumerism", "self_centeredness", "idolatry", "babel_pride"],
    lies: ["I must be in control to be safe.", "God may not provide what I need.", "If I lose this, I cannot be okay."],
    fruits: ["peace", "faithfulness", "self_control"],
  },
  anger: {
    patterns: ["hatred_division", "pride", "self_centeredness"],
    lies: ["I have the right to punish.", "My will must be honored.", "Contempt will protect me."],
    fruits: ["patience", "gentleness", "peace"],
  },
  envy: {
    patterns: ["greed_consumerism", "idolatry", "pride"],
    lies: ["God has been better to them than to me.", "My worth depends on having what they have.", "I cannot rejoice unless I am above others."],
    fruits: ["joy", "love", "goodness"],
  },
  lust: {
    patterns: ["sexual_disorder", "idolatry", "entertainment_escapism"],
    lies: ["This desire can satisfy me.", "My body belongs to me.", "Secret pleasure will heal my emptiness."],
    fruits: ["self_control", "faithfulness", "love"],
  },
  emptiness: {
    patterns: ["entertainment_escapism", "idolatry", "spiritual_numbness"],
    lies: ["Distraction can fill me.", "God is not enough right now.", "I cannot face silence."],
    fruits: ["joy", "peace", "self_control"],
  },
  shame: {
    patterns: ["lies_falsehood", "religious_hypocrisy", "spiritual_numbness"],
    lies: ["I must hide to be safe.", "If I am known, I will be rejected.", "Appearance matters more than truth."],
    fruits: ["faithfulness", "peace", "gentleness"],
  },
  prideful_confidence: {
    patterns: ["pride", "babel_pride", "religious_hypocrisy", "self_centeredness"],
    lies: ["I do not need correction.", "My wisdom is sufficient.", "My achievements prove my worth."],
    fruits: ["gentleness", "faithfulness", "self_control"],
  },
  numbness: {
    patterns: ["spiritual_numbness", "entertainment_escapism", "religious_hypocrisy"],
    lies: ["Delayed obedience is safe.", "This sin is not serious.", "I can return to God later."],
    fruits: ["faithfulness", "love", "self_control"],
  },
};

const triggerRules: Record<TriggerCategory, SinPatternId[]> = {
  pressure: ["self_centeredness", "entertainment_escapism", "babel_pride", "greed_consumerism"],
  loneliness: ["entertainment_escapism", "sexual_disorder", "idolatry", "coldness_lack_of_love"],
  comparison: ["pride", "greed_consumerism", "idolatry"],
  success: ["pride", "babel_pride", "religious_hypocrisy"],
  failure: ["lies_falsehood", "entertainment_escapism", "self_centeredness", "spiritual_numbness"],
  rejection: ["idolatry", "hatred_division", "lies_falsehood", "pride"],
  offense: ["hatred_division", "pride", "self_centeredness"],
  financial_insecurity: ["greed_consumerism", "idolatry", "babel_pride"],
  sexual_temptation: ["sexual_disorder", "entertainment_escapism", "idolatry"],
  boredom: ["entertainment_escapism", "spiritual_numbness", "sexual_disorder"],
  fatigue: ["entertainment_escapism", "coldness_lack_of_love", "self_centeredness"],
  conflict: ["hatred_division", "pride", "lies_falsehood"],
  social_media: ["entertainment_escapism", "greed_consumerism", "idolatry", "pride", "sexual_disorder"],
  power_opportunity: ["injustice_oppression", "pride", "babel_pride"],
  religious_performance: ["religious_hypocrisy", "pride", "lies_falsehood"],
};

const behaviorKeywords: Record<SinPatternId, string[]> = {
  self_centeredness: ["my way", "control", "interrupted", "entitled", "serve me", "my plan"],
  idolatry: ["can't live without", "obsessed", "ultimate", "must have", "afraid to lose"],
  greed_consumerism: ["money", "buy", "shopping", "investment", "rich", "house", "stock", "financial", "possessions", "spending"],
  sexual_disorder: ["porn", "lust", "sexual", "fantasy", "body", "temptation", "impure"],
  pride: ["better than", "look down", "defensive", "criticized", "prove myself", "superior", "correction"],
  lies_falsehood: ["lied", "hide", "exaggerate", "fake", "pretend", "cover up", "image"],
  hatred_division: ["hate", "revenge", "angry", "attack", "insult", "contempt", "unforgive"],
  injustice_oppression: ["unfair", "exploit", "oppress", "power", "profit", "weak", "worker", "poor"],
  religious_hypocrisy: ["perform", "spiritual image", "church image", "pretend godly", "judge others", "religious"],
  coldness_lack_of_love: ["cold", "ignore", "don't care", "indifferent", "avoid needy", "lack compassion"],
  entertainment_escapism: ["scroll", "video", "game", "netflix", "youtube", "tiktok", "bilibili", "escape", "distract", "procrastinate", "phone"],
  babel_pride: ["technology", "ai", "build", "scale", "fame", "achievement", "startup", "optimize", "efficiency", "make a name"],
  spiritual_numbness: ["numb", "no feeling", "delay", "not serious", "don't care", "avoid god", "harden", "obedience"],
};

const pastoralNotes: Partial<Record<SinPatternId, string>> = {
  entertainment_escapism: "This may be a moment to bring your restlessness to God instead of escaping into stimulation. Do not begin with self-hatred. Begin by returning to Christ and choosing one small act of stillness.",
  greed_consumerism: "This may be an invitation to examine where money or possession has become a false refuge. God is not against wise provision, but He calls your heart to trust Him above wealth.",
  hatred_division: "This anger may need to be brought into the light before it becomes contempt. Christ invites you to entrust justice to God and practice one step toward peace.",
};

function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

function addScore(scores: Record<SinPatternId, number>, pattern: SinPatternId, points: number) {
  scores[pattern] = (scores[pattern] ?? 0) + points;
}

export function recommendSpiritualResponse(input: RecommendationInput): RecommendationResult {
  const scores = Object.fromEntries(sinPatterns.map((pattern) => [pattern.id, 0])) as Record<SinPatternId, number>;
  const possibleCoreLies: string[] = [];
  const suggestedFruits: HolySpiritFruit[] = [];

  if (input.selectedSinPattern) addScore(scores, input.selectedSinPattern, 6);

  const emotionRule = input.emotion ? emotionRules[input.emotion] : undefined;
  if (emotionRule) {
    emotionRule.patterns.forEach((pattern, index) => addScore(scores, pattern, 5 - index));
    possibleCoreLies.push(...emotionRule.lies);
    suggestedFruits.push(...emotionRule.fruits);
  }

  input.triggers?.forEach((trigger) => {
    triggerRules[trigger]?.forEach((pattern, index) => addScore(scores, pattern, 3 - Math.min(index, 2)));
  });

  const text = input.behaviorText?.toLowerCase() ?? "";
  Object.entries(behaviorKeywords).forEach(([pattern, keywords]) => {
    keywords.forEach((keyword) => {
      if (text.includes(keyword)) addScore(scores, pattern as SinPatternId, 3);
    });
  });

  const likelySinPatterns = (Object.entries(scores) as Array<[SinPatternId, number]>)
    .filter(([, score]) => score > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([pattern]) => pattern);

  const top = likelySinPatterns[0] ?? "self_centeredness";
  const topPatterns = likelySinPatterns.length ? likelySinPatterns : [top];
  const gospelTruths = topPatterns.map((pattern) => sinPatternMap[pattern].gospelTruth);
  const virtues = unique(topPatterns.flatMap((pattern) => sinPatternMap[pattern].oppositeVirtues)) as NewLifeVirtue[];
  const patternFruits = topPatterns.flatMap((pattern) => sinPatternMap[pattern].targetHolySpiritFruits);
  const practices = unique(topPatterns.flatMap((pattern) => sinPatternMap[pattern].dailyPractices.slice(0, 2))).slice(0, 4);

  return {
    likelySinPatterns: topPatterns,
    possibleCoreLies: unique([...possibleCoreLies, ...topPatterns.map((pattern) => sinPatternMap[pattern].coreLie)]).slice(0, 5),
    suggestedGospelTruths: unique(gospelTruths),
    suggestedFruits: unique([...suggestedFruits, ...patternFruits]).slice(0, 5),
    suggestedVirtues: virtues.slice(0, 5),
    suggestedPractices: practices,
    pastoralNote:
      pastoralNotes[top] ??
      "This may indicate a pattern worth bringing before God in prayer. The app cannot diagnose your heart with certainty, but it can help you come into the light and choose one concrete act of obedience.",
  };
}
