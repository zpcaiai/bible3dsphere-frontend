import { describe, expect, it } from 'vitest'
import { detectDisorderedLove, routeOrdoAmorisInput } from '../lib/ordoAmorisEngine'

describe('Ordo Amoris engine', () => {
  it('detects control, approval, success, comfort, and technology patterns', () => {
    expect(detectDisorderedLove('我必须掌控结果才安全')[0].key).toBe('control')
    expect(detectDisorderedLove('别人不认可我我就崩溃')[0].key).toBe('approval')
    expect(detectDisorderedLove('我失败就没有价值')[0].key).toBe('success')
    expect(detectDisorderedLove('我只想刷手机逃避')[0].key).toBe('comfort')
  })

  it('routes unsafe language before ordinary formation', () => {
    const result = routeOrdoAmorisInput('我绝望到想伤害自己')
    expect(result.route).toBe('crisis_care')
  })

  it('builds a non-shaming gospel response', () => {
    const result = routeOrdoAmorisInput('我很怕计划改变，必须控制')
    expect(result.response.carefulLanguage).toContain('不一定是最终诊断')
    expect(result.response.gospelTruth).toContain('基督')
  })
})
