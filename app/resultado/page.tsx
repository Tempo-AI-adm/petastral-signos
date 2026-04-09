'use client'
import { useEffect, useState, Suspense, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import * as htmlToImage from 'html-to-image'

const ELEMENTO_CONFIG: Record<string, any> = {
  fogo: {
    borda: 'linear-gradient(135deg,#f5a623,#e8560a,#f5a623,#ff8800,#f5a623)',
    compatBg: 'linear-gradient(135deg,#7a1a00,#c44000)',
    compatBar: 'linear-gradient(90deg,#ff6600,#ffd580)',
    texto: '#c44800', textoSub: '#ffd580',
    badge: 'rgba(255,120,0,0.08)', badgeBorder: 'rgba(255,120,0,0.2)', badgeText: '#c44800',
    emoji: '🔥', label: 'FOGO',
    flames: true, waves: false, stars: false, crystals: false,
    cardBg: '#ffffff',
    oc: '#c44800', oc2: '#f5a623',
    topBand: 'linear-gradient(135deg,#6b1800,#a83300,#c44000)',
    signBg: 'rgba(244,120,0,0.05)',
    signBorder: 'rgba(244,120,0,0.18)',
  },
  terra: {
    borda: 'linear-gradient(135deg,#86efac,#4ade80,#86efac,#22c55e,#86efac)',
    compatBg: 'linear-gradient(135deg,#14532d,#166534)',
    compatBar: 'linear-gradient(90deg,#16a34a,#d4f0a0)',
    texto: '#15803d', textoSub: '#d4f0a0',
    badge: 'rgba(34,197,94,0.08)', badgeBorder: 'rgba(34,197,94,0.2)', badgeText: '#15803d',
    emoji: '🌿', label: 'TERRA',
    flames: false, waves: false, stars: false, crystals: true,
    cardBg: '#ffffff',
    oc: '#15803d', oc2: '#4ade80',
    topBand: 'linear-gradient(135deg,#052e16,#14532d,#166534)',
    signBg: 'rgba(34,197,94,0.05)',
    signBorder: 'rgba(34,197,94,0.18)',
  },
  ar: {
    borda: 'linear-gradient(135deg,#c084fc,#e879a0,#a855f7,#ec4899,#c084fc)',
    compatBg: 'linear-gradient(135deg,#2e1065,#4c1d95)',
    compatBar: 'linear-gradient(90deg,#a855f7,#e9d5ff)',
    texto: '#7c3aed', textoSub: '#e9d5ff',
    badge: 'rgba(168,85,247,0.08)', badgeBorder: 'rgba(168,85,247,0.2)', badgeText: '#7c3aed',
    emoji: '💨', label: 'AR',
    flames: false, waves: false, stars: true, crystals: false,
    cardBg: '#ffffff',
    oc: '#7c3aed', oc2: '#c084fc',
    topBand: 'linear-gradient(135deg,#1a0538,#2e1065,#4c1d95)',
    signBg: 'rgba(168,85,247,0.05)',
    signBorder: 'rgba(168,85,247,0.18)',
  },
  água: {
    borda: 'linear-gradient(135deg,#67e8f9,#22d3ee,#67e8f9,#06b6d4,#67e8f9)',
    compatBg: 'linear-gradient(135deg,#0c4a6e,#0369a1)',
    compatBar: 'linear-gradient(90deg,#0284c7,#a5f3fc)',
    texto: '#0369a1', textoSub: '#a5f3fc',
    badge: 'rgba(6,182,212,0.08)', badgeBorder: 'rgba(6,182,212,0.2)', badgeText: '#0369a1',
    emoji: '💧', label: 'ÁGUA',
    flames: false, waves: true, stars: false, crystals: false,
    cardBg: '#ffffff',
    oc: '#0369a1', oc2: '#67e8f9',
    topBand: 'linear-gradient(135deg,#082f49,#0c4a6e,#0369a1)',
    signBg: 'rgba(6,182,212,0.05)',
    signBorder: 'rgba(6,182,212,0.18)',
  },
}

const AVATAR_MAP: Record<string, Record<string, Record<string, string>>> = {
  dog: {
    pequeno: { claro: 'cao-pequeno-curto-claro', escuro: 'cao-pequeno-curto-escuro', mesclado: 'cao-pequeno-curto-mesclado' },
    medio:   { claro: 'srd-medio-claro', escuro: 'srd-medio-escuro', mesclado: 'srd-medio-mesclado' },
    grande:  { claro: 'golden-retriever', escuro: 'labrador-preto', mesclado: 'border-collie' },
  },
  cat: {
    pequeno: { claro: 'gato-srd-branco', escuro: 'gato-srd-preto', mesclado: 'gato-srd-tigrado' },
    medio:   { claro: 'gato-srd-branco', escuro: 'gato-srd-preto', mesclado: 'gato-srd-tigrado' },
    grande:  { claro: 'gato-srd-longo-branco', escuro: 'gato-srd-preto', mesclado: 'gato-srd-tigrado' },
  },
}

function getAvatar(tipo: string, porte: string, pelagem: string, raca: string) {
  const racaMap: Record<string, string> = {
    'Golden Retriever': 'golden-retriever', 'Labrador': 'labrador-amarelo',
    'Pastor Alemão': 'pastor-alemao', 'Husky Siberiano': 'husky-preto-branco',
    'Rottweiler': 'rottweiler', 'Dálmata': 'dalmata', 'Beagle': 'beagle',
    'Border Collie': 'border-collie', 'Bulldog Francês': 'bulldog-frances-caramelo',
    'Pug': 'pug-caramelo', 'Corgi': 'corgi', 'Pinscher': 'pinscher-caramelo',
    'Poodle': 'poodle-branco', 'Shih Tzu': 'shih-tzu', 'Yorkshire': 'yorkshire',
    'Chihuahua': 'chihuahua-creme', 'Dachshund / Salsicha': 'dachshund-caramelo',
    'Maltês': 'maltes', 'Spitz Alemão / Lulu': 'spitz-laranja',
    'Cocker Spaniel': 'cocker-caramelo', 'Galgo': 'galgo-cinza',
    'Siamês': 'siames', 'Persa': 'persa-branco', 'Maine Coon': 'maine-coon', 'Ragdoll': 'ragdoll',
  }
  if (racaMap[raca]) return racaMap[raca]
  return AVATAR_MAP[tipo]?.[porte]?.[pelagem] || 'srd-medio-claro'
}

// Converte URL de imagem para base64 para evitar CORS no html-to-image
async function toBase64(url: string): Promise<string> {
  try {
    const res = await fetch(url)
    if (!res.ok) {
      console.warn(`[toBase64] HTTP ${res.status} for: ${url}`)
      return ''
    }
    const blob = await res.blob()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (err) {
    console.error(`[toBase64] fetch failed for: ${url}`, err)
    return ''
  }
}


function OrnamentalDivider({ cfg, elemento }: { cfg: any; elemento: string }) {
  const c = cfg.oc
  const c2 = cfg.oc2

  if (elemento === 'fogo') return (
    <svg viewBox="0 0 240 18" height={18} style={{width:'100%',display:'block'}}>
      <line x1="16" y1="9" x2="84" y2="9" stroke={c2} strokeWidth="1" opacity="0.45"/>
      <path d="M92,9 L98,3 L104,9 L98,15Z" fill={c} opacity="0.75"/>
      <path d="M104,9 L110,4 L116,9 L110,14Z" fill={c2} opacity="0.5"/>
      <path d="M116,9 L122,3 L128,9 L122,15Z" fill={c} opacity="0.75"/>
      <line x1="136" y1="9" x2="224" y2="9" stroke={c2} strokeWidth="1" opacity="0.45"/>
      <circle cx="16" cy="9" r="3" fill={c} opacity="0.6"/>
      <circle cx="224" cy="9" r="3" fill={c} opacity="0.6"/>
    </svg>
  )

  if (elemento === 'terra') return (
    <svg viewBox="0 0 240 18" height={18} style={{width:'100%',display:'block'}}>
      <path d="M16,9 C40,4 64,14 84,9" stroke={c2} strokeWidth="1.2" fill="none" opacity="0.5"/>
      <circle cx="120" cy="9" r="6" fill="none" stroke={c} strokeWidth="1.5" opacity="0.7"/>
      <circle cx="120" cy="9" r="2.5" fill={c} opacity="0.85"/>
      <path d="M156,9 C176,4 200,14 224,9" stroke={c2} strokeWidth="1.2" fill="none" opacity="0.5"/>
      <circle cx="16" cy="9" r="3" fill={c2} opacity="0.5"/>
      <circle cx="224" cy="9" r="3" fill={c2} opacity="0.5"/>
    </svg>
  )

  if (elemento === 'ar') return (
    <svg viewBox="0 0 240 18" height={18} style={{width:'100%',display:'block'}}>
      <line x1="16" y1="9" x2="84" y2="9" stroke={c2} strokeWidth="1" strokeDasharray="5,3" opacity="0.5"/>
      <polygon points="120,3 126,9 120,15 114,9" fill={c} opacity="0.85"/>
      <polygon points="105,6 109,9 105,12 101,9" fill={c2} opacity="0.5"/>
      <polygon points="135,6 139,9 135,12 131,9" fill={c2} opacity="0.5"/>
      <line x1="156" y1="9" x2="224" y2="9" stroke={c2} strokeWidth="1" strokeDasharray="5,3" opacity="0.5"/>
      <polygon points="16,6 19,9 16,12 13,9" fill={c} opacity="0.6"/>
      <polygon points="224,6 227,9 224,12 221,9" fill={c} opacity="0.6"/>
    </svg>
  )

  return (
    <svg viewBox="0 0 240 18" height={18} style={{width:'100%',display:'block'}}>
      <path d="M16,9 C36,3 56,15 76,9 C96,3 112,15 120,9" stroke={c2} strokeWidth="1.2" fill="none" opacity="0.6"/>
      <path d="M120,9 C128,3 144,15 164,9 C184,3 204,15 224,9" stroke={c2} strokeWidth="1.2" fill="none" opacity="0.6"/>
      <circle cx="120" cy="9" r="3.5" fill={c} opacity="0.75"/>
      <circle cx="16" cy="9" r="2" fill={c2} opacity="0.5"/>
      <circle cx="224" cy="9" r="2" fill={c2} opacity="0.5"/>
    </svg>
  )
}

// Full ornamental card border frame — corners + edges
function CardFrame({ cfg, elemento }: { cfg: any; elemento: string }) {
  const c = cfg.oc
  const c2 = cfg.oc2

  // 64px corner piece — top-left orientation, mirrored for other corners
  // Rosette + diagonal + arms extending 40px along each edge
  const cornerSvg = (
    <svg width={64} height={64} viewBox="0 0 80 80">
      {/* Diagonal line from corner inward */}
      <line x1="4" y1="4" x2="28" y2="28" stroke={c} strokeWidth="1.2" opacity="0.55"/>
      {/* Corner rosette */}
      <circle cx="14" cy="14" r="9" fill="none" stroke={c} strokeWidth="1.8" opacity="0.7"/>
      <circle cx="14" cy="14" r="4.5" fill={c} opacity="0.75"/>
      <circle cx="14" cy="14" r="1.5" fill="white" opacity="0.7"/>
      {/* Horizontal arm extending right (along top edge) */}
      <line x1="24" y1="14" x2="72" y2="14" stroke={c} strokeWidth="1.2" opacity="0.55"/>
      {/* Vertical arm extending down (along left edge) */}
      <line x1="14" y1="24" x2="14" y2="72" stroke={c} strokeWidth="1.2" opacity="0.55"/>
      {/* Leaf pair on horizontal arm */}
      <path d="M42,14 C43,9 49,8 50,14 C48,8 45,9 42,14Z" fill={c} opacity="0.55"/>
      <path d="M42,14 C43,19 49,20 50,14 C48,20 45,19 42,14Z" fill={c2} opacity="0.35"/>
      {/* Leaf pair on vertical arm */}
      <path d="M14,42 C9,43 8,49 14,50 C8,48 9,45 14,42Z" fill={c} opacity="0.55"/>
      <path d="M14,42 C19,43 20,49 14,50 C20,48 19,45 14,42Z" fill={c2} opacity="0.35"/>
      {/* Small flourish curves */}
      <path d="M14,14 Q24,6 36,4" stroke={c2} strokeWidth="1" fill="none" opacity="0.4"/>
      <path d="M14,14 Q6,24 4,36" stroke={c2} strokeWidth="1" fill="none" opacity="0.4"/>
      {/* End-of-arm dots */}
      <circle cx="72" cy="14" r="2.5" fill={c2} opacity="0.5"/>
      <circle cx="14" cy="72" r="2.5" fill={c2} opacity="0.5"/>
    </svg>
  )

  return (
    <div style={{position:'absolute', inset:0, pointerEvents:'none', zIndex:10, borderRadius:28, overflow:'hidden'}}>

      {/* Outer border — thick, prominent */}
      <div style={{
        position:'absolute', inset:4, borderRadius:24,
        border:`2px solid ${c}`,
        opacity:0.8, boxSizing:'border-box',
      }}/>
      {/* Inner border — 8px gap */}
      <div style={{
        position:'absolute', inset:12, borderRadius:18,
        border:`1px solid ${c}`,
        opacity:0.6, boxSizing:'border-box',
      }}/>
      {/* Third subtle line */}
      <div style={{
        position:'absolute', inset:16, borderRadius:15,
        border:`1px solid ${c2}`,
        opacity:0.3, boxSizing:'border-box',
      }}/>

      {/* ── CORNERS ── */}
      <div style={{position:'absolute', top:0, left:0}}>{cornerSvg}</div>
      <div style={{position:'absolute', top:0, right:0, transform:'scaleX(-1)'}}>{cornerSvg}</div>
      <div style={{position:'absolute', bottom:0, left:0, transform:'scaleY(-1)'}}>{cornerSvg}</div>
      <div style={{position:'absolute', bottom:0, right:0, transform:'scale(-1,-1)'}}>{cornerSvg}</div>

      {/* ── TOP MIDPOINT diamond ── */}
      <div style={{position:'absolute', top:4, left:'50%', transform:'translateX(-50%)', lineHeight:1}}>
        <svg width={24} height={16} viewBox="0 0 24 16">
          <polygon points="12,1 22,8 12,15 2,8" fill="none" stroke={c} strokeWidth="1.2" opacity="0.7"/>
          <circle cx="12" cy="8" r="2.5" fill={c} opacity="0.8"/>
        </svg>
      </div>

      {/* ── BOTTOM MIDPOINT diamond ── */}
      <div style={{position:'absolute', bottom:4, left:'50%', transform:'translateX(-50%)', lineHeight:1}}>
        <svg width={24} height={16} viewBox="0 0 24 16">
          <polygon points="12,1 22,8 12,15 2,8" fill="none" stroke={c} strokeWidth="1.2" opacity="0.7"/>
          <circle cx="12" cy="8" r="2.5" fill={c} opacity="0.8"/>
        </svg>
      </div>

      {/* ── LEFT MIDPOINT diamond ── */}
      <div style={{position:'absolute', left:4, top:'50%', transform:'translateY(-50%)', lineHeight:1}}>
        <svg width={16} height={24} viewBox="0 0 16 24">
          <polygon points="8,2 15,12 8,22 1,12" fill="none" stroke={c} strokeWidth="1.2" opacity="0.7"/>
          <circle cx="8" cy="12" r="2.5" fill={c} opacity="0.8"/>
        </svg>
      </div>

      {/* ── RIGHT MIDPOINT diamond ── */}
      <div style={{position:'absolute', right:4, top:'50%', transform:'translateY(-50%)', lineHeight:1}}>
        <svg width={16} height={24} viewBox="0 0 16 24">
          <polygon points="8,2 15,12 8,22 1,12" fill="none" stroke={c} strokeWidth="1.2" opacity="0.7"/>
          <circle cx="8" cy="12" r="2.5" fill={c} opacity="0.8"/>
        </svg>
      </div>

    </div>
  )
}

function ResultadoInner() {
  const params = useSearchParams()
  const id = params.get('id')
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [erroMsg, setErroMsg] = useState<string | null>(null)
  const [avatarB64, setAvatarB64] = useState<string>('')
  const [logoB64, setLogoB64] = useState<string>('')
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const s = sessionStorage.getItem(`result_${id}`)
    if (s) setData(JSON.parse(s))
  }, [id])

  // Pré-carrega imagens como base64 assim que data estiver disponível
  useEffect(() => {
    if (!data) return
    const avatarKey = getAvatar(data.tipo, data.porte, data.pelagem, data.raca)
    const avatarPath = `/avatars/${avatarKey}.png`
    console.log('[avatar] tipo:', data.tipo, '| porte:', data.porte, '| pelagem:', data.pelagem, '| raca:', data.raca)
    console.log('[avatar] key:', avatarKey, '| path:', avatarPath)
    toBase64(avatarPath).then(b64 => {
      console.log('[avatar] result:', b64 ? `OK (${b64.slice(0, 30)}...)` : 'EMPTY — image not found')
      setAvatarB64(b64)
    })
    toBase64('/logo.png').then(setLogoB64)
  }, [data])

  const gerarImagem = async (): Promise<{ dataUrl: string; file: File } | null> => {
    if (!cardRef.current) return null
    const dataUrl = await htmlToImage.toPng(cardRef.current, {
      quality: 1,
      pixelRatio: 2,
      backgroundColor: '#ffffff',
      skipFonts: true,
      cacheBust: true,
    })
    const blob = await (await fetch(dataUrl)).blob()
    const file = new File([blob], `signopet-${data.nome}.png`, { type: 'image/png' })
    return { dataUrl, file }
  }

  const compartilharWhatsApp = async () => {
    setLoading(true)
    setErroMsg(null)
    try {
      const resultado = await gerarImagem()
      if (!resultado) return
      const { file } = resultado
      const texto = `${data.nome} é de ${data.signo_pet} 😂\neu sou ${data.score}% compatível com ele 😱\nDescubra do seu pet: ${window.location.origin}`
      if (navigator.share) {
        try {
          await navigator.share({ files: [file], text: texto })
          return
        } catch { /* cai no fallback */ }
      }
      const url = `https://wa.me/?text=${encodeURIComponent(texto)}`
      window.open(url, '_blank')
    } catch (err: any) {
      setErroMsg('ERRO WA: ' + (err?.message || String(err)))
    } finally {
      setLoading(false)
    }
  }

  const salvarImagem = async () => {
    setLoading(true)
    setErroMsg(null)
    try {
      const resultado = await gerarImagem()
      if (!resultado) return
      const link = document.createElement('a')
      link.download = `signopet-${data.nome}.png`
      link.href = resultado.dataUrl
      link.click()
    } catch (err: any) {
      setErroMsg('ERRO SAVE: ' + (err?.message || String(err)))
    } finally {
      setLoading(false)
    }
  }

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="text-5xl mb-4 animate-pulse">🔮</div>
        <p className="text-gray-400 mb-4">Calculando compatibilidade...</p>
        <Link href="/cadastro" className="text-purple-500 underline text-sm">Tentar novamente</Link>
      </div>
    </div>
  )

  const cfg = ELEMENTO_CONFIG[data.elemento] || ELEMENTO_CONFIG.fogo

  return (
    <main style={{
      background: '#f0ebe0',
      minHeight: '100vh',
      padding: '32px 16px 48px',
    }}>
      <div style={{maxWidth: 400, margin: '0 auto'}}>

        {/* ── Logo + brand name above card ── */}
        <div style={{textAlign:'center', marginBottom:22}}>
          {logoB64
            ? <img src={logoB64} alt="SignoPet" width={44} height={44} style={{filter:'drop-shadow(0 2px 8px rgba(0,0,0,0.14))', display:'inline-block'}}/>
            : <Image src="/logo.png" alt="SignoPet" width={44} height={44}/>
          }
          <div style={{
            fontSize:11, color:'#8a7a6a', fontFamily:'Georgia,serif',
            letterSpacing:'0.18em', marginTop:5, fontStyle:'italic',
          }}>
            signopet
          </div>
        </div>

        {/* ═══════════════════════════════════════
            CARD — premium tarot/parchment aesthetic
        ═══════════════════════════════════════ */}
        <div
          ref={cardRef}
          style={{
            maxWidth: 380,
            margin: '0 auto 28px',
            borderRadius: 28,
            background: cfg.cardBg,
            boxShadow: [
              '0 32px 80px rgba(0,0,0,0.35)',
              '0 8px 20px rgba(0,0,0,0.2)',
              '0 0 0 1px rgba(0,0,0,0.06)',
            ].join(', '),
            position: 'relative',
            overflow: 'hidden',
            padding: 0,
          }}
        >
          {/* Full ornamental border overlay */}
          <CardFrame cfg={cfg} elemento={data.elemento}/>

          {/* ── 1. DARK TOP BAND — element header ── */}
          <div style={{
            background: cfg.topBand,
            borderRadius: '26px 26px 0 0',
            padding: '18px 24px 20px',
            textAlign: 'center',
            position: 'relative',
            zIndex: 2,
          }}>
            {/* Corner accent SVGs */}
            <div style={{position:'absolute', top:10, left:14, opacity:0.32}}>
              <svg width={22} height={22} viewBox="0 0 22 22">
                <path d="M2,20 C2,11 11,2 20,2" stroke="white" strokeWidth="1.2" fill="none"/>
                <circle cx="2" cy="20" r="2.5" fill="white"/>
                <circle cx="20" cy="2" r="1.5" fill="white" opacity="0.6"/>
              </svg>
            </div>
            <div style={{position:'absolute', top:10, right:14, opacity:0.32, transform:'scaleX(-1)'}}>
              <svg width={22} height={22} viewBox="0 0 22 22">
                <path d="M2,20 C2,11 11,2 20,2" stroke="white" strokeWidth="1.2" fill="none"/>
                <circle cx="2" cy="20" r="2.5" fill="white"/>
                <circle cx="20" cy="2" r="1.5" fill="white" opacity="0.6"/>
              </svg>
            </div>
            <div style={{
              fontSize: 10, color: 'rgba(255,255,255,0.5)',
              letterSpacing: '0.35em', fontStyle: 'italic',
              fontFamily: 'Georgia, serif', marginBottom: 8,
            }}>
              ✦ MAPA ASTRAL PET ✦
            </div>
            <div style={{
              fontSize: 26, fontFamily: 'Georgia, serif',
              fontWeight: 'bold', color: cfg.textoSub, marginBottom: 5,
              letterSpacing: '0.06em',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            }}>
              <span style={{fontSize:10, opacity:0.6}}>✦</span>
              {cfg.emoji} {cfg.label}
              <span style={{fontSize:10, opacity:0.6}}>✦</span>
            </div>
            <div style={{
              fontSize: 12, color: 'rgba(255,255,255,0.65)',
              letterSpacing: '0.2em', fontFamily: 'sans-serif',
            }}>
              ✦ {data.signo_pet}
            </div>
          </div>

          {/* ── 2. AVATAR ZONE — pure white, pet centered ── */}
          <div style={{
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 220,
            padding: 0,
            overflow: 'visible',
          }}>
            {avatarB64
              ? <img
                  src={avatarB64}
                  alt={data.nome}
                  width={320}
                  height={320}
                  style={{objectFit:'contain', display:'block', filter:'drop-shadow(0 6px 18px rgba(0,0,0,0.15))'}}
                />
              : <span style={{fontSize:80, display:'block', textAlign:'center'}}>🐾</span>
            }
          </div>

          {/* ── Parchment content area ── */}
          <div style={{padding:'0 12px 20px', position:'relative', zIndex:2}}>

            {/* ── 3. PET PHRASE ── */}
            <div style={{textAlign:'center', padding:'10px 8px 16px'}}>
              <div style={{
                fontSize: 14, fontFamily: 'Georgia, serif', fontStyle: 'italic',
                color: '#3d2b1f', lineHeight: 1.58,
              }}>
                {data.frase_pet}
              </div>
            </div>

            {/* ── 4. COMPATIBILITY SECTION ── */}
            <div style={{
              margin: '0 0 16px',
              borderRadius: 16,
              background: cfg.topBand,
              padding: '20px 20px 20px',
              position: 'relative',
              textAlign: 'center',
            }}>
              {/* 4 corner sparkles */}
              <div style={{position:'absolute', top:8,  left:10,  fontSize:9, color:cfg.textoSub, opacity:0.5}}>✦</div>
              <div style={{position:'absolute', top:8,  right:10, fontSize:9, color:cfg.textoSub, opacity:0.5}}>✦</div>
              <div style={{position:'absolute', bottom:8, left:10,  fontSize:9, color:cfg.textoSub, opacity:0.5}}>✦</div>
              <div style={{position:'absolute', bottom:8, right:10, fontSize:9, color:cfg.textoSub, opacity:0.5}}>✦</div>

              <div style={{
                fontSize: 10, color: 'rgba(255,255,255,0.48)',
                letterSpacing: '0.22em', textTransform: 'uppercase',
                fontFamily: 'sans-serif', fontWeight: 700, marginBottom: 10,
              }}>
                {data.nome.toUpperCase()} E VOCÊ
              </div>

              {/* Score — massive glowing */}
              <div style={{position:'relative', lineHeight:1, marginBottom:8}}>
                <div style={{
                  position:'absolute', top:'50%', left:'50%',
                  transform:'translate(-50%,-50%)',
                  width:140, height:86,
                  background:`radial-gradient(ellipse, ${cfg.textoSub}44 0%, transparent 64%)`,
                  zIndex:0, pointerEvents:'none',
                }}/>
                <span style={{
                  position:'relative', zIndex:1,
                  fontSize:72, fontFamily:'Georgia, serif', fontWeight:700,
                  color:cfg.textoSub, lineHeight:1,
                  textShadow:`0 0 38px ${cfg.textoSub}aa, 0 2px 12px rgba(0,0,0,0.3)`,
                }}>
                  {data.score}%
                </span>
              </div>

              <div style={{
                fontSize:10, color:'rgba(255,255,255,0.4)',
                fontFamily:'sans-serif', letterSpacing:'0.12em', marginBottom:12,
              }}>
                compatíveis
              </div>

              <div style={{height:4, background:'rgba(255,255,255,0.12)', borderRadius:2, overflow:'hidden'}}>
                <div style={{width:`${data.score}%`, height:'100%', background:cfg.compatBar, borderRadius:2}}/>
              </div>

              {/* Ornamental divider below bar */}
              <div style={{marginTop:14}}>
                <OrnamentalDivider cfg={cfg} elemento={data.elemento}/>
              </div>
            </div>

            {/* ── 5. MESSAGE SECTION ── */}
            <div style={{marginBottom:14, position:'relative', zIndex:2}}>
              <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:10}}>
                <div style={{flex:1, height:1, background:`${cfg.oc}30`}}/>
                <div style={{
                  fontSize:9, color:cfg.oc, letterSpacing:'0.16em',
                  textTransform:'uppercase', fontFamily:'sans-serif', fontWeight:700,
                  whiteSpace:'nowrap',
                }}>
                  · {data.nome.toUpperCase()} DEIXOU UM RECADO: ·
                </div>
                <div style={{flex:1, height:1, background:`${cfg.oc}30`}}/>
              </div>
              <div style={{
                fontSize:15, fontFamily:'Georgia, serif', fontStyle:'italic',
                color:'#2a1a0e', lineHeight:1.68, textAlign:'center',
              }}>
                "{data.frase_compat}"
              </div>
            </div>

            {/* ── 6. SIGNS SECTION ── */}
            <div style={{
              display:'flex', alignItems:'center', justifyContent:'space-around',
              marginBottom:16, position:'relative', zIndex:2,
              borderTop:`1px solid ${cfg.oc}20`,
              borderBottom:`1px solid ${cfg.oc}20`,
              padding:'13px 20px',
            }}>
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:9, color:cfg.oc, letterSpacing:'0.2em', fontWeight:700, textTransform:'uppercase', fontFamily:'sans-serif', marginBottom:5}}>PET</div>
                <div style={{fontSize:18, fontFamily:'Georgia, serif', fontWeight:700, color:'#1a0a2e', marginBottom:3}}>{data.signo_pet}</div>
                <div style={{fontSize:11, color:cfg.oc, fontFamily:'sans-serif', fontWeight:600}}>{cfg.emoji} {cfg.label}</div>
              </div>
              <div style={{width:1, height:46, background:cfg.oc, opacity:0.2}}/>
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:9, color:cfg.oc, letterSpacing:'0.2em', fontWeight:700, textTransform:'uppercase', fontFamily:'sans-serif', marginBottom:5}}>TUTOR</div>
                <div style={{fontSize:18, fontFamily:'Georgia, serif', fontWeight:700, color:'#1a0a2e', marginBottom:3}}>{data.signo_tutor}</div>
                <div style={{fontSize:11, color:cfg.oc, fontFamily:'sans-serif', fontWeight:600}}>{cfg.emoji} {cfg.label}</div>
              </div>
            </div>

            {/* ── 7. FOOTER ── */}
            <div style={{textAlign:'center', paddingTop:2, position:'relative', zIndex:2}}>
              <OrnamentalDivider cfg={cfg} elemento={data.elemento}/>
              <div style={{
                fontSize:11, fontFamily:'Georgia, serif', fontStyle:'italic',
                color:cfg.oc, opacity:0.6, letterSpacing:'0.06em', marginTop:7,
              }}>
                gratuito em @signopet
              </div>
            </div>

          </div>
        </div>
        {/* END CARD */}

        {/* ERRO VISÍVEL */}
        {erroMsg && (
          <div style={{
            background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 12,
            padding: '12px 16px', marginBottom: 12, fontSize: 12, color: '#991b1b',
            fontFamily: 'monospace', wordBreak: 'break-all',
          }}>
            {erroMsg}
          </div>
        )}

        {/* BOTÕES */}
        <button
          onClick={compartilharWhatsApp}
          disabled={loading}
          style={{
            width: '100%', padding: '16px', borderRadius: 999, color: '#fff',
            fontWeight: 800, fontSize: 16, border: 'none', cursor: loading ? 'wait' : 'pointer',
            marginBottom: 10, opacity: loading ? 0.8 : 1,
            background: 'linear-gradient(135deg,#25d366,#128c7e)',
            transition: 'opacity 0.2s',
          }}>
          {loading ? 'Gerando imagem... ⏳' : '💬 Compartilhar no WhatsApp'}
        </button>

        <button
          onClick={salvarImagem}
          disabled={loading}
          style={{
            width: '100%', padding: '14px', borderRadius: 999,
            fontWeight: 700, fontSize: 14, border: '2px solid #e9d5ff',
            cursor: loading ? 'wait' : 'pointer',
            marginBottom: 20, opacity: loading ? 0.8 : 1,
            background: 'white', color: '#7c3aed',
            transition: 'opacity 0.2s',
          }}>
          {loading ? '⏳' : '📥 Salvar imagem para o Instagram'}
        </button>

        {/* UPSELL */}
        <div style={{background:'#fff', border:'1px solid #f0e0ff', borderRadius:20, padding:20, textAlign:'center'}}>
          <div style={{fontSize:24, marginBottom:8}}>🔮</div>
          <div style={{fontSize:17, fontWeight:800, color:'#1a1a2e', marginBottom:6, lineHeight:1.3}}>
            Quer entender por que vocês são {data.score}% compatíveis?
          </div>
          <div style={{fontSize:13, color:'#6b7280', marginBottom:16, lineHeight:1.6}}>
            Laudo completo com 9 capítulos sobre {data.nome} — personalidade, missão de vida, como se relaciona com você e muito mais.
          </div>
          <button style={{
            width:'100%', padding:'15px', borderRadius:999, color:'#fff',
            fontWeight:800, fontSize:16, border:'none', cursor:'pointer', marginBottom:8,
            background:'linear-gradient(135deg,#a855f7,#ec4899)',
          }}>
            Ver laudo completo — R$19,90
          </button>
          <div style={{fontSize:11, color:'#d1d5db', fontWeight:500}}>De R$39,90 · Pagamento único · Entrega em até 5 min</div>
        </div>

      </div>

    </main>
  )
}

export default function Resultado() {
  return (
    <Suspense>
      <ResultadoInner/>
    </Suspense>
  )
}
