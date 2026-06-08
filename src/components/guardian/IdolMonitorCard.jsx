import { C, S } from './guardianStyles'
import { t } from '../../i18n/runtime'

const IDOL_LABELS = {
  achievement: t("成就"), money: t("金钱"), relationship: t("关系"), control: t("控制"),
  comfort: t("舒适"), approval: t("认可"), 'self-image': t("自我形象"),
}

// 偶像信号卡片：温和觉察，绝不审判
export default function IdolMonitorCard({ signal }) {
  return (
    <div style={{ ...S.card, border: '1px solid rgba(255,200,90,0.3)',
      background: 'rgba(255,200,90,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 13.5, fontWeight: 600, color: C.text }}>
          {t("🕯️ 温柔的觉察：")}{IDOL_LABELS[signal.idolType] || signal.idolType}
        </span>
        <span style={S.dimText}>{'·'.repeat(Math.min(5, signal.intensity || 3))}</span>
      </div>
      <p style={{ ...S.dimText, lineHeight: 1.6, margin: 0 }}>{signal.signal}</p>
      {signal.suggestion && (
        <p style={{ fontSize: 11.5, lineHeight: 1.6, color: C.text, margin: '6px 0 0',
          background: 'rgba(11,16,38,0.5)', borderRadius: 8, padding: '6px 8px' }}>
          {signal.suggestion}
        </p>
      )}
      <p style={{ fontSize: 11, lineHeight: 1.6, color: 'rgba(154,163,199,0.8)', margin: '6px 0 0' }}>
        {t("好东西本身不是问题——只是想陪你看看，它在心里的位置。")}
      </p>
    </div>
  )
}
