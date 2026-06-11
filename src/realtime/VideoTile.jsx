// VideoTile — LiveKit 视频轨道渲染（1对1 与群通话共用）。
// <video> 恒静音：音频统一经隐藏的 audioBin 播放，避免双声道回声。
import { useEffect, useRef } from 'react'

export default function VideoTile({ track, mirror = false, style = {} }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !track) return
    try { track.attach(el) } catch { /* noop */ }
    return () => { try { track.detach(el) } catch { /* noop */ } }
  }, [track])

  return (
    <video
      ref={ref}
      autoPlay
      playsInline
      muted
      style={{
        width: '100%', height: '100%', objectFit: 'cover',
        borderRadius: 'inherit', background: '#000',
        transform: mirror ? 'scaleX(-1)' : 'none',
        ...style,
      }}
    />
  )
}
