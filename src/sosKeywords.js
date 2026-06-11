// SOS 关键词检测 — 独立小模块，供 App 输入框同步检测；
// SOSModal 本体已 lazy 化，避免为一个检测函数把整个弹窗拖进首包。
export const SOS_KEYWORDS = ["绝望", "放弃", "活不下去", "不想活", "失去信仰", "看不见神", "神在哪里", "抛弃"]

export function checkSOSKeywords(text) {
  if (!text) return false
  return SOS_KEYWORDS.some(kw => text.includes(kw))
}
