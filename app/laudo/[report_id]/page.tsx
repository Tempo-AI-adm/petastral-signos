export const dynamic = 'force-dynamic'

// ── Mapeamentos ──────────────────────────────────────────────────────────────

const SIGNO_PARA_ELEMENTO: Record<string, string> = {
  'Áries': 'fogo',    'Leão': 'fogo',    'Sagitário': 'fogo',
  'Touro': 'terra',   'Virgem': 'terra', 'Capricórnio': 'terra',
  'Gêmeos': 'ar',     'Libra': 'ar',     'Aquário': 'ar',
  'Câncer': 'água',   'Escorpião': 'água', 'Peixes': 'água',
}

const SIGNO_EMOJI: Record<string, string> = {
  'Áries': '♈', 'Touro': '♉', 'Gêmeos': '♊', 'Câncer': '♋',
  'Leão': '♌',  'Virgem': '♍', 'Libra': '♎',  'Escorpião': '♏',
  'Sagitário': '♐', 'Capricórnio': '♑', 'Aquário': '♒', 'Peixes': '♓',
}

const ELEMENTO_COR: Record<string, { primary: string; secondary: string; topBg: string }> = {
  fogo:  { primary: '#c44800', secondary: '#f5a623', topBg: 'linear-gradient(135deg,#6b1800,#a83300,#c44000)' },
  terra: { primary: '#15803d', secondary: '#4ade80', topBg: 'linear-gradient(135deg,#052e16,#14532d,#166534)' },
  ar:    { primary: '#7c3aed', secondary: '#c084fc', topBg: 'linear-gradient(135deg,#1a0538,#2e1065,#4c1d95)' },
  água:  { primary: '#0369a1', secondary: '#67e8f9', topBg: 'linear-gradient(135deg,#082f49,#0c4a6e,#0369a1)' },
}

const PLANETAS_MAP: [string, string][] = [
  ['sun','Sol'],['moon','Lua'],['mercury','Mercúrio'],
  ['venus','Vênus'],['mars','Marte'],['jupiter','Júpiter'],
  ['saturn','Saturno'],['uranus','Urano'],['neptune','Netuno'],['pluto','Plutão']
]

// ── Helpers ──────────────────────────────────────────────────────────────────

