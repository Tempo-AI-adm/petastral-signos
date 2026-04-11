'use client'
import { useState } from 'react'

export function AvatarImg({
  src,
  fallback,
  alt,
  borderColor,
}: {
  src: string
  fallback: string
  alt: string
  borderColor: string
}) {
  const [imgSrc, setImgSrc] = useState(src)

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imgSrc}
      alt={alt}
      width={100}
      height={100}
      style={{ borderRadius: '50%', border: `3px solid ${borderColor}`, objectFit: 'cover' }}
      onError={() => setImgSrc(fallback)}
    />
  )
}
