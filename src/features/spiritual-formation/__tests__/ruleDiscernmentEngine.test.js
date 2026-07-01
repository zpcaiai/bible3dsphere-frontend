import { describe, expect, it } from 'vitest'
import { evaluateDiscernment, generateRuleOfLife, summarizeExamenConsolationDesolation } from '../lib/ruleDiscernmentEngine'

describe('Rule and discernment engine', () => {
  it('keeps burnout recovery gentle', () => {
    const rule = generateRuleOfLife({ season: 'burnout_recovery', energyLevel: 'low', availableMinutesPerDay: 60 })
    expect(rule.profile.overloadRisk).toBe(true)
    expect(rule.deepRule).toHaveLength(0)
    expect(rule.warningAgainstOverload).toContain('最小忠心')
  })

  it('recommends bounded rhythms for busy workers', () => {
    const rule = generateRuleOfLife({ season: 'busy_worker', energyLevel: 'normal', workPressure: 'high' })
    expect(rule.standardRule.map((item) => item.domain)).toContain('technology')
    expect(rule.standardRule.map((item) => item.domain)).toContain('work')
  })

  it('detects fear and control cautions in discernment', () => {
    const result = evaluateDiscernment({ decisionTitle: 'Job', fears: '我害怕失控，必须控制结果' })
    expect(result.cautionFlags.join(' ')).toContain('恐惧或控制')
  })

  it('summarizes consolation and desolation from examen entries', () => {
    const summary = summarizeExamenConsolationDesolation({ consolation: 'prayer', desolation: 'comparison', obedienceAction: 'call a friend' })
    expect(summary.tomorrow).toContain('call')
  })
})
