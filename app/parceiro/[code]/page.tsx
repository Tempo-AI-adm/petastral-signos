'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function AffiliatePage() {
  const params = useParams()
  const code = (params?.code as string)?.toUpperCase()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!code) return
    fetch(`/api/affiliate/${code}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [code])

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#EEF2FB', fontFamily: 'sans-serif' }}>
      <p style={{ color: '#6B5B8A' }}>Carregando...</p>
    </div>
  )

  if (!data || data.error) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#EEF2FB', fontFamily: 'sans-serif' }}>
      <p style={{ color: '#6B5B8A' }}>Parceiro não encontrado.</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#EEF2FB', fontFamily: 'sans-serif', padding: '40px 24px' }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🐾</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1A1035', marginBottom: 4 }}>Olá, {data.name}!</h1>
          <p style={{ color: '#6B5B8A', fontSize: 14 }}>Seu código: <strong style={{ color: '#7B4F9E' }}>{data.code}</strong></p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          {[
            { label: 'Pets criados', value: data.pets_created, emoji: '🐾' },
            { label: 'Laudos vendidos', value: data.laudos_sold, emoji: '📖' },
            { label: 'Valor gerado', value: `R$${data.revenue_generated}`, emoji: '💰' },
            { label: `Sua comissão (${data.commission_pct}%)`, value: `R$${data.commission_owed}`, emoji: '✅' },
          ].map(item => (
            <div key={item.label} style={{ background: '#fff', borderRadius: 16, padding: '20px 16px', textAlign: 'center', border: '1px solid rgba(123,79,158,0.12)', boxShadow: '0 2px 12px rgba(123,79,158,0.06)' }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{item.emoji}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#1A1035', marginBottom: 4 }}>{item.value}</div>
              <div style={{ fontSize: 12, color: '#6B5B8A' }}>{item.label}</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#fff', borderRadius: 16, padding: '20px', border: '1px solid rgba(123,79,158,0.12)', textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: '#6B5B8A', marginBottom: 8 }}>Seu link de parceiro</p>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#7B4F9E' }}>signopet.com.br?ref={data.code}</p>
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#9B8AB4', marginTop: 20 }}>
          Pagamentos processados manualmente pela SignoPet.
        </p>
      </div>
    </div>
  )
}
