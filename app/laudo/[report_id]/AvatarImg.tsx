'use client'
import { useState } from 'react'

export function AvatarImg({
  src,
  fallback,
  alt,
  width = 140,
  height = 140,
  style,
}: {
  src: string
  fallback: string
  alt: string
  width?: number
  height?: number
  style?: React.CSSProperties
  borderColor?: string
}) {
  const [imgSrc, setImgSrc] = useState(src)

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      style={style}
      onError={() => setImgSrc(fallback)}
    />
  )
}
