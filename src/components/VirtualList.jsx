// VirtualList — 长列表虚拟滚动（零依赖，双重策略）：
//   1) 渐进窗口化：先渲染 batch 条，滚近底部哨兵（IntersectionObserver，提前 600px）再补一批，
//      避免一次性挂载几百个重 DOM 卡片导致首帧卡顿；
//   2) content-visibility:auto：离开视口的已挂载项跳过排版/绘制（浏览器原生虚拟化），
//      containIntrinsicSize 占位防滚动条跳动。天然支持不定高卡片，不需要测量。
// 用法：<VirtualList items={arr} keyOf={(x)=>x.id} estimatedHeight={200} renderItem={(x,i)=>(...)} />
import { useEffect, useRef, useState } from 'react'

export default function VirtualList({ items, renderItem, keyOf, batch = 30, estimatedHeight = 160 }) {
  const [count, setCount] = useState(batch)
  const sentinelRef = useRef(null)

  // 数据源变化（新搜索/刷新）重置窗口
  useEffect(() => { setCount(batch) }, [items, batch])

  useEffect(() => {
    const el = sentinelRef.current
    if (!el || !items || count >= items.length) return
    if (typeof IntersectionObserver === 'undefined') { setCount(items.length); return }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        setCount((c) => Math.min(c + batch, items.length))
      }
    }, { rootMargin: '600px' })
    io.observe(el)
    return () => io.disconnect()
  }, [count, items, batch])

  if (!items || items.length === 0) return null
  const visible = items.slice(0, count)
  return (
    <>
      {visible.map((item, i) => (
        <div
          key={keyOf ? keyOf(item, i) : i}
          style={{ contentVisibility: 'auto', containIntrinsicSize: `auto ${estimatedHeight}px` }}
        >
          {renderItem(item, i)}
        </div>
      ))}
      {count < items.length && (
        <div ref={sentinelRef} style={{ height: 1 }} aria-hidden="true" />
      )}
    </>
  )
}
