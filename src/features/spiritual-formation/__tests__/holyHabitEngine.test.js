import { describe, expect, it } from 'vitest'
import {
  analyzeRestBlockers,
  buildHolyHabitDashboard,
  checkinHabit,
  createFastingPlan,
  createHabitPlan,
  createRestAudit,
  createRuleFromTemplate,
  generateHabitReview,
  getTodayHabits,
  orchestrateHolyHabitIntent,
  recommendFastingPractice,
  recommendHabits,
  recommendRule,
} from '../lib/holyHabitEngine'

describe('Rule of Life & Holy Habit Engine', () => {
  it('creates a rule from template with commitments and recommendation', () => {
    const recommendation = recommendRule('u1', 'busy work season with exhaustion', 'career_transition')
    const result = createRuleFromTemplate('u1', recommendation.template.id)

    expect(recommendation.template.id).toBe('burnout_recovery_rule')
    expect(result.profile.status).toBe('active')
    expect(result.commitments.length).toBeGreaterThan(3)
    expect(result.guidance.message).toContain('heavy')
  })

  it('recommends habits, checks in, and generates a grace-based review', () => {
    const habit = recommendHabits('u1', 'anger in conflict')[0]
    const plan = createHabitPlan('u1', habit)
    const result = checkinHabit('u1', plan, { completed: false, missedReason: 'travel', burdenScore: 4 })
    const review = generateHabitReview('u1', plan, [result.checkin])

    expect(habit.key).toBe('conflict_pause')
    expect(getTodayHabits('u1', [plan]).length).toBe(1)
    expect(result.checkin.graceResponse).toContain('Receive grace')
    expect(review.adjustmentSuggestions.join(' ')).toContain('Reduce')
  })

  it('analyzes rest blockers and recommends Sabbath practices', () => {
    const audit = createRestAudit('u1', { sleepHours: 5, workPressure: 9, phoneCompulsion: 8, restGuilt: 8, worshipDisrupted: true })
    const analysis = analyzeRestBlockers(audit)

    expect(analysis.blockers).toContain('sleep_debt')
    expect(analysis.blockers).toContain('productivity_idol')
    expect(analysis.warning).toContain('significant pressure')
  })

  it('blocks unsafe food fasting and recommends non-food alternatives', () => {
    const blocked = createFastingPlan('u1', 'one_meal_food_fast', { motive: 'I want to lose weight and punish myself' })
    const recommended = recommendFastingPractice('u1', 'social media distraction', '')

    expect(blocked.blocked).toBe(true)
    expect(blocked.guidance.message).toContain('medical risk')
    expect(blocked.alternatives.every((practice) => practice.fastingType !== 'food')).toBe(true)
    expect(recommended.practice.key).toBe('social_media_24h_fast')
  })

  it('builds dashboard and routes intents', () => {
    const rule = createRuleFromTemplate('u1', 'beginner_rule')
    const habitPlan = createHabitPlan('u1', 'morning_prayer')
    const habitCheckin = checkinHabit('u1', habitPlan, { completed: true }).checkin
    const dashboard = buildHolyHabitDashboard({
      userId: 'u1',
      ruleProfiles: [rule.profile],
      commitments: rule.commitments,
      habitPlans: [habitPlan],
      habitCheckins: [habitCheckin],
      sabbathPlans: [],
      restAudits: [],
      fastingPlans: [],
    })

    expect(dashboard.activeRule.title).toBe('Beginner Rule')
    expect(dashboard.habitCompletionSummary.todayCompleted).toBe(1)
    expect(orchestrateHolyHabitIntent('u1', 'I am burned out and need Sabbath').route).toBe('sabbath_rest')
    expect(orchestrateHolyHabitIntent('u1', 'I might hurt myself').route).toBe('crisis_care')
  })
})
