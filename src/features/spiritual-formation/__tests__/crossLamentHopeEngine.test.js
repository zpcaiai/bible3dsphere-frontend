import { describe, expect, it } from 'vitest'
import { buildLamentFrame, classifySufferingInput } from '../lib/crossLamentHopeEngine'

describe('Cross lament hope engine', () => {
  it('classifies grief, unanswered prayer, and church hurt', () => {
    expect(classifySufferingInput('我失去了亲人').key).toBe('grief')
    expect(classifySufferingInput('祷告很久没有回应').key).toBe('unanswered_prayer')
    expect(classifySufferingInput('教会伤害让我不敢回去').key).toBe('church_hurt')
  })

  it('builds a lament frame without rushing closure', () => {
    const frame = buildLamentFrame('祷告很久没有回应')
    expect(frame.route).toBe('cross_lament_hope')
    expect(frame.notToRush.join(' ')).toContain('马上')
    expect(frame.psalmPrayer).toContain('Psalm')
  })

  it('routes unsafe language to support', () => {
    const frame = buildLamentFrame('我被虐待且无法保证安全')
    expect(frame.route).toBe('crisis_or_professional_support')
  })
})
