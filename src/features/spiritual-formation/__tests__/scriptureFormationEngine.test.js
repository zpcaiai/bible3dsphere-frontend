import { describe, expect, it } from 'vitest'
import { scripturePassages } from '../data/scriptureFormationSeed'
import {
  buildDashboard,
  completeLectioSession,
  createLectioSession,
  createMemoryItem,
  detectCrisisMarkers,
  reviewMemoryItem,
  scoreRecall,
  submitLectioStage,
} from '../lib/scriptureFormationEngine'

describe('Scripture Meditation & Inner Formation OS engine', () => {
  it('advances a Lectio Divina session through the five stages', () => {
    let session = createLectioSession('u1', scripturePassages[0])
    for (const stage of ['read', 'meditate', 'pray', 'contemplate', 'obey']) {
      const result = submitLectioStage(session, stage, stage === 'obey' ? 'Pray before answering one hard message today.' : `notes for ${stage}`)
      session = result.session
    }
    session = completeLectioSession(session)

    expect(session.stage).toBe('completed')
    expect(session.completionScore).toBe(100)
    expect(session.obedienceAction).toContain('Pray before answering')
    expect(session.formationInsight).toContain('next faithful step')
  })

  it('routes crisis language before normal formation guidance', () => {
    const safety = detectCrisisMarkers('I might hurt myself tonight')

    expect(safety.route).toBe('crisis_care')
    expect(safety.recommendedNextSystem).toBe('crisis_care_system')
  })

  it('scores recall and updates spaced repetition schedule', () => {
    const item = createMemoryItem('u1', {
      id: 'john-15-5',
      reference: 'John 15:5',
      verseText: 'I am the vine; you are the branches. Apart from me you can do nothing.',
    })
    const score = scoreRecall(item.verse.verseText, 'I am the vine and you are branches')
    const reviewed = reviewMemoryItem(item, 'I am the vine and you are branches', 'good', 'Abide before work.')

    expect(score.accuracyScore).toBeGreaterThan(0.45)
    expect(reviewed.reviewCount).toBe(1)
    expect(reviewed.currentIntervalDays).toBe(2)
    expect(reviewed.attempts[0].aiFeedback).toContain('Where can this verse shape one action today?')
  })

  it('builds unified dashboard data', () => {
    const lectio = completeLectioSession(createLectioSession('u1', scripturePassages[0]))
    const memory = reviewMemoryItem(createMemoryItem('u1', {
      id: 'psalm-119-11',
      reference: 'Psalm 119:11',
      verseText: 'I have stored up your word in my heart.',
    }), 'stored your word in my heart', 'easy')
    const dashboard = buildDashboard({
      userId: 'u1',
      lectioSessions: [lectio],
      memoryItems: [memory],
      examenSessions: [],
      confessionSessions: [],
    })

    expect(dashboard.today.dailyPassage.reference).toBeTruthy()
    expect(dashboard.weeklySummary.lectioCompletedCount).toBe(1)
    expect(dashboard.weeklySummary.memoryReviewsCount).toBe(1)
  })
})
