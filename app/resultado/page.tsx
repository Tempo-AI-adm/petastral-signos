'use client'
import { useEffect, useState, Suspense, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import * as htmlToImage from 'html-to-image'

const ELEMENTO_CONFIG: Record<string, any> = {
  fogo: {
    borda: 'linear-gradient(135deg,#f5a623,#e8560a,#f5a623,#ff8800,#f5a623)',
    avatarBg: 'linear-gradient(180deg,#fff8f0 0%,#ffe8cc 40%,#ffccaa 100%)',
    compatBg: 'linear-gradient(135deg,#7a1a00,#c44000)',
    compatBar: 'linear-gradient(90deg,#ff6600,#ffd580)',
    texto: '#c44800', textoSub: '#ffd580',
    badge: 'rgba(255,120,0,0.08)', badgeBorder: 'rgba(255,120,0,0.2)', badgeText: '#c44800',
    emoji: '🔥', label: 'FOGO',
    flames: true, waves: false, stars: false, crystals: false,
    cardBg: '#fffcf8',
    oc: '#c44800', oc2: '#f5a623',
    topBand: 'linear-gradient(135deg,#6b1800,#a83300,#c44000)',
    signBg: 'rgba(244,120,0,0.05)',
    signBorder: 'rgba(244,120,0,0.18)',
  },
  terra: {
    borda: 'linear-gradient(135deg,#86efac,#4ade80,#86efac,#22c55e,#86efac)',
    avatarBg: 'linear-gradient(180deg,#f0fff4 0%,#dcfce7 40%,#bbf7d0 100%)',
    compatBg: 'linear-gradient(135deg,#14532d,#166534)',
    compatBar: 'linear-gradient(90deg,#16a34a,#d4f0a0)',
    texto: '#15803d', textoSub: '#d4f0a0',
    badge: 'rgba(34,197,94,0.08)', badgeBorder: 'rgba(34,197,94,0.2)', badgeText: '#15803d',
    emoji: '🌿', label: 'TERRA',
    flames: false, waves: false, stars: false, crystals: true,
    cardBg: '#f8fff9',
    oc: '#15803d', oc2: '#4ade80',
    topBand: 'linear-gradient(135deg,#052e16,#14532d,#166534)',
    signBg: 'rgba(34,197,94,0.05)',
    signBorder: 'rgba(34,197,94,0.18)',
  },
  ar: {
    borda: 'linear-gradient(135deg,#c084fc,#e879a0,#a855f7,#ec4899,#c084fc)',
    avatarBg: 'linear-gradient(180deg,#faf5ff 0%,#f3e8ff 40%,#e9d5ff 100%)',
    compatBg: 'linear-gradient(135deg,#2e1065,#4c1d95)',
    compatBar: 'linear-gradient(90deg,#a855f7,#e9d5ff)',
    texto: '#7c3aed', textoSub: '#e9d5ff',
    badge: 'rgba(168,85,247,0.08)', badgeBorder: 'rgba(168,85,247,0.2)', badgeText: '#7c3aed',
    emoji: '💨', label: 'AR',
    flames: false, waves: false, stars: true, crystals: false,
    cardBg: '#fdf8ff',
    oc: '#7c3aed', oc2: '#c084fc',
    topBand: 'linear-gradient(135deg,#1a0538,#2e1065,#4c1d95)',
    signBg: 'rgba(168,85,247,0.05)',
    signBorder: 'rgba(168,85,247,0.18)',
  },
  água: {
    borda: 'linear-gradient(135deg,#67e8f9,#22d3ee,#67e8f9,#06b6d4,#67e8f9)',
    avatarBg: 'linear-gradient(180deg,#f0fdff 0%,#cffafe 40%,#a5f3fc 100%)',
    compatBg: 'linear-gradient(135deg,#0c4a6e,#0369a1)',
    compatBar: 'linear-gradient(90deg,#0284c7,#a5f3fc)',
    texto: '#0369a1', textoSub: '#a5f3fc',
    badge: 'rgba(6,182,212,0.08)', badgeBorder: 'rgba(6,182,212,0.2)', badgeText: '#0369a1',
    emoji: '💧', label: 'ÁGUA',
    flames: false, waves: true, stars: false, crystals: false,
    cardBg: '#f0fdff',
    oc: '#0369a1', oc2: '#67e8f9',
    topBand: 'linear-gradient(135deg,#082f49,#0c4a6e,#0369a1)',
    signBg: 'rgba(6,182,212,0.05)',
    signBorder: 'rgba(6,182,212,0.18)',
  },
}

const AVATAR_MAP: Record<string, Record<string, Record<string, string>>> = {
  dog: {
    pequeno: { claro: 'pinscher-caramelo', escuro: 'pinscher-preto-fogo', mesclado: 'chihuahua-creme' },
    medio:   { claro: 'beagle', escuro: 'srd-medio-escuro', mesclado: 'border-collie' },
    grande:  { claro: 'golden-retriever', escuro: 'labrador-preto', mesclado: 'pastor-alemao' },
  },
  cat: {
    pequeno: { claro: 'gato-srd-branco', escuro: 'gato-srd-preto', mesclado: 'gato-srd-tigrado' },
    medio:   { claro: 'gato-srd-branco', escuro: 'gato-srd-preto', mesclado: 'gato-srd-tigrado' },
    grande:  { claro: 'gato-srd-longo-branco', escuro: 'gato-srd-longo-preto', mesclado: 'gato-srd-longo-mesclado' },
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
    const blob = await res.blob()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch {
    return '' // se falhar, imagem fica em branco
  }
}

function Flames() {
  return (
    <div style={{position:'absolute',bottom:0,left:0,right:0,height:90,display:'flex',alignItems:'flex-end',justifyContent:'space-around',padding:'0 2px',zIndex:1}}>
      {[{w:30,h:80,a:'flicker1',o:0.85,t:1.2},{w:22,h:60,a:'flicker2',o:0.75,t:0.9},{w:38,h:95,a:'flicker3',o:0.9,t:1.4},{w:20,h:55,a:'flicker1',o:0.7,t:1.0},{w:32,h:75,a:'flicker2',o:0.85,t:1.3},{w:20,h:50,a:'flicker3',o:0.7,t:0.8},{w:28,h:68,a:'flicker1',o:0.8,t:1.1}].map((f,i) => (
        <div key={i} style={{width:f.w,height:f.h,background:'linear-gradient(180deg,#ffcc00,#ff3300)',borderRadius:'50% 50% 15% 15%',animation:`${f.a} ${f.t}s ease-in-out infinite`,transformOrigin:'bottom',opacity:f.o}}/>
      ))}
    </div>
  )
}

function Waves() {
  return (
    <div style={{position:'absolute',bottom:0,left:0,right:0,zIndex:1}}>
      <svg viewBox="0 0 300 50" style={{width:'100%',height:50}}>
        <path d="M0,25 C50,8 100,42 150,25 C200,8 250,42 300,25 L300,50 L0,50 Z" fill="rgba(6,182,212,0.35)"/>
        <path d="M0,32 C60,15 120,45 180,32 C240,15 270,42 300,32 L300,50 L0,50 Z" fill="rgba(14,116,144,0.3)"/>
      </svg>
    </div>
  )
}

function Stars() {
  return (
    <>
      {[{t:15,l:20},{t:25,l:80},{t:10,r:30},{t:40,l:140},{t:30,r:60},{t:55,l:50}].map((s,i) => (
        <div key={i} style={{position:'absolute',top:s.t,left:(s as any).l,right:(s as any).r,width:i%2===0?4:3,height:i%2===0?4:3,background:'#c084fc',borderRadius:'50%',zIndex:1,opacity:0.5,animation:`twinkle ${1.5+i*0.3}s ease-in-out infinite`}}/>
      ))}
    </>
  )
}

function Crystals() {
  return (
    <div style={{position:'absolute',bottom:0,left:0,right:0,height:50,zIndex:1,display:'flex',alignItems:'flex-end',justifyContent:'space-around'}}>
      {[28,45,36,55,30,42].map((h,i) => (
        <div key={i} style={{width:10,height:h,background:'linear-gradient(180deg,#86efac,#16a34a)',clipPath:'polygon(50% 0%, 100% 100%, 0% 100%)',opacity:0.5}}/>
      ))}
    </div>
  )
}

function CornerOrnaments({ elemento, cfg }: { elemento: string; cfg: any }) {
  const c = cfg.oc
  const c2 = cfg.oc2
  const s = 42

  const FogoCorner = () => (
    <svg viewBox="0 0 42 42" width={s} height={s}>
      <line x1="3" y1="3" x2="24" y2="3" stroke={c2} strokeWidth="2" strokeLinecap="round"/>
      <line x1="3" y1="3" x2="3" y2="24" stroke={c2} strokeWidth="2" strokeLinecap="round"/>
      <circle cx="3" cy="3" r="3" fill={c}/>
      <path d="M11,3 C10,9 16,13 12,20 C16,12 14,7 18,3Z" fill={c2} opacity="0.5"/>
      <path d="M3,11 C9,10 13,16 20,12 C12,16 7,14 3,18Z" fill={c2} opacity="0.35"/>
    </svg>
  )

  const TerraCorner = () => (
    <svg viewBox="0 0 42 42" width={s} height={s}>
      <path d="M3,3 C10,3 17,3 24,3" stroke={c2} strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M3,3 C3,10 3,17 3,24" stroke={c2} strokeWidth="2" strokeLinecap="round" fill="none"/>
      <circle cx="3" cy="3" r="3" fill={c}/>
      <path d="M11,4 C13,8 11,14 15,16 C13,12 13,8 16,9Z" fill={c2} opacity="0.6"/>
      <path d="M4,11 C8,13 14,11 16,15 C12,12 8,13 9,16Z" fill={c2} opacity="0.4"/>
    </svg>
  )

  const ArCorner = () => (
    <svg viewBox="0 0 42 42" width={s} height={s}>
      <line x1="3" y1="3" x2="24" y2="3" stroke={c2} strokeWidth="1.5" strokeDasharray="5,3" strokeLinecap="round"/>
      <line x1="3" y1="3" x2="3" y2="24" stroke={c2} strokeWidth="1.5" strokeDasharray="5,3" strokeLinecap="round"/>
      <polygon points="3,0 6,3 3,6 0,3" fill={c}/>
      <circle cx="14" cy="7" r="2" fill={c2} opacity="0.6"/>
      <circle cx="7" cy="14" r="2" fill={c2} opacity="0.6"/>
      <circle cx="19" cy="13" r="1.3" fill={c2} opacity="0.35"/>
    </svg>
  )

  const AguaCorner = () => (
    <svg viewBox="0 0 42 42" width={s} height={s}>
      <path d="M3,3 C10,2 17,4 24,3" stroke={c2} strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M3,3 C2,10 4,17 3,24" stroke={c2} strokeWidth="2" fill="none" strokeLinecap="round"/>
      <circle cx="3" cy="3" r="3" fill={c}/>
      <path d="M10,5 C11,9 9,13 13,15" fill="none" stroke={c2} strokeWidth="1.2" opacity="0.6"/>
      <path d="M5,10 C9,11 13,9 15,13" fill="none" stroke={c2} strokeWidth="1.2" opacity="0.5"/>
    </svg>
  )

  const Svg = elemento === 'fogo' ? FogoCorner
    : elemento === 'terra' ? TerraCorner
    : elemento === 'ar' ? ArCorner
    : AguaCorner

  return (
    <>
      <div style={{position:'absolute',top:0,left:0,zIndex:8,pointerEvents:'none'}}><Svg/></div>
      <div style={{position:'absolute',top:0,right:0,zIndex:8,pointerEvents:'none',transform:'scaleX(-1)'}}><Svg/></div>
      <div style={{position:'absolute',bottom:0,left:0,zIndex:8,pointerEvents:'none',transform:'scaleY(-1)'}}><Svg/></div>
      <div style={{position:'absolute',bottom:0,right:0,zIndex:8,pointerEvents:'none',transform:'scale(-1,-1)'}}><Svg/></div>
    </>
  )
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
    toBase64(`/avatars/${avatarKey}.png`).then(setAvatarB64)
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
      background: 'linear-gradient(160deg,#f5f0eb 0%,#ede5da 60%,#e8e0d5 100%)',
      minHeight: '100vh',
      padding: '2.5rem 2rem',
    }}>
      <div style={{maxWidth: 360, margin: '0 auto'}}>

        {/* Logo fora do card */}
        <div style={{display:'flex', justifyContent:'center', marginBottom:'1.5rem'}}>
          {logoB64
            ? <img src={logoB64} alt="SignoPet" width={48} height={48} style={{filter:'drop-shadow(0 2px 8px rgba(0,0,0,0.12))'}}/>
            : <Image src="/logo.png" alt="SignoPet" width={48} height={48}/>
          }
        </div>

        {/* ═══ CARD — tarot card visual ═══ */}
        <div ref={cardRef} style={{
          borderRadius: 22,
          padding: 7,
          background: cfg.borda,
          backgroundSize: '300% 300%',
          animation: 'shimmer 4s ease infinite',
          boxShadow: '0 28px 80px rgba(0,0,0,0.28), 0 8px 24px rgba(0,0,0,0.16), 0 0 0 1px rgba(255,255,255,0.2)',
          marginBottom: 24,
        }}>
          <div style={{
            borderRadius: 17,
            overflow: 'hidden',
            background: cfg.cardBg,
            position: 'relative',
          }}>
            {/* Corner ornaments */}
            <CornerOrnaments elemento={data.elemento} cfg={cfg}/>

            {/* ── TOP BAND — element identity ── */}
            <div style={{
              background: cfg.topBand,
              padding: '18px 20px 14px',
              textAlign: 'center',
              position: 'relative',
            }}>
              <div style={{
                fontSize: 11, fontFamily: 'Georgia, serif', letterSpacing: '0.25em',
                color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', marginBottom: 6,
                fontStyle: 'italic',
              }}>
                ✦ mapa astral pet ✦
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              }}>
                <span style={{fontSize: 28}}>{cfg.emoji}</span>
                <div>
                  <div style={{
                    fontSize: 20, fontFamily: 'Georgia, serif', fontWeight: 700,
                    color: cfg.textoSub, letterSpacing: '0.12em', lineHeight: 1,
                  }}>
                    {cfg.label}
                  </div>
                  <div style={{
                    fontSize: 11, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.18em',
                    fontFamily: 'sans-serif', fontWeight: 600, marginTop: 2,
                  }}>
                    ✦ {data.signo_pet}
                  </div>
                </div>
                <span style={{fontSize: 28}}>{cfg.emoji}</span>
              </div>
            </div>

            {/* ── AVATAR — loose, no circle clip ── */}
            <div style={{
              position: 'relative', overflow: 'hidden',
              background: cfg.avatarBg, minHeight: 230,
              display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            }}>
              {cfg.flames && <Flames/>}
              {cfg.waves && <Waves/>}
              {cfg.stars && <Stars/>}
              {cfg.crystals && <Crystals/>}
              <div style={{position: 'relative', zIndex: 2, paddingBottom: 0, paddingTop: 16}}>
                {avatarB64
                  ? <img
                      src={avatarB64}
                      alt={data.nome}
                      width={200}
                      height={200}
                      style={{
                        objectFit: 'contain',
                        display: 'block',
                        filter: 'drop-shadow(0 12px 28px rgba(0,0,0,0.22))',
                      }}
                    />
                  : <span style={{fontSize: 80, display: 'block', textAlign: 'center', padding: '20px 0'}}>🐾</span>
                }
              </div>
            </div>

            {/* ── PET NAME ── */}
            <div style={{
              background: cfg.cardBg,
              padding: '18px 24px 14px',
              textAlign: 'center',
            }}>
              <div style={{
                fontSize: 38, fontFamily: 'Georgia, serif', fontWeight: 700,
                color: '#1a0a0a', lineHeight: 1.1, letterSpacing: '-0.01em',
              }}>
                {data.nome}
              </div>
              <div style={{margin: '10px 0 4px'}}>
                <OrnamentalDivider cfg={cfg} elemento={data.elemento}/>
              </div>
              <div style={{
                fontSize: 13, color: cfg.oc, fontStyle: 'italic',
                fontFamily: 'Georgia, serif', lineHeight: 1.55, fontWeight: 500,
              }}>
                {data.frase_pet}
              </div>
            </div>

            {/* ── SIGN INFO — framed ── */}
            <div style={{
              margin: '0 18px',
              background: cfg.signBg,
              border: `1px solid ${cfg.signBorder}`,
              borderRadius: 10,
              padding: '12px 16px',
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              marginBottom: 0,
            }}>
              <div style={{textAlign: 'center'}}>
                <div style={{
                  fontSize: 9, color: cfg.oc, fontFamily: 'sans-serif',
                  letterSpacing: '0.18em', marginBottom: 4, fontWeight: 700, textTransform: 'uppercase',
                }}>
                  Pet
                </div>
                <div style={{
                  fontSize: 15, color: '#1a0a2e', fontFamily: 'Georgia, serif',
                  fontWeight: 700, letterSpacing: '0.02em',
                }}>
                  ✦ {data.signo_pet}
                </div>
                <div style={{
                  fontSize: 10, color: cfg.oc, fontFamily: 'sans-serif', fontWeight: 600, marginTop: 2,
                }}>
                  {cfg.emoji} {cfg.label}
                </div>
              </div>
              <div style={{width: 1, height: 36, background: cfg.signBorder}}/>
              <div style={{textAlign: 'center'}}>
                <div style={{
                  fontSize: 9, color: cfg.oc, fontFamily: 'sans-serif',
                  letterSpacing: '0.18em', marginBottom: 4, fontWeight: 700, textTransform: 'uppercase',
                }}>
                  Tutor
                </div>
                <div style={{
                  fontSize: 15, color: '#1a0a2e', fontFamily: 'Georgia, serif',
                  fontWeight: 700, letterSpacing: '0.02em',
                }}>
                  ✦ {data.signo_tutor}
                </div>
                <div style={{
                  fontSize: 10, color: cfg.oc, fontFamily: 'sans-serif', fontWeight: 600, marginTop: 2,
                }}>
                  {cfg.emoji} {cfg.label}
                </div>
              </div>
            </div>

            {/* ── COMPATIBILITY ── */}
            <div style={{
              background: cfg.compatBg,
              padding: '20px 24px 18px',
              textAlign: 'center',
              marginTop: 14,
            }}>
              <div style={{
                fontSize: 10, color: 'rgba(255,255,255,0.4)', fontFamily: 'sans-serif',
                letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 6,
              }}>
                {data.nome} e você
              </div>
              <div style={{
                display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 8, marginBottom: 12,
              }}>
                <span style={{
                  fontSize: 62, fontFamily: 'Georgia, serif', fontWeight: 700, color: cfg.textoSub,
                  lineHeight: 1, textShadow: `0 0 40px ${cfg.textoSub}55`,
                }}>
                  {data.score}%
                </span>
                <span style={{fontSize: 13, color: 'rgba(255,255,255,0.45)', fontFamily: 'sans-serif'}}>
                  compatíveis
                </span>
              </div>
              <div style={{
                height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden', marginBottom: 16,
              }}>
                <div style={{width: `${data.score}%`, height: '100%', background: cfg.compatBar, borderRadius: 2}}/>
              </div>
              <div style={{margin: '0 0 4px'}}>
                <OrnamentalDivider cfg={cfg} elemento={data.elemento}/>
              </div>
              <div style={{
                fontSize: 14, color: 'rgba(255,255,255,0.85)', fontStyle: 'italic',
                fontFamily: 'Georgia, serif', lineHeight: 1.65, fontWeight: 500, marginTop: 10,
              }}>
                "{data.frase_compat}"
              </div>
            </div>

            {/* ── FOOTER ── */}
            <div style={{
              padding: '10px 20px',
              background: cfg.cardBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}>
              {logoB64
                ? <img src={logoB64} alt="SignoPet" width={18} height={18} style={{opacity: 0.5}}/>
                : <Image src="/logo.png" alt="SignoPet" width={18} height={18}/>
              }
              <span style={{
                fontSize: 11, color: cfg.oc, fontFamily: 'Georgia, serif',
                fontStyle: 'italic', letterSpacing: '0.06em', opacity: 0.7,
              }}>
                signopet.com
              </span>
            </div>

          </div>
        </div>

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

      <style>{`
        @keyframes shimmer{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes flicker1{0%,100%{transform:scaleY(1) translateX(0)}50%{transform:scaleY(1.25) translateX(2px)}}
        @keyframes flicker2{0%,100%{transform:scaleY(1)}50%{transform:scaleY(0.82) translateX(-3px)}}
        @keyframes flicker3{0%,100%{transform:scaleY(1)}40%{transform:scaleY(1.2) translateX(1px)}}
        @keyframes twinkle{0%,100%{opacity:0.2;transform:scale(1)}50%{opacity:1;transform:scale(1.6)}}
        @keyframes crystalGrow{0%{transform:scaleY(0.88)}100%{transform:scaleY(1.08)}}
      `}</style>
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
