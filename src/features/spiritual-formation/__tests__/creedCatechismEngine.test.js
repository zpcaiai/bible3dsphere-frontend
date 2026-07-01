import { describe, expect, it, beforeEach } from 'vitest'
import { getDailyCatechism, listCatechismItems, markCatechismComplete, readCatechismCompleted, recommendCatechismPath } from '../lib/creedCatechismEngine'

describe('Creed catechism engine', () => {
  beforeEach(() => window.localStorage.clear())

  it('returns a stable daily item for the same day and pathway', () => {
    expect(getDailyCatechism('2026-07-01', 'beginner').key).toBe(getDailyCatechism('2026-07-01', 'beginner').key)
  })

  it('recommends themes from user concerns', () => {
    expect(recommendCatechismPath('我很焦虑神是否爱我').map((item) => item.category)).toContain('God')
    expect(recommendCatechismPath('我不明白教会有什么用')[0].category).toBe('Church')
  })

  it('saves completion state and searches content', () => {
    markCatechismComplete('u1', 'god-father')
    expect(readCatechismCompleted('u1')).toContain('god-father')
    expect(listCatechismItems({ query: 'Romans 8' }).length).toBeGreaterThan(0)
  })
})
