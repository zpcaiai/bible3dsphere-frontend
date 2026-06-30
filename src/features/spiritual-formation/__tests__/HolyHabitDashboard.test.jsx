import React from 'react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import HolyHabitDashboard from '../components/holy-habit/HolyHabitDashboard'
import { HOLY_HABIT_STORAGE_KEYS } from '../lib/holyHabitStorage'

describe('HolyHabitDashboard', () => {
  beforeEach(() => {
    Object.values(HOLY_HABIT_STORAGE_KEYS).forEach((key) => window.localStorage.removeItem(key))
  })

  afterEach(() => {
    cleanup()
  })

  it('creates a Rule of Life from a template', () => {
    render(<HolyHabitDashboard userId="u1" />)

    expect(screen.getByText('Rule of Life & Holy Habit Engine / 生活规则与圣洁习惯引擎')).toBeTruthy()
    fireEvent.click(screen.getByText('Rule of Life'))
    fireEvent.change(screen.getByLabelText('Template'), { target: { value: 'busy_worker_rule' } })
    fireEvent.click(screen.getByText('Create Rule of Life'))

    expect(screen.getAllByText('Busy Worker Rule').length).toBeGreaterThan(1)
    const profiles = JSON.parse(window.localStorage.getItem(HOLY_HABIT_STORAGE_KEYS.ruleProfiles) || '[]')
    const commitments = JSON.parse(window.localStorage.getItem(HOLY_HABIT_STORAGE_KEYS.commitments) || '[]')
    expect(profiles[0].title).toBe('Busy Worker Rule')
    expect(commitments.length).toBeGreaterThan(3)
  })

  it('creates and checks in a holy habit plan', () => {
    render(<HolyHabitDashboard userId="u1" />)

    fireEvent.click(screen.getByText('Holy Habits'))
    fireEvent.change(screen.getByLabelText('Habit'), { target: { value: 'morning_prayer' } })
    fireEvent.click(screen.getByText('Create Habit Plan'))
    fireEvent.change(screen.getByLabelText('Reflection'), { target: { value: 'I prayed before opening my phone.' } })
    fireEvent.click(screen.getByText('Complete Habit Check-In'))

    expect(screen.getByText('Habit Summary')).toBeTruthy()
    const plans = JSON.parse(window.localStorage.getItem(HOLY_HABIT_STORAGE_KEYS.habitPlans) || '[]')
    const checkins = JSON.parse(window.localStorage.getItem(HOLY_HABIT_STORAGE_KEYS.habitCheckins) || '[]')
    expect(plans[0].title).toBe('Morning Prayer')
    expect(checkins[0].completed).toBe(true)
  })

  it('creates rest audit, Sabbath plan, and completed session', () => {
    render(<HolyHabitDashboard userId="u1" />)

    fireEvent.click(screen.getByText('Sabbath'))
    fireEvent.click(screen.getByText('Save Rest Audit'))
    fireEvent.click(screen.getByText('Create Sabbath Plan'))
    fireEvent.click(screen.getByText('Start Sabbath Session'))
    fireEvent.click(screen.getByText('Complete Sabbath Session'))

    expect(screen.getByText('Sabbath Summary')).toBeTruthy()
    const audits = JSON.parse(window.localStorage.getItem(HOLY_HABIT_STORAGE_KEYS.restAudits) || '[]')
    const sessions = JSON.parse(window.localStorage.getItem(HOLY_HABIT_STORAGE_KEYS.sabbathSessions) || '[]')
    expect(audits[0].workPressure).toBe(8)
    expect(sessions[0].status).toBe('completed')
  })

  it('blocks unsafe food fast and creates a simplicity action', () => {
    render(<HolyHabitDashboard userId="u1" />)

    fireEvent.click(screen.getByText('Fasting'))
    fireEvent.change(screen.getByLabelText('Practice'), { target: { value: 'one_meal_food_fast' } })
    fireEvent.change(screen.getByLabelText('Formation need'), { target: { value: 'I want to lose weight and punish myself' } })
    fireEvent.click(screen.getByText('Create Fasting Plan'))
    expect(screen.getAllByText(/medical risk/).length).toBeGreaterThan(1)

    fireEvent.change(screen.getByLabelText('Practice'), { target: { value: 'social_media_24h_fast' } })
    fireEvent.change(screen.getByLabelText('Formation need'), { target: { value: 'phone distraction' } })
    fireEvent.click(screen.getByText('Create Fasting Plan'))
    fireEvent.click(screen.getByText('Run Simplicity Audit'))

    const plans = JSON.parse(window.localStorage.getItem(HOLY_HABIT_STORAGE_KEYS.fastingPlans) || '[]')
    const actions = JSON.parse(window.localStorage.getItem(HOLY_HABIT_STORAGE_KEYS.simplicityActions) || '[]')
    expect(plans[0].practiceKey).toBe('social_media_24h_fast')
    expect(actions[0].actionText).toContain('Pause one non-essential purchase')
  })
})
