import type { HolySpiritFruit, NewLifeVirtue, Practice, PracticeCategory, PracticeFrequency } from "../types/spiritualFormation";

type PracticeInput = {
  id: string;
  name: string;
  category: PracticeCategory;
  description: string;
  frequency?: PracticeFrequency;
  estimatedMinutes?: number;
  instructions: string[];
  relatedFruits?: HolySpiritFruit[];
  relatedVirtues?: NewLifeVirtue[];
};

export function createPractice(input: PracticeInput): Practice {
  return {
    frequency: "daily",
    estimatedMinutes: 10,
    relatedFruits: [],
    relatedVirtues: [],
    ...input,
  };
}

export const generalPractices = {
  morningSurrender: createPractice({
    id: "practice_morning_surrender",
    name: "Morning Surrender Prayer",
    category: "prayer",
    description: "Begin the day by surrendering time, body, money, relationships, and work to God.",
    estimatedMinutes: 5,
    instructions: ["Find a quiet place.", "Pray slowly: Lord, today I belong to You.", "Name one area you are tempted to control.", "Ask for grace to obey in that area."],
    relatedFruits: ["faithfulness", "self_control"],
    relatedVirtues: ["obedience", "humility"],
  }),
  eveningExamen: createPractice({
    id: "practice_evening_examen",
    name: "Evening Examen",
    category: "confession",
    description: "Review the day before God with honesty, confession, gratitude, and one next step.",
    estimatedMinutes: 10,
    instructions: ["Ask where you resisted grace today.", "Confess specifically without hiding.", "Name one mercy you received.", "Choose one concrete obedience action for tomorrow."],
    relatedFruits: ["faithfulness", "peace"],
    relatedVirtues: ["truthfulness", "obedience"],
  }),
  scriptureMeditation: createPractice({
    id: "practice_scripture_meditation",
    name: "Scripture Meditation",
    category: "scripture",
    description: "Read a short passage slowly and answer the core lie with God's truth.",
    estimatedMinutes: 12,
    instructions: ["Read the passage aloud.", "Underline one truth about God.", "Write the lie it confronts.", "Pray the truth back to God."],
    relatedFruits: ["faithfulness", "peace"],
    relatedVirtues: ["faith", "reverence"],
  }),
  confessionPrayer: createPractice({
    id: "practice_confession_prayer",
    name: "Confession Prayer",
    category: "confession",
    description: "Come into the light before Christ without self-justification or despair.",
    estimatedMinutes: 8,
    instructions: ["Name the sin plainly.", "Do not excuse or minimize it.", "Receive the promise of 1 John 1:9.", "Ask for grace to repair and obey."],
    relatedFruits: ["gentleness", "faithfulness"],
    relatedVirtues: ["truthfulness", "humility"],
  }),
  gratitudePractice: createPractice({
    id: "practice_gratitude",
    name: "Gratitude Practice",
    category: "gratitude",
    description: "Notice and thank God for concrete provisions instead of grasping for control.",
    estimatedMinutes: 5,
    instructions: ["List three gifts from God.", "Thank Him for Himself, not only outcomes.", "Ask for contentment in one area."],
    relatedFruits: ["joy", "peace"],
    relatedVirtues: ["contentment", "worship"],
  }),
  hiddenService: createPractice({
    id: "practice_hidden_service",
    name: "Hidden Service",
    category: "service",
    description: "Serve someone without seeking visibility, repayment, or control.",
    estimatedMinutes: 15,
    instructions: ["Choose a small concrete need.", "Serve without announcing it.", "Pray for the person afterward."],
    relatedFruits: ["love", "kindness", "goodness"],
    relatedVirtues: ["humility", "mercy"],
  }),
  digitalBoundary: createPractice({
    id: "practice_digital_boundary",
    name: "Digital Boundary",
    category: "digital_boundary",
    description: "Set a concrete limit around screen use so silence, prayer, and obedience have space.",
    estimatedMinutes: 10,
    instructions: ["Choose a no-screen window.", "Put the device outside arm's reach.", "Replace the first impulse with prayer or Scripture."],
    relatedFruits: ["self_control", "peace"],
    relatedVirtues: ["obedience", "reverence"],
  }),
  accountabilityCheckIn: createPractice({
    id: "practice_accountability_checkin",
    name: "Accountability Check-in",
    category: "accountability",
    description: "Invite a trusted mature believer into a repeated or destructive pattern.",
    frequency: "weekly",
    estimatedMinutes: 20,
    instructions: ["Contact a trusted person.", "Name the pattern honestly.", "Share one boundary and one obedience step.", "Ask them to follow up."],
    relatedFruits: ["faithfulness", "self_control"],
    relatedVirtues: ["humility", "truthfulness"],
  }),
};

export const allGeneralPractices = Object.values(generalPractices);
