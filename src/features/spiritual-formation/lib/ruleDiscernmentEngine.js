import { lifeSeasonProfiles, ruleDiscernmentDomains } from '../data/ruleDiscernmentSeed'

function clampMinutes(input, fallback) {
  const n = Number(input)
  if (!Number.isFinite(n) || n <= 0) return fallback
  return Math.max(3, Math.min(90, n))
}

export function buildRuleOfLifeProfile(input = {}) {
  const season = input.season || 'beginner'
  const profile = lifeSeasonProfiles[season] || lifeSeasonProfiles.beginner
  const available = clampMinutes(input.availableMinutesPerDay, profile.maxDailyMinutes)
  const overloadRisk = input.energyLevel === 'low' || input.spiritualState === 'overwhelmed' || season === 'burnout_recovery'
  return {
    season,
    seasonLabel: profile.label,
    availableMinutesPerDay: Math.min(available, profile.maxDailyMinutes),
    overloadRisk,
    needsChurchSupport: input.churchSupport === 'none' || input.churchSupport === 'loose',
    domains: ruleDiscernmentDomains,
  }
}

export function generateMinimumRule(input = {}) {
  const profile = buildRuleOfLifeProfile(input)
  return [
    { domain: 'prayer', rhythm: '每日一句真实祷告', minutes: 1 },
    { domain: 'scripture', rhythm: '每日慢读一节经文', minutes: 3 },
    { domain: 'rest', rhythm: '一个不看手机的短暂停顿', minutes: Math.min(5, profile.availableMinutesPerDay) },
  ]
}

export function generateRuleOfLife(input = {}) {
  const profile = buildRuleOfLifeProfile(input)
  const minimumRule = generateMinimumRule(input)
  const standardRule = profile.overloadRisk
    ? minimumRule
    : [
        ...minimumRule,
        { domain: 'work', rhythm: '开始工作前做 30 秒奉献祷告', minutes: 1 },
        { domain: 'technology', rhythm: '睡前 30 分钟无屏', minutes: 0 },
        { domain: 'relationships', rhythm: '每周一次主动祝福或修复关系', minutes: 10 },
      ]
  const deepRule = profile.overloadRisk
    ? []
    : [
        ...standardRule,
        { domain: 'silence', rhythm: '每周一次 20 分钟静默', minutes: 20 },
        { domain: 'service', rhythm: '每周一次隐藏服事', minutes: 20 },
        { domain: 'church', rhythm: '主日前预备、主日后回应讲道', minutes: 15 },
      ]
  return {
    profile,
    minimumRule,
    standardRule,
    deepRule,
    warningAgainstOverload: profile.overloadRisk
      ? '你现在适合最小忠心。规则是脚手架，不是证明自己的律法。'
      : '规则帮助你接受恩典，不是用来换取接纳。',
    weeklyReviewQuestions: ['哪些节律带来信、望、爱？', '哪里出现了过度操练或逃避？', '下周一个最小忠心是什么？'],
    recommendedPractices: standardRule.map((item) => item.domain),
  }
}

export function evaluateDiscernment(input = {}) {
  const text = [input.decisionTitle, input.optionA, input.optionB, input.fears, input.desires, input.counselReceived, input.prayerNotes].join(' ').toLowerCase()
  const fearControl = /怕|恐惧|必须|控制|失控|fear|control|panic/.test(text)
  const noCounsel = !String(input.counselReceived || '').trim()
  const service = /爱|服事|邻舍|使命|love|serve|mission/.test(text)
  const scores = {
    faith: fearControl ? 45 : 70,
    hope: /绝望|没有出路|despair/.test(text) ? 35 : 68,
    love: service ? 78 : 58,
    freedomVsControl: fearControl ? 38 : 72,
    humility: noCounsel ? 48 : 74,
    wisdom: noCounsel ? 52 : 76,
    communityConfirmation: noCounsel ? 25 : 75,
    longTermFruit: /长期|fruit|成熟|忠心/.test(text) ? 78 : 60,
  }
  const cautionFlags = [
    fearControl ? '这个选择里可能有恐惧或控制驱动，需要慢下来辨认。' : '',
    noCounsel ? '重大决定建议找成熟信徒、牧者或可信同伴确认。' : '',
  ].filter(Boolean)
  return {
    scores,
    cautionFlags,
    nextStep: cautionFlags.length
      ? '先不要把焦虑当作神的声音。请祷告、等候，并邀请可信的人一起辨认。'
      : '选择一个小而可逆的忠心行动，观察它是否持续结出信、望、爱。',
    summary: '重大决定不只看效率，也看是否更结出信、望、爱。',
  }
}

export function summarizeExamenConsolationDesolation(entry = {}) {
  return {
    consolation: entry.consolation || entry.gratitude || '留意今天让你更靠近信、望、爱的片刻。',
    desolation: entry.desolation || entry.strongestEmotion || '留意今天让你更孤立、恐惧或控制的片刻。',
    tomorrow: entry.obedienceAction || '明天选择一个小顺服，而不是一个宏大证明。',
  }
}
