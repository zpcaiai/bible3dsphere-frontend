import { useEffect, useRef } from 'react'

export default function PilgrimsGame() {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Cleanly unload the iframe when the component unmounts to free the engine and audio.
  useEffect(() => {
    return () => {
      if (iframeRef.current) {
        iframeRef.current.src = 'about:blank'
      }
    }
  }, [])

  return (
    <iframe
      ref={iframeRef}
      src="/godot/embed.html"
      title="天路历程"
      style={{
        width: '100%',
        height: '100%',
        border: 'none',
        background: '#000',
      }}
      allow="fullscreen"
      sandbox="allow-scripts allow-same-origin allow-popups allow-pointer-lock"
    />
  )
}
