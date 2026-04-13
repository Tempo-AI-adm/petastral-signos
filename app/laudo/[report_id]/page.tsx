export const dynamic = 'force-dynamic'
import { VisaoAstralField } from './VisaoAstralField'
import { ShareCTA } from './ShareCTA'
import { AvatarImg } from './AvatarImg'

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

const ELEMENTO_LABEL: Record<string, string> = {
  fogo: '🔥 Fogo', terra: '🌿 Terra', ar: '💨 Ar', água: '💧 Água'
}

const SIGNO_PT: Record<string, string> = {
  'Aries':'Áries','Taurus':'Touro','Gemini':'Gêmeos','Cancer':'Câncer',
  'Leo':'Leão','Virgo':'Virgem','Libra':'Libra','Scorpio':'Escorpião',
  'Sagittarius':'Sagitário','Capricorn':'Capricórnio','Aquarius':'Aquário','Pisces':'Peixes'
}

const PLANETA_EMOJI: Record<number, string> = {
  1:'☀️', 2:'🌙', 3:'☿', 4:'♀️', 5:'♂️',
  6:'♃', 7:'♄', 8:'⚡', 9:'🔮', 10:'🌿'
}

// ── Avatar ────────────────────────────────────────────────────────────────────

function getSRDAvatar(tipo: string, porte: string, corArr: string[], pelo: string): string {
  if (tipo === 'cat') {
    const longo = pelo === 'longo'

    if (longo) {
      if (corArr.includes('preto') && corArr.includes('marrom') && corArr.includes('branco')) return 'gato-srd-longo-mesclado-escuro'
      if (corArr.includes('preto') && corArr.includes('marrom')) return 'srd-longo-preto-marrom'
      if (corArr.includes('preto'))   return 'gato-srd-longo-preto'
      if (corArr.includes('cinza'))   return 'gato-srd-longo-cinza'
      if (corArr.includes('branco'))  return 'gato-srd-longo-branco'
      if (corArr.includes('laranja') || corArr.includes('caramelo')) return 'persa-laranja'
      return 'gato-srd-longo-mesclado'
    }

    // Tricolor/mesclado escuro pelo curto
    const temPreto    = corArr.includes('preto')
    const temMarrom   = corArr.includes('marrom')
    const temBranco   = corArr.includes('branco')
    const temCaramelo = corArr.includes('caramelo')
    const temCreme    = corArr.includes('creme')
    const temCinza    = corArr.includes('cinza')
    const temLaranja  = corArr.includes('laranja')

    if (temPreto && temBranco && temCinza)      return 'gato-srd-tigrado-cinza'
    if (temPreto && temMarrom && temBranco)    return 'gato-srd-curto-mesclado-escuro'
    if (temPreto && temCaramelo && temBranco)  return 'gato-srd-tigrado-marrom-branco'
    if (temPreto && temCaramelo && temCreme)   return 'gato-srd-tigrado-marrom-branco'
    if (temBranco && temMarrom && temCaramelo) return 'gato-srd-tigrado-marrom-branco'
    if (temBranco && temMarrom && temCreme)    return 'gato-srd-tigrado-marrom-branco'
    if (temPreto && temMarrom)  return 'gato-srd-tartaruga'
    if (temPreto && temCreme)   return 'gato-srd-tartaruga'
    if (temBranco && temCinza)  return 'gato-srd-curto-cinza-branco'
    if (temPreto && temBranco)  return 'gato-srd-preto-branco'
    if (temCreme && temMarrom)  return 'gato-srd-tigrado-marrom'
    if (temMarrom)              return 'gato-srd-tigrado-marrom'
    if (temLaranja)             return 'gato-srd-laranja'
    if (temCaramelo)            return 'gato-srd-caramelo'
    if (temCinza)               return 'gato-srd-cinza'
    if (temPreto)               return 'gato-srd-preto'
    if (temBranco)              return 'gato-srd-branco'
    if (temCreme)               return 'gato-srd-creme'
    return 'gato-srd-tigrado-cinza'
  }

  // Dog SRD
  if (porte === 'medio') {
    if (corArr.includes('branco') && corArr.includes('preto'))    return 'srd-medio-branco-preto'
    if (corArr.includes('branco') && corArr.includes('marrom'))   return 'srd-medio-branco-marrom'
    if (corArr.includes('branco') && corArr.includes('caramelo')) return 'srd-medio-caramelo-branco'
    if (corArr.includes('preto')  && corArr.includes('marrom'))   return 'srd-medio-preto-marrom'
  }

  // Combos específicos pequeno
  if (porte === 'pequeno') {
    if (corArr.includes('branco') && corArr.includes('caramelo') && corArr.includes('marrom')) return 'srd-pequeno-mesclado'
    if (corArr.includes('branco') && corArr.includes('creme')) return 'srd-pequeno-claro'
  }

  // Combos específicos medio
  if (porte === 'medio') {
    if (corArr.includes('caramelo') && corArr.includes('branco')) return 'srd-medio-caramelo-branco'
  }

  // Combos específicos grande
  if (porte === 'grande') {
    if (corArr.includes('branco') && corArr.includes('creme')) return 'srd-grande-claro'
  }

  // Caramelo puro qualquer porte
  if (corArr.length === 1 && corArr.includes('caramelo')) return 'caramelo'

  const dark  = corArr.some(c => ['preto', 'marrom'].includes(c))
  const shade = corArr.length > 1 ? 'mesclado'
    : corArr.includes('creme') ? 'creme'
    : dark ? 'escuro' : 'claro'

  const prefix = porte === 'pequeno'
    ? (pelo === 'longo' ? 'cao-pequeno-longo' : 'cao-pequeno-curto')
    : porte === 'grande' ? 'srd-grande' : 'srd-medio'
  return `${prefix}-${shade}`
}

