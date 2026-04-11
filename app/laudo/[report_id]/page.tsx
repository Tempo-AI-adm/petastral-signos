export const dynamic = 'force-dynamic'

const SIGNO_PARA_ELEMENTO: Record<string, string> = {
  'Áries': 'fogo', 'Leão': 'fogo', 'Sagitário': 'fogo',
  'Touro': 'terra', 'Virgem': 'terra', 'Capricórnio': 'terra',
  'Gêmeos': 'ar', 'Libra': 'ar', 'Aquário': 'ar',
  'Câncer': 'água', 'Escorpião': 'água', 'Peixes': 'água',
}

const SIGNO_EMOJI: Record<string, string> = {
  'Áries': '♈', 'Touro': '♉', 'Gêmeos': '♊', 'Câncer': '♋',
  'Leão': '♌', 'Virgem': '♍', 'Libra': '♎', 'Escorpião': '♏',
  'Sagitário': '♐', 'Capricórnio': '♑', 'Aquário': '♒', 'Peixes': '♓',
}

const ELEMENTO_COR: Record<string, { primary: string; secondary: string; topBg: string }> = {
  fogo:  { primary: '#c44800', secondary: '#f5a623', topBg: 'linear-gradient(135deg,#6b1800,#a83300,#c44000)' },
  terra: { primary: '#15803d', secondary: '#4ade80', topBg: 'linear-gradient(135deg,#052e16,#14532d,#166534)' },
  ar:    { primary: '#7c3aed', secondary: '#c084fc', topBg: 'linear-gradient(135deg,#1a0538,#2e1065,#4c1d95)' },
  água:  { primary: '#0369a1', secondary: '#67e8f9', topBg: 'linear-gradient(135deg,#082f49,#0c4a6e,#0369a1)' },
}

async function fetchLaudo(reportId: string) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://petastral-signos.vercel.app'
  try {
    const res = await fetch(`${base}/api/laudo/${reportId}`, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

function ErroPage() {
  return (
    <main style={{
      minHeight: '100vh', background: '#f0ebe0',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ textAlign: 'center', padding: 32 }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🔮</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#4b5563', marginBottom: 8 }}>
          Laudo não encontrado
        </h1>
        <p style={{ color: '#9ca3af', fontSize: 14, maxWidth: 280, margin: '0 auto' }}>
          Este laudo pode ainda estar sendo gerado ou o link é inválido. Tente novamente em alguns instantes.
        </p>
        <a href="/" style={{
          marginTop: 24, display: 'inline-block',
          color: '#7c3aed', fontSize: 14, textDecoration: 'none',
        }}>
          ← Voltar ao início
        </a>
      </div>
    </main>
  )
}

export default async function LaudoPage({ params }: { params: { report_id: string } }) {
  const laudo = await fetchLaudo(params.report_id)

  if (!laudo) return <ErroPage />

  const { pet, report_text, created_at } = laudo
  const elemento = pet.elemento || SIGNO_PARA_ELEMENTO[pet.signo] || 'ar'
  const cores = ELEMENTO_COR[elemento] || ELEMENTO_COR.ar
  const signEmoji = SIGNO_EMOJI[pet.signo] || '✨'

  const paragraphs: string[] = (report_text || '').split(/\n{2,}/).filter(Boolean)

  const laudoUrl = `https://petastral-signos.vercel.app/laudo/${params.report_id}`
  const whatsappText = encodeURIComponent(
    `Olha o laudo astral de ${pet.name || 'meu pet'}! 🐾\n${laudoUrl}`
  )
  const whatsappUrl = `https://wa.me/?text=${whatsappText}`

  const dataFormatada = created_at
    ? new Date(created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    : ''

  return (
    <main style={{ minHeight: '100vh', background: '#f0ebe0', paddingBottom: 56 }}>

      {/* ── Header ── */}
      <div style={{ background: cores.topBg, padding: '44px 24px 36px', textAlign: 'center' }}>
        <p style={{
          color: 'rgba(255,255,255,0.55)', fontSize: 12, margin: '0 0 10px',
          letterSpacing: 3, textTransform: 'uppercase',
        }}>
          SignoPet ✨
        </p>
        <h1 style={{ color: '#fff', fontSize: 30, fontWeight: 800, margin: '0 0 14px', lineHeight: 1.2 }}>
          {pet.name || 'Seu Pet'}
        </h1>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          {pet.breed && (
            <span style={{
              background: 'rgba(255,255,255,0.15)', color: '#fff',
              borderRadius: 20, padding: '5px 14px', fontSize: 13,
            }}>
              {pet.breed}
            </span>
          )}
          {pet.signo && (
            <span style={{
              background: 'rgba(255,255,255,0.22)', color: '#fff',
              borderRadius: 20, padding: '5px 14px', fontSize: 13, fontWeight: 600,
            }}>
              {signEmoji} {pet.signo}
            </span>
          )}
        </div>
        {dataFormatada && (
          <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 12, marginTop: 14 }}>
            Laudo emitido em {dataFormatada}
          </p>
        )}
      </div>

      {/* ── Corpo ── */}
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '36px 20px 0' }}>

        {paragraphs.map((para, i) => {
          const isHeader = /^#{1,3}\s/.test(para) ||
            (para.length < 80 && para.trim() === para.trim().toUpperCase() && para.trim().length > 4)
          const clean = para.replace(/^#{1,3}\s*/, '').trim()

          if (isHeader) {
            return (
              <div key={i} style={{ margin: '36px 0 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1, height: 1, background: cores.primary, opacity: 0.18 }} />
                <h2 style={{
                  color: cores.primary, fontSize: 11, fontWeight: 700,
                  letterSpacing: 2.5, textTransform: 'uppercase', margin: 0, whiteSpace: 'nowrap',
                }}>
                  {clean}
                </h2>
                <div style={{ flex: 1, height: 1, background: cores.primary, opacity: 0.18 }} />
              </div>
            )
          }

          return (
            <p key={i} style={{ color: '#374151', fontSize: 16, lineHeight: 1.85, marginBottom: 22 }}>
              {clean}
            </p>
          )
        })}

        {/* ── WhatsApp CTA ── */}
        <div style={{
          marginTop: 48, padding: '28px 24px', background: '#fff',
          borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', textAlign: 'center',
        }}>
          <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 18, lineHeight: 1.6 }}>
            Compartilhe o laudo de <strong>{pet.name || 'seu pet'}</strong> com quem você ama 🐾
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#25d366', color: '#fff',
              textDecoration: 'none', fontWeight: 600, fontSize: 15,
              padding: '13px 30px', borderRadius: 10,
            }}
          >
            💬 Compartilhar no WhatsApp
          </a>
        </div>

        <p style={{ textAlign: 'center', color: '#c4b9a8', fontSize: 12, marginTop: 36 }}>
          SignoPet · Mapa astral do seu pet 🐾
        </p>
      </div>
    </main>
  )
}
