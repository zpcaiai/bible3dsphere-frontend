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
    renderPlanetHome()

    expect(document.body.textContent).toContain('属灵星球')
    expect(document.body.textContent).toContain('认识自己')
    expect(document.body.textContent).toContain('回到福音')
    expect(document.body.textContent).toContain('与神同行')
    expect(document.body.textContent).toContain('等候上帝')
    expect(document.body.textContent).toContain('天路客')
    expect(document.body.textContent).toContain('人格塑造')
  })

  it('routes primary action chips through go()', () => {
    const { getByText, go, onClose } = renderPlanetHome()

    fireEvent.click(getByText('偶像监测 ›'))
    fireEvent.click(getByText('福音诊断室 ›'))
    fireEvent.click(getByText('灵修操练 ›'))
    fireEvent.click(getByText('等候之路 ›'))
    fireEvent.click(getByText('进入天路历程 ›'))
    fireEvent.click(getByText('罪模式转化引擎 ›'))

    expect(go).toHaveBeenNthCalledWith(1, 'idolatry')
    expect(go).toHaveBeenNthCalledWith(2, 'gospel')
    expect(go).toHaveBeenNthCalledWith(3, 'hub')
    expect(go).toHaveBeenNthCalledWith(4, 'waiting')
    expect(go).toHaveBeenNthCalledWith(5, 'pilgrim')
    expect(go).toHaveBeenNthCalledWith(6, 'spiritual-formation')
    expect(onClose).not.toHaveBeenCalled()
  })

  it('closes for close chips and the back button', () => {
    const { getByText, onClose, go } = renderPlanetHome()

    fireEvent.click(getByText('本周牧养小结 ›'))
    fireEvent.click(getByText('‹'))

    expect(onClose).toHaveBeenCalledTimes(2)
    expect(go).not.toHaveBeenCalled()
  })

  it('routes secondary chips to their feature overlays', () => {
    const { getByText, go } = renderPlanetHome()

    fireEvent.click(getByText('低潮体检 ›'))
    fireEvent.click(getByText('今日省察 ›'))

    expect(go).toHaveBeenNthCalledWith(1, 'checkup')
    expect(go).toHaveBeenNthCalledWith(2, 'examen')
  })
})
