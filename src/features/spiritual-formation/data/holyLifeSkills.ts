import type { HolyLifeSkillId } from "../types/spiritualFormation";

export type HolyLifeSkillTime = "morning" | "day" | "decision" | "evening";

export type HolyLifeSkillDefinition = {
  id: HolyLifeSkillId;
  title: string;
  shortTitle: string;
  time: HolyLifeSkillTime;
  metric: string;
  purpose: string;
  prompt: string;
  placeholder: string;
  suggestions: string[];
  practice: string;
};

export const holyLifeSkills: HolyLifeSkillDefinition[] = [
  {
    id: "morning_consecration",
    title: "Morning Consecration",
    shortTitle: "晨间奉献",
    time: "morning",
    metric: "Consecration Score",
    purpose: "一天开始以前，把身体、时间、思想、情绪、工作重新献给神。",
    prompt: "今天我是否再次把自己献给神？",
    placeholder: "Lord, today is not mine. My time, body, work, money, thoughts and emotions belong to You.",
    suggestions: ["今天不是属于我的一天", "把工作和计划交给神", "求主使用我的身体、时间、金钱、思想", "今天让我完成你的旨意"],
    practice: "慢慢读奉献祷告，并写下今天最容易抓在自己手里的一个领域。",
  },
  {
    id: "purpose_reset",
    title: "Purpose Reset",
    shortTitle: "目的重置",
    time: "morning",
    metric: "Purpose Purity",
    purpose: "检查今天要做的事，是为了荣耀神，还是证明自己、控制结果、追求安全感。",
    prompt: "今天最重要的事，真正目的是什么？",
    placeholder: "我今天做这件事，是为了荣耀神、爱邻舍、忠心，还是为了被看见？",
    suggestions: ["荣耀神", "爱邻舍", "证明自己", "安全感", "控制", "比较", "赚钱", "被认可"],
    practice: "选今天最重要的一件事，写下真实动机，再把它改写成敬拜的目的。",
  },
  {
    id: "presence_of_god",
    title: "Presence of God",
    shortTitle: "神同在练习",
    time: "day",
    metric: "Living Before God",
    purpose: "在普通时刻暂停、观察、悔改、归回，重新活在神面前。",
    prompt: "此刻，我是否意识到神就在这里？",
    placeholder: "暂停 30 秒。Observe / Repent / Return。",
    suggestions: ["我现在在哪里远离神", "把焦虑交托", "重新开始", "主就在这里", "安静 30 秒"],
    practice: "点击一次同在暂停，记录一句此刻的归回。",
  },
  {
    id: "thought_examination",
    title: "Thought Examination",
    shortTitle: "思想监察",
    time: "evening",
    metric: "Thought Map",
    purpose: "不是只检查行为，而是看见今天反复出现的幻想、担忧、欲望、骄傲和惧怕。",
    prompt: "今天最大的思想、幻想、担忧、欲望或怒气是什么？",
    placeholder: "今天我的思想最常绕着什么转？它暴露了什么惧怕、骄傲、嫉妒或自爱？",
    suggestions: ["Fear", "Pride", "Envy", "Self-love", "Vanity", "Impurity", "Control", "Approval"],
    practice: "写下一个反复出现的思想，并命名它背后的根。",
  },
  {
    id: "intention_inspector",
    title: "Intention Inspector",
    shortTitle: "动机分析",
    time: "decision",
    metric: "Motivation Radar",
    purpose: "在重要决定前检查真实意图，因为神看重人的 intentions。",
    prompt: "这个决定里，我真正想得到什么？",
    placeholder: "我想得到认可、安全、控制、权力，还是愿意荣耀神？",
    suggestions: ["别人认可", "安全", "控制", "权力", "舒适", "荣耀神", "保护面子", "爱人"],
    practice: "记录今天一个决定，区分表面理由和真实动机。",
  },
  {
    id: "holy_speech",
    title: "Holy Speech",
    shortTitle: "言语训练",
    time: "evening",
    metric: "Speech Holiness Score",
    purpose: "复盘聊天、评论、会议、邮件中的夸耀、抱怨、论断、操纵、讥笑和浪费。",
    prompt: "今天哪些话需要被基督更新？",
    placeholder: "如果重新说，我可以怎样更诚实、更温柔、更像基督？",
    suggestions: ["夸耀", "抱怨", "论断", "冷漠", "操纵", "炫耀", "撒谎", "讥笑", "浪费"],
    practice: "选一句今天说过的话，写下更像基督的重说版本。",
  },
  {
    id: "ordinary_life_worship",
    title: "Ordinary Life Worship",
    shortTitle: "日常敬拜",
    time: "day",
    metric: "Ordinary Worship %",
    purpose: "把吃饭、工作、学习、家庭、休息都重新理解为敬拜。",
    prompt: "今天一件普通任务，是否被我作为敬拜献上？",
    placeholder: "我是否忠心、尽力、爱邻舍，并把结果交给神？",
    suggestions: ["忠心", "尽力", "爱邻舍", "不抱怨", "不敷衍", "不为表现", "把结果交托"],
    practice: "记录一个普通任务，用敬拜语言重新定义它。",
  },
  {
    id: "self_denial_trainer",
    title: "Self-Denial Trainer",
    shortTitle: "舍己训练",
    time: "day",
    metric: "Self-denial Level",
    purpose: "不是苦修，而是在小事上训练不以自我为中心。",
    prompt: "今天我可以在哪一件小事上舍己？",
    placeholder: "少说一句，少抱怨一次，主动帮助，先听别人，放弃炫耀，安静服侍。",
    suggestions: ["少说一句", "少抱怨一次", "主动帮助", "先听别人", "最后吃饭", "放弃炫耀", "安静服侍"],
    practice: "选择一个小型舍己行动，完成后记录阻力和结果。",
  },
  {
    id: "humility_detector",
    title: "Humility Detector",
    shortTitle: "谦卑检测",
    time: "evening",
    metric: "Humility Index",
    purpose: "检测证明自己、想赢、想被看见、无法接受批评等骄傲模式。",
    prompt: "今天我在哪里特别想证明自己？",
    placeholder: "我是否喜欢赢、喜欢被夸、害怕被忽略，或不能接受批评？",
    suggestions: ["证明自己", "喜欢赢", "喜欢被看见", "期待被夸", "不能接受批评", "比较", "防御"],
    practice: "写下一个骄傲反应，并写出一个谦卑替代动作。",
  },
  {
    id: "charity_practice",
    title: "Charity Practice",
    shortTitle: "爱心操练",
    time: "day",
    metric: "Love Score",
    purpose: "让敬虔具体表现为 love：帮助、鼓励、探访、饶恕、施舍。",
    prompt: "今天我具体爱了谁？",
    placeholder: "帮助一个人，鼓励一个人，探访一个人，饶恕一个人，施舍一次。",
    suggestions: ["帮助一个人", "鼓励一个人", "探访一个人", "饶恕一个人", "施舍一次", "主动问候", "为人代祷"],
    practice: "选择一个人，写下今天可执行的爱心行动。",
  },
  {
    id: "evening_examen",
    title: "Evening Examen",
    shortTitle: "晚间省察",
    time: "evening",
    metric: "Daily Holiness Report",
    purpose: "在一天结束时感谢、认罪、回顾顺服与抗拒，并交托明天。",
    prompt: "今天哪里最像基督，哪里最不像基督？",
    placeholder: "最感谢什么？最失败什么？哪里顺服了神？哪里拒绝了圣灵？",
    suggestions: ["最感谢", "最失败", "最像基督", "最不像基督", "顺服", "拒绝圣灵", "更新明天"],
    practice: "写下感谢、认罪、顺服、明日更新各一句。",
  },
  {
    id: "eternal_perspective",
    title: "Eternal Perspective",
    shortTitle: "永恒视角",
    time: "evening",
    metric: "Eternal Readiness",
    purpose: "每天想到永恒，检查今天是否值得、是否荣耀神、是否真正爱人、是否预备见主。",
    prompt: "如果今天就是人生最后一天，今天值得吗？",
    placeholder: "今天荣耀神了吗？真正爱人了吗？我是否预备见主？",
    suggestions: ["今天值得吗", "荣耀神了吗", "真正爱人了吗", "预备见主了吗", "有什么需要悔改", "有什么值得感谢"],
    practice: "用永恒视角写一句今天的评估和明天的调整。",
  },
];

export const holyLifeSkillsById = Object.fromEntries(holyLifeSkills.map((skill) => [skill.id, skill])) as Record<HolyLifeSkillId, HolyLifeSkillDefinition>;

export const holyLifePipeline = [
  "Consecration",
  "Purpose Reset",
  "Daily Planner",
  "Presence Reminder",
  "Thought Capture",
  "Decision Review",
  "Speech Review",
  "Love Practice",
  "Evening Examen",
  "Tomorrow Formation",
];
