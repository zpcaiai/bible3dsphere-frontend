export const ruleDiscernmentDomains = [
  ['prayer', '祷告', '用简短、稳定的节律亲近神。'],
  ['scripture', '读经', '领受并回应神的话。'],
  ['work', '工作', '把职业和责任献给神。'],
  ['rest', '安息', '承认自己是受造者，不是救主。'],
  ['body', '身体', '以睡眠、饮食、运动管理受造限制。'],
  ['money', '金钱', '以感恩、节制、慷慨操练管家身份。'],
  ['technology', '技术', '让工具服务爱，而不是训练逃避。'],
  ['relationships', '关系', '操练真实、和好、界限和祝福。'],
  ['church', '教会', '稳定参与敬拜、门训和肢体生活。'],
  ['service', '服事', '用隐藏而具体的爱服事人。'],
  ['silence', '静默', '停止表演，安静在神面前。'],
  ['mission', '使命', '在邻舍和日常场景中见证基督。'],
].map(([key, label, description]) => ({ key, label, description }))

export const lifeSeasonProfiles = {
  beginner: { label: '初学节律', maxDailyMinutes: 15 },
  busy_worker: { label: '高压工作', maxDailyMinutes: 20 },
  parent_or_caregiver: { label: '照护责任', maxDailyMinutes: 15 },
  student: { label: '学习阶段', maxDailyMinutes: 20 },
  burnout_recovery: { label: '倦怠恢复', maxDailyMinutes: 8 },
  suffering_season: { label: '受苦季节', maxDailyMinutes: 10 },
  leader: { label: '领袖服事', maxDailyMinutes: 30 },
  deep_formation: { label: '深度塑造', maxDailyMinutes: 45 },
}
