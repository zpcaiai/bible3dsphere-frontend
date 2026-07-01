import { detectCrisisMarkers, uid } from './scriptureFormationEngine'
import { crossLamentHopeCategories } from '../data/crossLamentHopeSeed'

const byKey = Object.fromEntries(crossLamentHopeCategories.map((item) => [item.key, item]))
const keywords = {
  grief: ['失去', '悲伤', '哀伤', 'grief', 'loss'],
  death: ['去世', '死亡', '死了', 'death', '葬礼'],
  unanswered_prayer: ['祷告很久', '没有回应', 'unanswered', '沉默'],
  church_hurt: ['教会伤害', '牧者伤害', '不敢回教会', 'church hurt'],
  betrayal: ['背叛', 'betrayal', '出卖'],
  burnout: ['枯竭', 'burnout', '耗尽', '不想动'],
  illness: ['疾病', '生病', '诊断', 'illness', '病痛'],
  injustice: ['不公', '冤枉', 'injustice', '欺压'],
  waiting: ['等候', '等待', 'waiting'],
  spiritual_dryness: ['灵性干旱', '神很远', '祷告空', 'dry'],
  shame: ['羞耻', '羞愧', 'shame'],
  loneliness: ['孤独', 'lonely', '没人'],
  persecution: ['逼迫', 'persecution'],
  failure: ['失败', 'fail', '搞砸'],
}

export function detectUnsafeSufferingInput(inputText = '') {
  const safety = detectCrisisMarkers(inputText)
  if (safety) return { route: 'crisis_or_professional_support', safety }
  if (/家暴|性侵|儿童|虐待|不能活|无法保证安全|domestic violence|sexual assault|child safety/i.test(inputText)) {
    return { route: 'crisis_or_professional_support', safety: { message: '这涉及安全风险。请优先联系当地紧急资源、可信的人和合格专业支持。' } }
  }
  return null
}

export function classifySufferingInput(inputText = '') {
  const input = String(inputText || '').toLowerCase()
  const found = Object.entries(keywords).find(([, words]) => words.some((word) => input.includes(String(word).toLowerCase())))
  return found ? byKey[found[0]] : byKey.waiting
}

export function recommendPsalmForPain(categoryKey = 'waiting', intensity = 'moderate') {
  const category = byKey[categoryKey] || byKey.waiting
  if (intensity === 'heavy' && category.psalmSuggestions.includes('Psalm 88')) return 'Psalm 88'
  return category.psalmSuggestions[0]
}

export function createFaithfulNextStep(categoryKey = 'waiting', capacity = 'normal') {
  if (capacity === 'low') return '只做一个最小步骤：喝水、呼吸、向神说一句真实的话，或联系一个可信的人。'
  return (byKey[categoryKey] || byKey.waiting).faithfulNextStep
}

export function buildLamentFrame(inputText = '', categoryKey = null, options = {}) {
  const unsafe = detectUnsafeSufferingInput(inputText)
  if (unsafe) return { route: unsafe.route, safety: unsafe.safety }
  const category = categoryKey ? (byKey[categoryKey] || classifySufferingInput(inputText)) : classifySufferingInput(inputText)
  const psalm = recommendPsalmForPain(category.key, options.intensity || 'moderate')
  return {
    route: 'cross_lament_hope',
    id: uid('lament_frame'),
    categoryKey: category.key,
    heardPain: `我听见这里有${category.displayNameZh}。这份痛苦不需要先被解释，才可以带到神面前。`,
    permissionToLament: category.lamentPermission,
    christNear: category.christNearInWeakness,
    scripture: category.scriptureRefs[0],
    psalmPrayer: `可以用 ${psalm} 的方式向神说：主啊，我把真实的痛苦带到你面前，求你怜悯、扶持，并赐我今天一个小小的忠心。`,
    notToRush: category.avoidSaying,
    nextSmallStep: createFaithfulNextStep(category.key, options.capacity || 'normal'),
    supportPrompt: category.supportRecommendation,
  }
}

export { crossLamentHopeCategories }
