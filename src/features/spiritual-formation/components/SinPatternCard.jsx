import { useState } from 'react'
import { T, fruitName, localizePattern } from '../lib/localize'

export default function SinPatternCard({ pattern: rawPattern, onSelect }) {
  const [open, setOpen] = useState(false)
  const pattern = localizePattern(rawPattern)

  return (
    <article
      className="sf-card sf-pattern-card"
      style={{
        background: open 
          ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 149, 0, 0.015) 100%)'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.01) 100%)',
        border: open 
          ? '1px solid rgba(255, 149, 0, 0.25)' 
          : '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: open 
          ? '0 8px 32px rgba(0, 0, 0, 0.25), 0 0 15px rgba(255, 149, 0, 0.05)' 
          : '0 4px 20px rgba(0, 0, 0, 0.15)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        marginBottom: '4px'
      }}
    >
      {/* ── 卡片头部折叠开关 ── */}
      <button
        className="sf-card-button"
        type="button"
        onClick={() => {
          setOpen(!open)
          onSelect?.(pattern.id)
        }}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          textAlign: 'left',
          color: '#fff',
          outline: 'none'
        }}
      >
        <div style={{ flex: 1, paddingRight: '12px' }}>
          <h3 style={{ 
            margin: 0, 
            fontSize: '17px', 
            fontWeight: 800, 
            color: open ? '#ffd699' : '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'color 0.2s'
          }}>
            <span>🔍</span>
            {pattern.name}
          </h3>
          <p style={{ 
            margin: '4px 0 0 0', 
            fontSize: '12.5px', 
            color: 'rgba(255, 255, 255, 0.55)',
            lineHeight: '1.5'
          }}>
            {pattern.description}
          </p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', shrink: 0 }}>
          <span 
            className="sf-card-short" 
            style={{ 
              alignSelf: 'center',
              borderRadius: '999px',
              background: open ? 'rgba(255, 149, 0, 0.12)' : 'rgba(255, 255, 255, 0.06)',
              color: open ? '#ff9500' : 'rgba(255, 255, 255, 0.7)',
              border: open ? '1px solid rgba(255, 149, 0, 0.25)' : '1px solid rgba(255, 255, 255, 0.12)',
              padding: '3px 8px',
              fontSize: '11px',
              fontWeight: 800,
              transition: 'all 0.2s'
            }}
          >
            {pattern.shortName}
          </span>
          <span style={{ 
            fontSize: '14px', 
            color: open ? '#ff9500' : 'rgba(255, 255, 255, 0.3)', 
            transition: 'transform 0.25s', 
            transform: open ? 'rotate(180deg)' : 'none',
            display: 'inline-block'
          }}>
            ▼
          </span>
        </div>
      </button>

      {/* ── 核心谎言与福音真理分栏横幅 ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '12px',
        marginTop: '16px',
      }}>
        {/* 核心谎言 */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255, 69, 58, 0.06) 0%, rgba(255, 69, 58, 0.01) 100%)',
          border: '1px solid rgba(255, 69, 58, 0.16)',
          borderRadius: '12px',
          padding: '12px 14px',
          boxShadow: 'inset 0 0 10px rgba(255, 69, 58, 0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <span style={{ fontSize: '12px' }}>⚠️</span>
            <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#ff453a', letterSpacing: '0.5px' }}>
              {T('核心谎言', 'CORE LIE')}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '12.5px', color: '#ffb3b0', lineHeight: '1.5', fontWeight: 500 }}>
            {pattern.coreLie}
          </p>
        </div>

        {/* 福音真理 */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(48, 209, 88, 0.06) 0%, rgba(48, 209, 88, 0.01) 100%)',
          border: '1px solid rgba(48, 209, 88, 0.16)',
          borderRadius: '12px',
          padding: '12px 14px',
          boxShadow: 'inset 0 0 10px rgba(48, 209, 88, 0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <span style={{ fontSize: '12px' }}>✨</span>
            <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#30d158', letterSpacing: '0.5px' }}>
              {T('福音真理', 'GOSPEL TRUTH')}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '12.5px', color: '#a3e2ab', lineHeight: '1.5', fontWeight: 500 }}>
            {pattern.gospelTruth}
          </p>
        </div>
      </div>

      {/* ── 圣灵果子标签栏 ── */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '12px' }}>
        {pattern.targetHolySpiritFruits.map((fruit) => (
          <span
            key={fruit}
            style={{
              fontSize: '11px',
              fontWeight: 600,
              background: 'rgba(52, 199, 89, 0.06)',
              border: '1px solid rgba(52, 199, 89, 0.16)',
              color: '#8effae',
              padding: '3px 8px',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>🕊️</span>
            {fruitName(fruit)}
          </span>
        ))}
      </div>

      {/* ── 展开后的详细细节面板 ── */}
      {open && (
        <div style={{ 
          marginTop: '16px',
          borderTop: '1px dashed rgba(255, 255, 255, 0.1)',
          paddingTop: '16px'
        }}>
          {/* 圣经诊断 */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.015)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '12px 14px',
            fontSize: '12.5px',
            color: 'rgba(255, 255, 255, 0.8)',
            lineHeight: '1.65'
          }}>
            <b style={{ color: '#5ac8fa', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <span>📖</span> {T('圣经诊断', 'Biblical Diagnosis')}：
            </b>
            {pattern.biblicalDiagnosis}
          </div>

          {/* 2x2 详细行动与症状网格 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '12px',
            marginTop: '14px'
          }}>
            {/* 常见症状 */}
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.015)', 
              border: '1px solid rgba(255, 255, 255, 0.05)', 
              borderRadius: '12px', 
              padding: '14px' 
            }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 800, color: '#ffb3b0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>🩺</span> {T('常见症状', 'Common Symptoms')}
              </h4>
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: 'rgba(255, 255, 255, 0.65)', lineHeight: '1.6' }}>
                {pattern.commonSymptoms.slice(0, 5).map((item) => <li key={item} style={{ marginBottom: '4px' }}>{item}</li>)}
              </ul>
            </div>

            {/* 深层偶像 */}
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.015)', 
              border: '1px solid rgba(255, 255, 255, 0.05)', 
              borderRadius: '12px', 
              padding: '14px' 
            }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 800, color: '#d3b0ff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>👑</span> {T('深层偶像', 'Deep Idols')}
              </h4>
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: 'rgba(255, 255, 255, 0.65)', lineHeight: '1.6' }}>
                {pattern.deepIdols.slice(0, 5).map((item) => <li key={item} style={{ marginBottom: '4px' }}>{item}</li>)}
              </ul>
            </div>

            {/* 脱去动作 */}
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.015)', 
              border: '1px solid rgba(255, 255, 255, 0.05)', 
              borderRadius: '12px', 
              padding: '14px' 
            }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 800, color: '#ffd699', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>🧥</span> {T('脱去旧人', 'Put Off Actions')}
              </h4>
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: 'rgba(255, 255, 255, 0.65)', lineHeight: '1.6' }}>
                {pattern.putOffActions.slice(0, 5).map((item) => <li key={item} style={{ marginBottom: '4px' }}>{item}</li>)}
              </ul>
            </div>

            {/* 穿上动作 */}
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.015)', 
              border: '1px solid rgba(255, 255, 255, 0.05)', 
              borderRadius: '12px', 
              padding: '14px' 
            }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 800, color: '#aee8ff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>🛡️</span> {T('穿上新人', 'Put On Actions')}
              </h4>
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: 'rgba(255, 255, 255, 0.65)', lineHeight: '1.6' }}>
                {pattern.putOnActions.slice(0, 5).map((item) => <li key={item} style={{ marginBottom: '4px' }}>{item}</li>)}
              </ul>
            </div>
          </div>

          {/* 关联经文阅读（包含经文内容，高档卡片效果） */}
          <div style={{ marginTop: '16px' }}>
            <h5 style={{ margin: '0 0 8px 0', fontSize: '12.5px', color: '#5ac8fa', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>📖</span>
              {T('相关圣经经文', 'Relevant Scriptures')}：
            </h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {pattern.scriptures.map((scripture) => (
                <div 
                  key={scripture.reference} 
                  style={{
                    background: 'rgba(90, 200, 250, 0.03)',
                    border: '1px solid rgba(90, 200, 250, 0.12)',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    fontSize: '12.5px'
                  }}
                >
                  <strong style={{ color: '#5ac8fa', display: 'block', marginBottom: '4px', fontSize: '12px' }}>
                    {scripture.reference}
                  </strong>
                  <span style={{ color: 'rgba(255, 255, 255, 0.75)', fontStyle: 'italic', lineHeight: '1.5', display: 'block' }}>
                    “{scripture.text}”
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 忏悔与归心祷告块（橙色引用框） */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 149, 0, 0.08) 0%, rgba(255, 149, 0, 0.02) 100%)',
            border: '1px solid rgba(255, 149, 0, 0.22)',
            borderLeft: '4px solid #ff9500',
            borderRadius: '8px',
            padding: '14px',
            marginTop: '16px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
          }}>
            <h4 style={{ 
              margin: '0 0 6px 0', 
              fontSize: '13px', 
              fontWeight: 800, 
              color: '#ff9500', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px' 
            }}>
              <span>🙏</span>
              {T('忏悔与归心祷告', 'Prayer of Repentance & Alignment')}
            </h4>
            <blockquote style={{ 
              margin: 0, 
              fontSize: '13px', 
              color: '#ffd699', 
              fontStyle: 'italic', 
              lineHeight: '1.65',
              border: 'none',
              padding: 0
            }}>
              “ {pattern.repentancePrayer} ”
            </blockquote>
          </div>
        </div>
      )}
    </article>
  )
}
