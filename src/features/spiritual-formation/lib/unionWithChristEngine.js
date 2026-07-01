import { detectCrisisMarkers } from './scriptureFormationEngine'
import { unionIdentityScenarios } from '../data/unionWithChristSeed'

const fallbackScenario = unionIdentityScenarios.find((item) => item.key === 'performance_identity')

export function detectIdentityDistortion(inputText = '') {
  const input = String(inputText || '').toLowerCase()
  return unionIdentityScenarios.find((scenario) =>
    scenario.triggerPatterns.some((pattern) => input.includes(String(pattern).toLowerCase())),
  ) || null
}

export function shouldRouteToPastoralCare(inputText = '') {
  const safety = detectCrisisMarkers(inputText)
  if (safety) return { route: safety.route, message: safety.message }
  const scenario = detectIdentityDistortion(inputText)
  if (scenario?.pastoralRoute) {
    return {
      route: 'pastoral_care',
      message: '这可能正在形成强迫性内疚循环。请暂停重复确认，并联系牧者、成熟信徒或合格辅导者。',
    }
  }
  return null
}

export function buildGraceIdentityResponse(inputText = '', context = {}) {
  const pastoral = shouldRouteToPastoralCare(inputText)
  if (pastoral) return { route: pastoral.route, pastoral, scenario: null }
  const scenario = detectIdentityDistortion(inputText) || fallbackScenario
  return {
    route: 'grace_identity',
    scenarioKey: scenario.key,
    falseIdentity: scenario.falseIdentity,
    inChristTruth: scenario.inChristTruth,
    assurance: scenario.gospelAssurance,
    scriptureRefs: scenario.scriptureRefs,
    gentleCorrection: scenario.gentleCorrection,
    nextStep: context.nextStep || scenario.nextObedienceStep,
    prayer: scenario.prayer,
  }
}

export function wrapPracticeWithGraceGuard(practice) {
  if (!practice) return practice
  return {
    ...practice,
    graceGuard: '你不是靠完成这个操练才被接纳；你是在已被接纳中学习顺服。',
  }
}

export { unionIdentityScenarios }
