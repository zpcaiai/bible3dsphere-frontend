// 中文 | EN 语言切换按钮 / Language switch control
//
// 放在顶栏右上角。两段式胶囊，高亮当前语言；点击任一段即切换。
// 样式内联，沿用顶栏其它按钮的玻璃质感，避免依赖额外 CSS。

import { useLang } from './LanguageContext'

export default function LanguageToggle({ style }) {
  const { lang, setLang, t } = useLang()

  const seg = (active) => ({
    background: active ? 'rgba(255,255,255,0.92)' : 'transparent',
    color: active ? '#0d1117' : 'rgba(255,255,255,0.6)',
    border: 'none',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: active ? 700 : 500,
    lineHeight: 1,
    padding: '4px 7px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'background 0.18s, color 0.18s',
  })

  return (
    <div
      role="group"
      aria-label={t('lang.switchTitle')}
      title={t('lang.switchTitle')}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '2px',
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '8px',
        padding: '2px',
        flexShrink: 0,
        ...style,
      }}
    >
      <button
        type="button"
        onClick={() => setLang('zh')}
        aria-pressed={lang === 'zh'}
        style={seg(lang === 'zh')}
      >
        {t('lang.zh')}
      </button>
      <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px' }}>|</span>
      <button
        type="button"
        onClick={() => setLang('en')}
        aria-pressed={lang === 'en'}
        style={seg(lang === 'en')}
      >
        {t('lang.en')}
      </button>
    </div>
  )
}
