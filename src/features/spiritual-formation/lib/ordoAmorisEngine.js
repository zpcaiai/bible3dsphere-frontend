import { detectCrisisMarkers, todayKey, uid } from './scriptureFormationEngine'
import { loveOrderNodes, ordoAmorisCategories } from '../data/ordoAmorisSeed'

const byKey = Object.fromEntries(ordoAmorisCategories.map((item) => [item.key, item]))

export function detectDisorderedLove(inputText = '') {
  const input = String(inputText || '').toLowerCase()
  const scored = ordoAmorisCategories.map((category) => {
    const score = (category.keywords || []).reduce((sum, keyword) => {
      const k = String(keyword).toLowerCase()
      return input.includes(k) ? sum + 2 : sum
    }, 0) + (category.commonSymptoms || []).reduce((sum, symptom) => input.includes(String(symptom).toLowerCase()) ? sum + 1 : sum, 0)
    return { ...category, score }
  }).filter((item) => item.score > 0).sort((a, b) => b.score - a.score)
  if (scored.length) return scored.slice(0, 3)
  if (!input.trim()) return []
  return ordoAmorisCategories.filter((item) => ['control', 'approval', 'comfort'].includes(item.key)).map((item) => ({ ...item, score: 1 }))
}

export function buildLoveOrderMap(selectedKeys = []) {
  const selected = new Set(selectedKeys)
  return loveOrderNodes.map(([key, zh, en], index) => ({
    key,
    labelZh: zh,
    labelEn: en,
    order: key === 'god' ? 1 : index + 1,
    pressure: selected.has('money') && key === 'money'
      ? 'high'
      : selected.has('success') && key === 'work'
        ? 'high'
        : selected.has('romance') && key === 'neighbor'
          ? 'high'
          : selected.has('family') && key === 'neighbor'
            ? 'medium'
            : selected.has('technology') && key === 'self'
              ? 'medium'
              : 'normal',
  }))
}

export function createReorderingPractice(loveKey, context = '') {
  const category = byKey[loveKey] || byKey.control
  return {
    id: uid('ordo_practice'),
    loveKey: category.key,
    title: `${category.displayNameZh}的福音重排`,
    context,
    goodDesire: category.goodDesire,
    falsePromise: category.falsePromise,
    gospelTruth: category.gospelReorderingTruth,
    practice: category.replacementPractice,
    prayerPrompt: `主啊，帮助我把${category.displayNameZh}从救主的位置放回礼物的位置，使我在基督里学习信靠与顺服。`,
    scriptureRefs: category.scriptureRefs,
    createdAt: new Date().toISOString(),
  }
}

export function routeOrdoAmorisInput(inputText = '') {
  const safety = detectCrisisMarkers(inputText)
  if (safety) return { route: safety.route, safety, matches: [], response: null }
  const matches = detectDisorderedLove(inputText)
  const primary = matches[0]
  if (!primary) return { route: 'empty', matches, response: null }
  return {
    route: 'ordo_amoris',
    matches,
    response: {
      id: uid('ordo_response'),
      date: todayKey(),
      possibleLove: primary.displayNameZh,
      carefulLanguage: `这不一定是最终诊断，但值得留意：你可能正在把“${primary.displayNameZh}”放到过重的位置。`,
      goodDesire: primary.goodDesire,
      disorderedForm: primary.disorderedForm,
      falsePromise: primary.falsePromise,
      gospelTruth: primary.gospelReorderingTruth,
      practice: primary.replacementPractice,
      prayerPrompt: `主啊，让我看见这份渴望原本的美好，也让我不再要求它成为救主。`,
      scriptureRefs: primary.scriptureRefs,
    },
  }
}

export function createOrdoAmorisRecord(userId, inputText, selectedKeys = []) {
  const routed = routeOrdoAmorisInput(inputText)
  return {
    id: uid('ordo_record'),
    userId,
    date: todayKey(),
    inputText,
    selectedKeys,
    route: routed.route,
    response: routed.response,
    matches: routed.matches.map((item) => item.key),
    loveOrderMap: buildLoveOrderMap(selectedKeys.length ? selectedKeys : routed.matches.map((item) => item.key)),
    createdAt: new Date().toISOString(),
  }
}

export { ordoAmorisCategories }
