/**
 * Interaction tests for the PlanetHome navigation surface.
 */
import React from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'
import PlanetHome from '../PlanetHome'

const renderPlanetHome = () => {
  const onClose = vi.fn()
  const go = vi.fn()
  const view = render(<PlanetHome onClose={onClose} go={go} />)
  return { ...view, onClose, go }
}

describe('PlanetHome', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders the full growth-map entry list', () => {
    const { container } = renderPlanetHome()

    expect(container.querySelector('#planet-home-title')).not.toBeNull()
    expect(container.querySelectorAll('.planet-card')).toHaveLength(6)
    expect(container.querySelectorAll('.planet-card-main')).toHaveLength(6)
    expect(container.querySelectorAll('.planet-chip')).toHaveLength(13)
  })

  it('routes primary continent cards through go()', () => {
    const { container, go, onClose } = renderPlanetHome()
    const cards = container.querySelectorAll('.planet-card-main')

    fireEvent.click(cards[0])
    fireEvent.click(cards[1])
    fireEvent.click(cards[2])
    fireEvent.click(cards[3])
    fireEvent.click(cards[4])
    fireEvent.click(cards[5])

    expect(go).toHaveBeenNthCalledWith(1, 'idolatry')
    expect(go).toHaveBeenNthCalledWith(2, 'gospel')
    expect(go).toHaveBeenNthCalledWith(3, 'hub')
    expect(go).toHaveBeenNthCalledWith(4, 'waiting')
    expect(go).toHaveBeenNthCalledWith(5, 'pilgrim')
    expect(go).toHaveBeenNthCalledWith(6, 'fhl')
    expect(onClose).not.toHaveBeenCalled()
  })

  it('closes for close chips and the back button', () => {
    const { container, onClose, go } = renderPlanetHome()
    const formationCard = container.querySelectorAll('.planet-card').item(5)
    const closeChip = formationCard.querySelectorAll('.planet-chip').item(1)
    const backButton = container.querySelector('.planet-back-btn')

    fireEvent.click(closeChip)
    fireEvent.click(backButton)

    expect(onClose).toHaveBeenCalledTimes(2)
    expect(go).not.toHaveBeenCalled()
  })

  it('routes secondary chips to their feature overlays', () => {
    const { container, go } = renderPlanetHome()
    const selfDiscoveryCard = container.querySelectorAll('.planet-card').item(0)
    const [, checkupChip, examenChip] = selfDiscoveryCard.querySelectorAll('.planet-chip')

    fireEvent.click(checkupChip)
    fireEvent.click(examenChip)

    expect(go).toHaveBeenNthCalledWith(1, 'checkup')
    expect(go).toHaveBeenNthCalledWith(2, 'examen')
  })
})
