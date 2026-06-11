// PersonalSearchPage — 个人数据全局搜索。
// 一个关键词横跨：灵修日记 / 主日笔记 / 我的祷告 / 聚会纪要 / 背经卡，
// 结果分组展示、命中词高亮，可跳转对应板块。
import { useEffect, useRef, useState } from 'react'
import BackButton from './BackButton'
import { searchPersonal } from './api'
import { t } from './i18n/runtime'

const GROUP_META = {
  devotion: { icon: '📖', panel: 'devotion' },
  sermon:   { icon: '✍️', panel: 'journal' },
  prayer:   { icon: '🙏', panel: 'prayer' },
  minutes:  { icon: '📝', panel: 'group-hub' },
  memory:   { icon: '🃏', panel: 'memory-deck' },
}

function Highlight({ text, q }) {
  if (!q || !text) return <>{text}</>
  const idx = text.toLowerCase().indexOf(q.toLowerCase())
  if (idx < 0) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <mark style={{ background: 'rgba(255,214,10,0.35)', color: '#ffe9b3', borderRadius: 3, padding: '0 2px' }}>
        {text.slice(idx, idx + q.length)}
      </mark>
      {text.slice(idx + q.length)}
    </>
  )
}

export default function PersonalSearchPage({ token, onBack, onOpenPanel }) {
  const [q, setQ] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const timerRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  // 输入防抖 400ms 自动搜索
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    const kw = q.trim()
    if (!kw) { setResult(null); setErr(''); return }
    timerRef.current = setTimeout(() => doSearch(kw), 400)
    return () => clearTimeout(timerRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q])

  async function doSearch(kw) {
    setLoading(true)
    setErr('')
    try {
      const data = await searchPersonal(kw, token)
      setResult(data)
    } catch (e) {
      setErr(String(e.message || e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: '#0d1117', color: '#fff', fontFamily: 'inherit' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
        <BackButton onClick={onBack} />
        <div style={{ fontSize: 16, fontWeight: 700 }}>🗃 {t("我的数据搜索")}</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 14, boxSizing: 'border-box' }}>
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("搜灵修日记、主日笔记、祷告、纪要、背经卡…")}
          style={{
            width: '100%', boxSizing: 'border-box', background: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.16)', borderRadius: 12,
            padding: '12px 14px', color: '#fff', fontSize: 15, fontFamily: 'inherit', outline: 'none',
          }}
        />

        {!q.trim() && (
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.45)', fontSize: 13.5, lineHeight: 2, padding: '40px 16px' }}>
            {t("输入关键词，一次搜遍你的全部属灵记录：")}<br />
            📖 {t("灵修日记")} · ✍️ {t("主日笔记")} · 🙏 {t("我的祷告")}<br />
            📝 {t("聚会纪要")} · 🃏 {t("背经卡")}
          </div>
        )}

        {loading && <div style={{ textAlign: 'center', padding: 24, color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>{t("搜索中…")}</div>}
        {err && <div style={{ textAlign: 'center', padding: 24, color: '#ff6b6b', fontSize: 13 }}>{err}</div>}

        {result && !loading && result.groups?.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 16px', color: 'rgba(255,255,255,0.45)', fontSize: 13.5 }}>
            {t("没有找到包含「")}{result.q}{t("」的记录。")}
          </div>
        )}

        {result && !loading && result.groups?.map((g) => {
          const meta = GROUP_META[g.type] || { icon: '📄', panel: null }
          return (
            <div key={g.type} style={{ marginTop: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#e8b04b' }}>{meta.icon} {t(g.label)}</span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{g.items.length}</span>
                {meta.panel && onOpenPanel && (
                  <button
                    onClick={() => onOpenPanel(meta.panel)}
                    style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#7dd3fc', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    {t("去看看 →")}
                  </button>
                )}
              </div>
              {g.items.map((item, i) => (
                <div key={`${g.type}-${item.id}-${i}`} style={{
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 12, padding: '11px 13px', marginBottom: 8,
                }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>
                      <Highlight text={item.title} q={result.q} />
                    </span>
                    {item.date && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginLeft: 'auto', flexShrink: 0 }}>{item.date}</span>}
                  </div>
                  {item.snippet && (
                    <div style={{ fontSize: 12.5, lineHeight: 1.7, color: 'rgba(255,255,255,0.6)' }}>
                      <Highlight text={item.snippet} q={result.q} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
