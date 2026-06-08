// 和平鸽 Dove —— 圣灵的象征（太3:16），展翅、口衔橄榄枝（创8:11）
// 真实鸽子位图 + CSS 动画光层：柔光晕、光环呼吸、星尘环、celebrating 撒光点
// 状态：idle | listening | comforting | praying | celebrating | resting
import './guardian.css'

const SPARKLES = [0, 60, 120, 180, 240, 300]
const DOVE_SRC = '/guardian/dove.png'

export default function GuardianSprite({ state = 'idle', size = 64 }) {
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      {/* 底层柔光（模糊大光晕，随状态变色/呼吸） */}
      <div className={`guardian-glow guardian-glow--${state}`} />

      {/* 光环 + 旋转星尘环（纯装饰，衬在鸽子后面） */}
      <svg viewBox="0 0 72 72" width={size} height={size}
        style={{ position: 'absolute', inset: 0, overflow: 'visible' }} aria-hidden="true">
        <defs>
          <radialGradient id="gdHalo" cx="50%" cy="48%" r="50%">
            <stop offset="52%" stopColor="#ffe9c4" stopOpacity="0" />
            <stop offset="80%" stopColor="#ffe9c4" stopOpacity="0.20" />
            <stop offset="100%" stopColor="#ffe9c4" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle className="guardian-halo" cx="36" cy="38" r="33" fill="url(#gdHalo)" />
        <circle className="guardian-ring" cx="36" cy="38" r="27"
          fill="none" stroke="#fff3d8" strokeOpacity="0.4"
          strokeWidth="1" strokeDasharray="2 9" strokeLinecap="round" />
      </svg>

      {/* celebrating 时的扩散光点 */}
      {state === 'celebrating' && SPARKLES.map((angle) => (
        <span
          key={angle}
          className="guardian-sparkle"
          style={{
            '--gx': `${Math.cos((angle * Math.PI) / 180) * (size * 0.56)}px`,
            '--gy': `${Math.sin((angle * Math.PI) / 180) * (size * 0.56)}px`,
            animationDelay: `${(angle / 360) * 0.4}s`,
          }}
        />
      ))}

      {/* 和平鸽本体（保留 body 类的轻微浮动/状态动画） */}
      <img
        src={DOVE_SRC}
        alt="守护者和平鸽"
        draggable="false"
        className={`guardian-body guardian-body--${state}`}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          pointerEvents: 'none',
          userSelect: 'none',
          filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.28))',
        }}
      />
    </div>
  )
}
