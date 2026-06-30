// Horarium — William Law's fixed hours of prayer ("A Serious Call", ch. 14-22).
// Mirrors backend spiritual_formation_engine.HORARIUM_HOURS so client and server agree.
// Bilingual: Chinese primary + English (`*En`) consumed at render via i18n `pick()`.

export type HorariumHour = {
  id: string;
  time: string;
  subject: string;
  title: string;
  titleEn: string;
  scripture: string;
  scriptureEn: string;
  focus: string;
  focusEn: string;
  prompt: string;
  promptEn: string;
};

export const horariumHours: HorariumHour[] = [
  {
    id: "early_morning",
    time: "06:00",
    subject: "Praise",
    title: "晨起 · 赞美与奉献",
    titleEn: "Morning · Praise & Dedication",
    scripture: "诗篇 5:3",
    scriptureEn: "Psalm 5:3",
    focus: "以赞美和感恩开始，将整天献给神。",
    focusEn: "Begin with praise and thanksgiving, offering the whole day to God.",
    prompt: "今晨我要为什么赞美神？我把今天的哪一部分交托给祂？",
    promptEn: "What will I praise God for this morning? Which part of today do I entrust to Him?",
  },
  {
    id: "third_hour",
    time: "09:00",
    subject: "Humility",
    title: "第三时 · 谦卑",
    titleEn: "Third Hour · Humility",
    scripture: "腓立比书 2:5-8",
    scriptureEn: "Philippians 2:5-8",
    focus: "求主对付骄傲，操练谦卑。",
    focusEn: "Ask the Lord to confront pride and to train humility.",
    prompt: "我在哪里想证明自己？如何效法基督的降卑？",
    promptEn: "Where am I trying to prove myself? How can I imitate Christ's lowliness?",
  },
  {
    id: "sixth_hour",
    time: "12:00",
    subject: "Universal Love",
    title: "第六时 · 普世之爱与代祷",
    titleEn: "Sixth Hour · Universal Love & Intercession",
    scripture: "提摩太前书 2:1",
    scriptureEn: "1 Timothy 2:1",
    focus: "为他人代求，操练爱与怜悯。",
    focusEn: "Intercede for others; practice love and mercy.",
    prompt: "今天我为谁代祷？我可以向谁行出爱？",
    promptEn: "Whom do I intercede for today? To whom can I show love?",
  },
  {
    id: "ninth_hour",
    time: "15:00",
    subject: "Resignation",
    title: "第九时 · 顺服神的旨意",
    titleEn: "Ninth Hour · Resignation to God's Will",
    scripture: "路加福音 22:42",
    scriptureEn: "Luke 22:42",
    focus: "在一切际遇中降服于神的旨意。",
    focusEn: "Surrender to God's will in every circumstance.",
    prompt: "我此刻在抗拒神的什么安排？我愿意说『愿你的旨意成就』吗？",
    promptEn: "What of God's ordering am I resisting now? Am I willing to say, 'Your will be done'?",
  },
  {
    id: "evening",
    time: "18:00",
    subject: "Confession",
    title: "傍晚 · 认罪与省察",
    titleEn: "Evening · Confession & Examen",
    scripture: "诗篇 139:23-24",
    scriptureEn: "Psalm 139:23-24",
    focus: "认罪、领受赦免、修复关系。",
    focusEn: "Confess, receive forgiveness, and repair relationships.",
    prompt: "今天我亏欠了神或人什么？我要如何认罪与修复？",
    promptEn: "How have I wronged God or others today? How will I confess and make repair?",
  },
  {
    id: "compline",
    time: "21:30",
    subject: "Eternity",
    title: "睡前 · 默想永恒",
    titleEn: "Before Sleep · Meditating on Eternity",
    scripture: "诗篇 90:12",
    scriptureEn: "Psalm 90:12",
    focus: "数算自己的日子，预备见主。",
    focusEn: "Number our days and prepare to meet the Lord.",
    prompt: "如果今夜见主，我预备好了吗？今天有什么值得感谢与悔改？",
    promptEn: "If I met the Lord tonight, am I ready? What today calls for thanks and repentance?",
  },
];

export const horariumHourIds = horariumHours.map((hour) => hour.id);
export const horariumHoursById = Object.fromEntries(
  horariumHours.map((hour) => [hour.id, hour]),
) as Record<string, HorariumHour>;
