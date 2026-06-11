import { describe, expect, it } from "vitest";
import { recommendSpiritualResponse } from "../lib/recommendationEngine";

describe("recommendSpiritualResponse", () => {
  it("maps financial anxiety toward greed and peace", () => {
    const result = recommendSpiritualResponse({
      emotion: "anxiety",
      triggers: ["financial_insecurity"],
      behaviorText: "I keep checking my money and investments and feel unsafe.",
    });
    expect(result.likelySinPatterns).toContain("greed_consumerism");
    expect(result.suggestedFruits.some((fruit) => ["peace", "self_control"].includes(fruit))).toBe(true);
  });

  it("maps sexual temptation toward sexual disorder", () => {
    const result = recommendSpiritualResponse({
      emotion: "lust",
      triggers: ["sexual_temptation"],
      behaviorText: "I am tempted by porn and sexual fantasy.",
    });
    expect(result.likelySinPatterns).toContain("sexual_disorder");
    expect(result.suggestedFruits).toContain("self_control");
  });

  it("maps anger after offense toward hatred and peace", () => {
    const result = recommendSpiritualResponse({
      emotion: "anger",
      triggers: ["offense"],
      behaviorText: "I want revenge and I keep thinking about insulting them.",
    });
    expect(result.likelySinPatterns).toContain("hatred_division");
    expect(result.suggestedFruits.some((fruit) => ["gentleness", "peace"].includes(fruit))).toBe(true);
  });

  it("maps digital escape toward entertainment escapism", () => {
    const result = recommendSpiritualResponse({
      emotion: "emptiness",
      triggers: ["social_media", "boredom"],
      behaviorText: "I keep scrolling videos to escape prayer and responsibility.",
    });
    expect(result.likelySinPatterns).toContain("entertainment_escapism");
    expect(result.suggestedFruits).toContain("self_control");
  });

  it("maps pride after success toward pride", () => {
    const result = recommendSpiritualResponse({
      emotion: "prideful_confidence",
      triggers: ["success"],
      behaviorText: "I feel better than others and do not want correction.",
    });
    expect(result.likelySinPatterns).toContain("pride");
  });

  it("maps delayed obedience toward spiritual numbness", () => {
    const result = recommendSpiritualResponse({
      emotion: "numbness",
      triggers: ["boredom"],
      behaviorText: "I keep delaying obedience and sin does not feel serious.",
    });
    expect(result.likelySinPatterns).toContain("spiritual_numbness");
  });
});