function renderTexto(t: string): string {
  return t
    .replace(/^### (.+)$/gm, '<strong style="display:block;margin:12px 0 4px;font-size:14px;">$1</strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^---$/gm, '')
}

function extrairCapitulos(reportText: string): string[] {
  return reportText
    .split('\n\n')
    .map(p => p.trim())
    .filter(p => p.length < 60 && p === p.toUpperCase() && p.includes(':'))
    .map(p => p.replace(/\*\*/g, '').replace(/^\d+\.\s*/, ''))
}

function parseLaudo(reportText: string) {
  if (!reportText) return { tipo: 'texto' as const, data: '' }
  const trimmed = reportText.trim()
  try {
    const parsed = JSON.parse(trimmed)
    if (parsed?.schema_version === 'v1' && Array.isArray(parsed?.capitulos)) {
      return { tipo: 'json' as const, data: parsed }
    }
  } catch {}
  return { tipo: 'texto' as const, data: trimmed }
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

// ── Página de erro ────────────────────────────────────────────────────────────

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
        <p style={{ color: '#9ca3af', fontSize: 14, maxWidth: 280, margin: '0 auto', lineHeight: 1.6 }}>
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

// ── Página principal ──────────────────────────────────────────────────────────

export default async function LaudoPage({ params }: { params: { report_id: string } }) {
  const laudo = await fetchLaudo(params.report_id)
  if (!laudo) return <ErroPage />

  const { pet, report_text, signs, created_at } = laudo
  const elemento = pet.elemento || SIGNO_PARA_ELEMENTO[pet.signo] || 'ar'
  const cfg = ELEMENTO_COR[elemento] || ELEMENTO_COR.ar
  const signEmoji = SIGNO_EMOJI[pet.signo] || '✨'

  const dataFormatada = created_at
    ? new Date(created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    : ''

  const laudoContent = parseLaudo(report_text || '')
  const capitulos = extrairCapitulos(report_text || '')
  const paragraphs: string[] = (report_text || '').split(/\n{2,}/).filter(Boolean)

  const laudoUrl = `https://petastral-signos.vercel.app/laudo/${params.report_id}`
  const whatsappText = encodeURIComponent(`Olha o laudo astral de ${pet.name || 'meu pet'}! 🐾\n${laudoUrl}`)
  const whatsappUrl = `https://wa.me/?text=${whatsappText}`

  // Estilo compartilhado para cards brancos
  const card: React.CSSProperties = {
    background: '#fff',
    borderRadius: 16,
    padding: '20px',
    marginBottom: 16,
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f0ebe0', paddingBottom: 56 }}>

      {/* ══════════════════════════════════════
          HEADER
      ══════════════════════════════════════ */}
      <div style={{ background: cfg.topBg, padding: '44px 24px 36px', textAlign: 'center' }}>
        {/* Logo */}
        <div style={{ display: 'inline-block', background: 'white', borderRadius: 999, padding: 8, margin: '0 auto 16px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="SignoPet"
            width={56}
            height={56}
            style={{ display: 'block', objectFit: 'contain' }}
          />
        </div>

        {/* Nome */}
        <h1 style={{ color: '#fff', fontSize: 36, fontWeight: 700, margin: '0 0 14px', lineHeight: 1.15 }}>
          {pet.name || 'Seu Pet'}
        </h1>

        {/* Badges */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 14 }}>
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

        {/* Data */}
        {dataFormatada && (
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: 0 }}>
            Laudo emitido em {dataFormatada}
          </p>
        )}
      </div>

      {/* ══════════════════════════════════════
          CONTEÚDO
      ══════════════════════════════════════ */}
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '24px 16px 0' }}>

        {/* ── ÍNDICE (texto bruto) ── */}
        {laudoContent.tipo === 'texto' && capitulos.length > 0 && (
          <div style={card}>
            <h2 style={{
              color: cfg.primary, fontSize: 11, fontWeight: 700,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              margin: '0 0 14px',
            }}>
              Índice
            </h2>
            <ol style={{ margin: 0, padding: '0 0 0 20px', listStyle: 'decimal' }}>
              {capitulos.map((cap, i) => (
                <li key={i} style={{
                  color: '#374151', fontSize: 14, lineHeight: 1.7,
                  paddingLeft: 4, marginBottom: 4,
                }}>
                  {cap}
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* ── DIAGRAMA DE SIGNOS ── */}
        {signs && Object.keys(signs).length > 0 && (
          <div style={card}>
            <h2 style={{
              color: cfg.primary, fontSize: 11, fontWeight: 700,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              margin: '0 0 16px', textAlign: 'center',
            }}>
              ✦ Laudo SignoPet
            </h2>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10,
            }}>
              {PLANETAS_MAP.map(([key, label]) => {
                const valor = signs[key]
                if (!valor) return null
                return (
                  <div key={key} style={{
                    background: '#f9f7f4', borderRadius: 10,
                    padding: '10px 8px', textAlign: 'center',
                  }}>
                    <p style={{
                      color: cfg.primary, fontSize: 10, fontWeight: 600,
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      margin: '0 0 4px',
                    }}>
                      {label}
                    </p>
                    <p style={{ color: '#1f2937', fontSize: 13, fontWeight: 700, margin: 0 }}>
                      {SIGNO_EMOJI[valor] || ''} {valor}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── CORPO DO LAUDO ── */}
        {laudoContent.tipo === 'json' ? (
          <>
            {/* Visão Astral */}
            <div style={{background:'white', borderRadius:16, padding:20, marginBottom:16, boxShadow:'0 2px 12px rgba(0,0,0,0.06)'}}>
              <div style={{fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', color:cfg.primary, fontWeight:700, marginBottom:16}}>
                ✦ Visão Astral
              </div>
              {Object.entries(laudoContent.data.visao_astral).map(([k, v]) => (
                <div key={k} style={{marginBottom:10}}>
                  <span style={{fontSize:12, fontWeight:700, color:cfg.primary, textTransform:'capitalize'}}>{k}: </span>
                  <span style={{fontSize:15, color:'#2a1a0e', lineHeight:1.75}}>{v as string}</span>
                </div>
              ))}
            </div>

            {/* Índice */}
            <div style={{background:'white', borderRadius:16, padding:20, marginBottom:16, boxShadow:'0 2px 12px rgba(0,0,0,0.06)'}}>
              <div style={{fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', color:cfg.primary, fontWeight:700, marginBottom:12}}>
                Índice
              </div>
              {laudoContent.data.capitulos.map((c: {numero: number; titulo: string; conteudo: string}) => (
                <div key={c.numero} style={{fontSize:14, color:'#374151', marginBottom:8, display:'flex', gap:10}}>
                  <span style={{color:cfg.secondary, fontWeight:700, minWidth:20}}>{c.numero}.</span>
                  <span>{c.titulo}</span>
                </div>
              ))}
            </div>

            {/* Capítulos */}
            {laudoContent.data.capitulos.map((c: {numero: number; titulo: string; conteudo: string}) => (
              <div key={c.numero} style={{background:'white', borderRadius:16, padding:20, marginBottom:16, boxShadow:'0 2px 12px rgba(0,0,0,0.06)'}}>
                <div style={{fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', color:cfg.primary, fontWeight:700, marginBottom:4}}>
                  {c.numero}.
                </div>
                <div style={{fontSize:17, fontWeight:700, color:'#1a0a2e', marginBottom:14, lineHeight:1.35}}>
                  {c.titulo}
                </div>
                {c.conteudo.split('\n\n').map((p: string, i: number) => {
                  const txt = p.trim()
                  const isDica = txt.startsWith('Dica Prática') || txt.includes('### Dica Prática')
                  if (isDica) return (
                    <div key={i} style={{
                      background: `${cfg.secondary}20`,
                      border: `1px solid ${cfg.secondary}40`,
                      borderRadius: 10,
                      padding: '10px 14px',
                      marginBottom: 12,
                    }}>
                      <div style={{fontSize:11, fontWeight:700, color:cfg.primary, marginBottom:4, textTransform:'uppercase', letterSpacing:'0.1em'}}>
                        Dica Prática
                      </div>
                      <p style={{fontSize:14, color:'#2a1a0e', lineHeight:1.7, margin:0}}
                        dangerouslySetInnerHTML={{__html: renderTexto(txt.replace(/^###?\s*Dica Prática\s*/,''))}}
                      />
                    </div>
                  )
                  return (
                    <p key={i} style={{fontSize:15, color:'#2a1a0e', lineHeight:1.75, marginBottom:12}}
                      dangerouslySetInnerHTML={{__html: renderTexto(txt)}}
                    />
                  )
                })}
              </div>
            ))}
          </>
        ) : (
          // Fallback: texto bruto — renderização original
          <div style={card}>
            {paragraphs.map((para, i) => {
              const trimmed = para.trim()

              // Linha ALL CAPS com ":" → h2 seção
              const isH2 = trimmed.length < 60
                && trimmed === trimmed.toUpperCase()
                && trimmed.includes(':')

              // Linha numérica (ex: "1. Título") → h3
              const isH3 = /^\d+\.\s/.test(trimmed) && trimmed.length < 80

              // Remover placeholders de markdown pesado
              const isBloqueio = /^\*\*\d+\.\s/.test(trimmed)

              if (isBloqueio) {
                const titulo = trimmed.replace(/\*\*/g, '').replace(/^\d+\.\s*/, '').trim()
                return (
                  <h3 key={i} style={{
                    color: cfg.primary, fontSize: 14, fontWeight: 700,
                    margin: '28px 0 10px', letterSpacing: '0.05em',
                  }}>
                    ✦ {titulo}
                  </h3>
                )
              }

              if (isH2) {
                const clean = trimmed.replace(/\*\*/g, '').replace(/^\d+\.\s*/, '')
                return (
                  <div key={i} style={{ margin: '32px 0 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ flex: 1, height: 1, background: cfg.primary, opacity: 0.15 }} />
                    <h2 style={{
                      color: cfg.primary, fontSize: 11, fontWeight: 700,
                      letterSpacing: '0.2em', textTransform: 'uppercase',
                      margin: 0, whiteSpace: 'nowrap',
                    }}>
                      {clean}
                    </h2>
                    <div style={{ flex: 1, height: 1, background: cfg.primary, opacity: 0.15 }} />
                  </div>
                )
              }

              if (isH3) {
                const clean = trimmed.replace(/^\d+\.\s*/, '').replace(/\*\*/g, '').trim()
                return (
                  <h3 key={i} style={{
                    color: cfg.primary, fontSize: 14, fontWeight: 700,
                    margin: '28px 0 10px', letterSpacing: '0.03em',
                  }}>
                    {clean}
                  </h3>
                )
              }

              return (
                <p
                  key={i}
                  style={{ color: '#2a1a0e', fontSize: 15, lineHeight: 1.75, marginBottom: 18 }}
                  dangerouslySetInnerHTML={{ __html: renderTexto(trimmed) }}
                />
              )
            })}
          </div>
        )}

        {/* ── RODAPÉ CTA ── */}
        <div style={{ ...card, textAlign: 'center', marginTop: 8 }}>
          <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 18, lineHeight: 1.6 }}>
            Gostou? Compartilhe o resultado de <strong>{pet.name || 'seu pet'}</strong> 🐾
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#25d366', color: '#fff',
                textDecoration: 'none', fontWeight: 600, fontSize: 15,
                padding: '13px 30px', borderRadius: 10, width: '100%',
                justifyContent: 'center', boxSizing: 'border-box',
              }}
            >
              💬 Compartilhar no WhatsApp
            </a>
            <a
              href="/cadastro"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: cfg.topBg, color: '#fff',
                textDecoration: 'none', fontWeight: 600, fontSize: 14,
                padding: '12px 30px', borderRadius: 10, width: '100%',
                justifyContent: 'center', boxSizing: 'border-box',
              }}
            >
              ✨ Criar laudo do meu pet
            </a>
          </div>
        </div>

        <p style={{ textAlign: 'center', color: '#c4b9a8', fontSize: 12, marginTop: 24 }}>
          Laudo SignoPet · O laudo astral do seu pet 🐾
        </p>
      </div>
    </main>
  )
}
