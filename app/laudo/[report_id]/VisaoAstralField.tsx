'use client'
import { useState } from 'react'

const LIMIT = 150

export function VisaoAstralField({
  label,
  value,
  primaryColor,
}: {
  label: string
  value: string
  primaryColor: string
}) {
  const [expanded, setExpanded] = useState(false)
  const needsTrunc = value.length > LIMIT
  const displayed = expanded || !needsTrunc ? value : value.slice(0, LIMIT).trimEnd() + '…'

  return (
    <div style={{ marginBottom: 10 }}>
      <span style={{ fontSize: 12, fontWeight: 700, color: primaryColor, textTransform: 'capitalize' }}>
        {label}:{' '}
      </span>
      <span style={{ fontSize: 15, color: '#2a1a0e', lineHeight: 1.75 }}>
        {displayed}
      </span>
      {needsTrunc && (
        <button
          onClick={() => setExpanded(e => !e)}
          style={{
            marginLeft: 6, background: 'none', border: 'none',
            color: primaryColor, fontSize: 13, fontWeight: 600,
            cursor: 'pointer', padding: 0, textDecoration: 'underline',
          }}
        >
          {expanded ? 'ver menos' : 'ler mais'}
        </button>
      )}
    </div>
  )
}
