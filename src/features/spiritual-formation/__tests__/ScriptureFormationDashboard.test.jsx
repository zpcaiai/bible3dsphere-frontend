import React from 'react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import ScriptureFormationDashboard from '../components/scripture-formation/ScriptureFormationDashboard'
import { SCRIPTURE_FORMATION_STORAGE_KEYS } from '../lib/scriptureFormationStorage'

describe('ScriptureFormationDashboard', () => {
  beforeEach(() => {
    Object.values(SCRIPTURE_FORMATION_STORAGE_KEYS).forEach((key) => window.localStorage.removeItem(key))
  })

  afterEach(() => {
    cleanup()
  })

  it('renders dashboard cards and completes a Lectio Divina session', () => {
    render(<ScriptureFormationDashboard userId="u1" />)

    expect(screen.getByText('Scripture Meditation & Inner Formation OS')).toBeTruthy()
    expect(screen.getByText("Today's Scripture")).toBeTruthy()

    fireEvent.click(screen.getByText('Start Lectio Session'))
    for (const value of [
      'The word rooted stands out.',
      'I see my hurry and desire for control.',
      'Lord, teach me to abide.',
      'I receive grace to be still.',
      'Pause and pray before my first meeting today.',
    ]) {
      fireEvent.change(screen.getByPlaceholderText('Write your notes, prayer, or obedience action.'), { target: { value } })
      fireEvent.click(screen.getByText(value.includes('Pause and pray') ? 'Complete Lectio' : 'Save and Continue'))
    }

    expect(screen.getByText('Lectio Session Summary')).toBeTruthy()
    expect(screen.getByText('Pause and pray before my first meeting today.')).toBeTruthy()
    const stored = JSON.parse(window.localStorage.getItem(SCRIPTURE_FORMATION_STORAGE_KEYS.lectioSessions) || '[]')
    expect(stored[0].stage).toBe('completed')
  })

  it('adds and reviews a memory verse without showing full text first', () => {
    render(<ScriptureFormationDashboard userId="u1" />)

    fireEvent.change(screen.getByLabelText('Add to memory plan'), { target: { value: 'psalm-119-11' } })
    fireEvent.click(screen.getByText('Add Verse'))

    expect(screen.queryByText('I have stored up your word in my heart, that I might not sin against you.')).toBeNull()
    fireEvent.change(screen.getByPlaceholderText('Type as much as you can remember.'), {
      target: { value: 'I have stored your word in my heart' },
    })
    fireEvent.click(screen.getByText('Submit Review'))

    expect(screen.getByText(/accuracy/)).toBeTruthy()
    const stored = JSON.parse(window.localStorage.getItem(SCRIPTURE_FORMATION_STORAGE_KEYS.memoryItems) || '[]')
    expect(stored[0].reviewCount).toBe(1)
  })
})