function getAvatar(tipo: string, porte: string, cor: string | string[], raca: string, pelo = ''): string {
  const corArr = Array.isArray(cor) ? cor : (cor ? [cor] : [])
  const has = (c: string) => corArr.includes(c)

  if (raca === 'Labrador') {
    if (has('preto'))  return 'labrador-preto'
    if (has('marrom')) return 'labrador-chocolate'
    if (has('creme') || has('branco')) return 'labrador-claro'
    return 'labrador-amarelo'
  }
  if (raca === 'Pinscher') {
    if (has('preto') && (has('caramelo') || has('marrom'))) return 'pinscher-preto-fogo'
    if (has('preto') || has('cinza') || has('marrom')) return 'pinscher-preto'
    return 'pinscher-caramelo'
  }
  if (raca === 'Poodle') {
    if (has('preto'))    return 'poodle-preto'
    if (has('marrom'))   return 'poodle-marrom'
    if (has('cinza'))    return 'poodle-cinza'
    if (has('caramelo')) return 'poodle-caramelo'
    return 'poodle-branco'
  }
  if (raca === 'Bulldog Francês') {
    if (has('preto'))  return 'bulldog-frances-preto'
    if (has('cinza'))  return 'bulldog-frances-cinza'
    if (has('branco') && !has('caramelo') && !has('marrom')) return 'bulldog-frances-branco'
    return 'bulldog-frances-caramelo'
  }
  if (raca === 'Chihuahua') {
    if (has('preto'))  return 'chihuahua-preto'
    if (has('branco')) return 'chihuahua-branco'
    if (has('marrom') || has('cinza')) return 'chihuahua-marrom'
    return 'chihuahua-creme'
  }
  if (raca === 'Cocker Spaniel') {
    if (has('preto'))  return 'cocker-preto'
    if (has('marrom')) return 'cocker-marrom'
    return 'cocker-caramelo'
  }
  if (raca === 'Dachshund / Salsicha') {
    if (has('preto'))  return 'dachshund-preto-fogo'
    if (has('marrom')) return 'dachshund-marrom'
    return 'dachshund-caramelo'
  }
  if (raca === 'Galgo') {
    if (has('preto'))  return 'galgo-preto'
    if (has('branco') || has('creme')) return 'galgo-branco'
    if (has('cinza'))  return 'galgo-cinza'
    return 'galgo-caramelo'
  }
  if (raca === 'Husky Siberiano') {
    return (has('caramelo') || has('marrom')) ? 'husky-vermelho-branco' : 'husky-preto-branco'
  }
  if (raca === 'Pug') {
    if (has('preto'))  return 'pug-preto'
    if (has('creme') || has('branco')) return 'pug-creme'
    return 'pug-caramelo'
  }
  if (raca === 'Spitz Alemão / Lulu') {
    if (has('preto'))  return 'spitz-preto'
    if (has('cinza'))  return 'spitz-cinza'
    if (has('branco') || has('creme')) return 'spitz-branco'
    return 'spitz-laranja'
  }
  if (raca === 'Persa') {
    if (has('preto'))  return 'persa-preto'
    if (has('laranja') || has('caramelo') || has('marrom')) return 'persa-laranja'
    if (has('cinza'))  return 'persa-cinza'
    return 'persa-branco'
  }
  if (raca === 'Pitbull') {
    if (has('cinza'))  return 'pitbull-cinza'
    if (has('preto'))  return 'pitbull-preto'
    if (has('marrom')) return 'pitbull-marrom'
    if (has('branco') || has('creme')) return 'pitbull-branco'
    return 'pitbull-caramelo'
  }
  if (raca === 'Sphynx') {
    if (has('preto'))  return 'sphynx-preto'
    if (has('cinza'))  return 'sphynx-cinza'
    if (has('caramelo') || has('marrom')) return 'sphynx-rosa'
    return 'sphynx-branco'
  }
  if (raca === 'Lhasa Apso') {
    if (has('branco') && corArr.length === 1) return 'lhasa-apso-branco'
    return 'lhasa-apso'
  }
  if (raca === 'Jack Russell Terrier') return 'jack-russell'
  if (raca === 'Boxer')        return 'boxer'
  if (raca === 'Bichon Frisé') return 'bichon-frise'
  if (raca === 'Dobermann')    return 'dobermann'

  const racaMap: Record<string, string> = {
    'Golden Retriever': 'golden-retriever',
    'Pastor Alemão':    'pastor-alemao',
    'Rottweiler':       'rottweiler',
    'Dálmata':          'dalmata',
    'Beagle':           'beagle',
    'Border Collie':    'border-collie',
    'Corgi':            'corgi',
    'Shih Tzu':         'shih-tzu',
    'Yorkshire':        'yorkshire',
    'Maltês':           'maltes',
    'Basset Hound':     'bassethound-mesclado',
    'Blue Heeler':      'blueheeler',
    'Siamês':           'siames',
    'Maine Coon':       'maine-coon',
    'Ragdoll':          'ragdoll',
    'Angorá':           'angora-branco',
    'Bengal':           'bengal-tigrado',
  }
  if (racaMap[raca]) return racaMap[raca]
  return getSRDAvatar(tipo, porte, corArr, pelo)
}

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
  let cleaned = reportText.replace(/^\uFEFF/, '').trim()
  const fenceMatch = cleaned.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?```\s*$/)
  if (fenceMatch) cleaned = fenceMatch[1].trim()
  try {
    const parsed = JSON.parse(cleaned)
    if (parsed && Array.isArray(parsed.capitulos) && parsed.capitulos.length > 0) {
      return { tipo: 'json' as const, data: parsed }
    }
  } catch {}
  return { tipo: 'texto' as const, data: cleaned }
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
  const avatarKey = getAvatar(pet.type || 'dog', pet.porte || '', pet.cor || [], pet.breed || '', pet.pelo || '')
  const avatarSrc = `/avatars/${avatarKey}.png`
  const avatarFallback = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(pet.name || 'pet')}&backgroundColor=ffd5dc`
  const cfg = ELEMENTO_COR[elemento] || ELEMENTO_COR.ar
  const signEmoji = SIGNO_EMOJI[pet.signo] || '✨'

  const dataFormatada = created_at
    ? new Date(created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    : ''

  const MESES = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro']
  const { day: _bDay, month: _bMonth, year: _bYear } = pet.birth_data || {}
  const bDay   = _bDay   ? Number(_bDay)   : null
  const bMonth = _bMonth ? Number(_bMonth) : null
  const bYear  = _bYear  ? Number(_bYear)  : null
  const dataNascFormatada = bMonth && bYear
    ? (bDay ? `${bDay} de ${MESES[bMonth-1]} de ${bYear}` : `${MESES[bMonth-1]} de ${bYear}`)
    : null

  const dataNascDDMM = bDay && bMonth && bYear
    ? `${String(bDay).padStart(2,'0')}/${String(bMonth).padStart(2,'0')}/${bYear}`
    : null
  const nascLabel = (pet.sexo === 'femea' || pet.sexo === 'fêmea') ? 'Nascida' : 'Nascido'

  const reportTextRaw = typeof report_text === 'object' && report_text !== null
    ? JSON.stringify(report_text)
    : String(report_text ?? '')
  const laudoRaw = reportTextRaw
  const laudoContent = parseLaudo(laudoRaw)
  const capitulos = extrairCapitulos(laudoRaw)
  const paragraphs: string[] = laudoRaw.split(/\n{2,}/).filter(Boolean)

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

      {/* Tarja branca da logo */}
      <div style={{ background: 'white', width: '100%', padding: '16px 0', textAlign: 'center' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="SignoPet" width={56} height={56} style={{ display: 'inline-block', objectFit: 'contain' }} />
      </div>

      {/* Header colorido — avatar + ficha */}
      <style>{`
        .laudo-header-inner {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 20px;
          max-width: 480px;
          margin: 0 auto;
        }
        .laudo-ficha-pills { display: flex; gap: 6px; flex-wrap: wrap; }
        @media (max-width: 480px) {
          .laudo-header-inner {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .laudo-ficha-pills { justify-content: center; }
        }
      `}</style>
      <div style={{ background: cfg.topBg, padding: '1.5rem' }}>
        <div className="laudo-header-inner">

          {/* Avatar */}
          <div style={{ flexShrink: 0 }}>
            <AvatarImg
              src={avatarSrc}
              fallback={avatarFallback}
              alt={pet.name || 'Pet'}
              width={100}
              height={100}
              style={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: 'white',
                border: '3px solid rgba(255,255,255,0.35)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </div>

          {/* Ficha */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 22, fontWeight: 500, color: 'white', marginBottom: 4 }}>
              {pet.name || 'Seu Pet'}
            </div>
            {(pet.breed || pet.sexo) && (
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginBottom: 2 }}>
                {[pet.breed, pet.sexo].filter(Boolean).join(' · ')}
              </div>
            )}
            {dataNascDDMM && (
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginBottom: 8 }}>
                {nascLabel} em {dataNascDDMM}
              </div>
            )}
            <div className="laudo-ficha-pills">
              {pet.signo && (
                <span style={{
                  background: 'rgba(255,255,255,0.18)', color: 'white',
                  borderRadius: 20, padding: '3px 12px', fontSize: 12,
                }}>
                  {signEmoji} {pet.signo}
                </span>
              )}
              {elemento && (
                <span style={{
                  background: 'rgba(255,255,255,0.12)', color: 'white',
                  borderRadius: 20, padding: '3px 12px', fontSize: 12,
                }}>
                  {ELEMENTO_LABEL[elemento] || elemento}
                </span>
              )}
            </div>
          </div>

        </div>
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
                    <div style={{ fontWeight: 700, fontSize: 13, color: '#1a0a2e' }}>
                      {SIGNO_PT[valor] || valor || '—'}
                    </div>
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
            {laudoContent.data.visao_astral && typeof laudoContent.data.visao_astral === 'object' && (
              <div style={{background:'white', borderRadius:16, padding:20, marginBottom:16, boxShadow:'0 2px 12px rgba(0,0,0,0.06)'}}>
                <div style={{fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', color:cfg.primary, fontWeight:700, marginBottom:16}}>
                  ✦ Visão Astral
                </div>
                {Object.entries(laudoContent.data.visao_astral).map(([k, v]) => (
                  <VisaoAstralField key={k} label={k} value={String(v)} primaryColor={cfg.primary} />
                ))}
              </div>
            )}

            {/* CTA mid-page — após Visão Astral */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                background: 'transparent', color: '#25d366',
                border: '1.5px solid #25d366',
                textDecoration: 'none', fontWeight: 600, fontSize: 14,
                padding: '11px 20px', borderRadius: 10, marginBottom: 16,
              }}
            >
              💬 Compartilhar resultado
            </a>

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
              <div key={c.numero}>
              <div style={{background:'white', borderRadius:16, padding:20, marginBottom:16, boxShadow:'0 2px 12px rgba(0,0,0,0.06)'}}>
                <div style={{fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', color:cfg.primary, fontWeight:700, marginBottom:4}}>
                  {PLANETA_EMOJI[c.numero]} {c.numero}.
                </div>
                <div style={{fontSize:17, fontWeight:700, color:'#1a0a2e', marginBottom:14, lineHeight:1.35}}>
                  {c.titulo}
                </div>
                {c.conteudo.split('\n\n').map((p: string, i: number) => {
                  const txt = p.trim()
                  const isDica = /^(#+\s*)?(\*\*)?Dica Prática/i.test(txt)
                  const dicaTexto = txt
                    .replace(/^#+\s*/, '')
                    .replace(/^\*\*/, '')
                    .replace(/^Dica Prática[:.]\s*/i, '')
                    .replace(/\*\*$/, '')
                    .trim()
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
                        dangerouslySetInnerHTML={{__html: renderTexto(dicaTexto)}}
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
              {c.numero === 3 && <ShareCTA petName={pet.name || 'seu pet'} />}
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
                background: 'transparent', color: '#25d366',
                border: '1.5px solid #25d366',
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
              ✨ Criar laudo de outro pet
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
