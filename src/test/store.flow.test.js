/**
 * End-to-end state-flow tests for src/store.js.
 */
import { beforeEach, describe, expect, it } from 'vitest'
import { useEmotionStore } from '../store'

const initialSlice = {
  layoutItems: [],
  historyItems: [],
  hovered: null,
  selectedFeature: null,
  selectedFeatureDetail: null,
  sphereGuidance: null,
  sphereBiblicalExample: null,
  queryResult: null,
  languageFilter: 'cuv',
  topFeatures: 6,
  topVerses: 5,
  zoomLevel: 'far',
  communityHeatmap: [],
  loading: false,
  error: '',
}

const state = () => useEmotionStore.getState()

describe('useEmotionStore domain flows', () => {
  beforeEach(() => {
    useEmotionStore.setState(initialSlice)
  })

  it('keeps the sphere exploration flow coherent', () => {
    const layoutItems = [
      { feature_key: 'peace', zh_label: 'Peace' },
      { feature_key: 'joy', zh_label: 'Joy' },
    ]
    const selected = layoutItems[0]
    const detail = { feature_key: 'peace', verses: [{ ref: 'John 14:27' }] }
    const guidance = { title: 'Guidance', steps: ['pause', 'pray'] }
    const example = { figure: 'Paul', reference: 'Philippians 4' }
    const result = { selected_emotions: ['peace'], verse_summary: { total: 3 } }

    state().setLoading(true)
    state().setLayoutItems(layoutItems)
    state().setSelectedFeature(selected)
    state().setSelectedFeatureDetail(detail)
    state().setSphereGuidance(guidance)
    state().setSpheresBiblicalExample(example)
    state().setQueryResult(result)
    state().setLoading(false)
    state().setError('')

    expect(state().layoutItems).toEqual(layoutItems)
    expect(state().selectedFeature).toEqual(selected)
    expect(state().selectedFeatureDetail).toEqual(detail)
    expect(state().sphereGuidance).toEqual(guidance)
    expect(state().sphereBiblicalExample).toEqual(example)
    expect(state().queryResult).toEqual(result)
    expect(state().loading).toBe(false)
    expect(state().error).toBe('')
  })

  it('can clear transient feature state when leaving a detail flow', () => {
    state().setSelectedFeature({ feature_key: 'fear' })
    state().setSelectedFeatureDetail({ verses: [1] })
    state().setSphereGuidance({ text: 'stay' })
    state().setSpheresBiblicalExample({ text: 'example' })
    state().setQueryResult({ ok: true })
    state().setHovered({ feature_key: 'fear' })

    state().setSelectedFeature(null)
    state().setSelectedFeatureDetail(null)
    state().setSphereGuidance(null)
    state().setSpheresBiblicalExample(null)
    state().setQueryResult(null)
    state().setHovered(null)

    expect(state().selectedFeature).toBeNull()
    expect(state().selectedFeatureDetail).toBeNull()
    expect(state().sphereGuidance).toBeNull()
    expect(state().sphereBiblicalExample).toBeNull()
    expect(state().queryResult).toBeNull()
    expect(state().hovered).toBeNull()
  })

  it('keeps history, filters, and heatmap independent from query results', () => {
    const historyItems = [{ id: 1, query: 'fear' }]
    const heatmap = [{ label: 'peace', count: 2, pct: 66.7, colour: '#fff' }]

    state().setHistoryItems(historyItems)
    state().setLanguageFilter('both')
    state().setCommunityHeatmap(heatmap)
    state().setQueryResult({ selected_emotions: ['joy'] })

    expect(state().historyItems).toEqual(historyItems)
    expect(state().languageFilter).toBe('both')
    expect(state().communityHeatmap).toEqual(heatmap)
    expect(state().queryResult).toEqual({ selected_emotions: ['joy'] })
  })
})
