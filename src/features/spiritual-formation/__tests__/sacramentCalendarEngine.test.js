import { describe, expect, it } from 'vitest'
import { buildCommunionReflection, buildLordDayPreparation, buildSeasonCard, getCurrentChurchSeason, getTraditionNote } from '../lib/sacramentCalendarEngine'

describe('Sacrament calendar engine', () => {
  it('returns stable seasons and season cards', () => {
    expect(getCurrentChurchSeason(new Date(2026, 11, 1)).key).toBe('advent')
    const card = buildSeasonCard(new Date(2026, 11, 25))
    expect(card.scriptureRefs.length).toBeGreaterThan(0)
    expect(card.prayer).toBeTruthy()
  })

  it('builds communion reflection with grace, unity, reconciliation, and support', () => {
    const reflection = buildCommunionReflection({ heavyGuilt: true })
    expect(reflection.grace).toContain('恩典')
    expect(reflection.unity).toContain('身体')
    expect(reflection.reconciliation).toContain('和好')
    expect(reflection.pastoralSupport).toContain('牧者')
  })

  it('provides non-exclusive tradition notes and Lord Day prep', () => {
    expect(getTraditionNote('communion')).toContain('不同传统')
    expect(buildLordDayPreparation(new Date()).steps.length).toBeGreaterThan(2)
  })
})
