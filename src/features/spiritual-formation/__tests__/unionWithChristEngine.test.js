import { describe, expect, it } from 'vitest'
import { buildGraceIdentityResponse, detectIdentityDistortion } from '../lib/unionWithChristEngine'

describe('Union with Christ grace identity engine', () => {
  it('detects common false identity sentences', () => {
    expect(detectIdentityDistortion('我又失败了').key).toBe('failed_again')
    expect(detectIdentityDistortion('我不配来到神面前').key).toBe('unworthy')
    expect(detectIdentityDistortion('我必须表现好神才爱我').key).toBe('performance_identity')
  })

  it('responds to broken streak with assurance before action', () => {
    const response = buildGraceIdentityResponse('我灵修断了神肯定不要我了')
    expect(response.route).toBe('grace_identity')
    expect(response.inChristTruth).toContain('计分板')
    expect(response.nextStep).toContain('重新开始')
  })

  it('routes obsessive guilt to pastoral care', () => {
    const response = buildGraceIdentityResponse('我一直反复认罪还是不安心')
    expect(response.route).toBe('pastoral_care')
  })
})
