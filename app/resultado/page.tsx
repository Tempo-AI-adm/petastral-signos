'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, Suspense, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import * as htmlToImage from 'html-to-image'
import { getPoder } from '@/lib/poderEspecial'

const ELEMENTO_CONFIG: Record<string, any> = {
  fogo: {
    borda: 'linear-gradient(135deg,#f5a623,#e8560a,#f5a623,#ff8800,#f5a623)',
    compatBg: 'linear-gradient(135deg,#7a1a00,#c44000)',
    compatBar: 'linear-gradient(90deg,#ff6600,#ffd580)',
    texto: '#c44800', textoSub: '#ffd580',
    badge: 'rgba(255,120,0,0.08)', badgeBorder: 'rgba(255,120,0,0.2)', badgeText: '#c44800',
    emoji: '🔥', label: 'FOGO',
    flames: true, waves: false, stars: false, crystals: false,
    cardBg: 'linear-gradient(160deg, #1a0800 0%, #2d1200 40%, #1a0800 100%)',
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
    cardBg: 'linear-gradient(160deg, #021a0a 0%, #052e16 40%, #021a0a 100%)',
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
    cardBg: 'linear-gradient(160deg, #0e0520 0%, #1a0538 40%, #0e0520 100%)',
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
    cardBg: 'linear-gradient(160deg, #020d1a 0%, #082f49 40%, #020d1a 100%)',
    oc: '#0369a1', oc2: '#67e8f9',
    topBand: 'linear-gradient(135deg,#082f49,#0c4a6e,#0369a1)',
    signBg: 'rgba(6,182,212,0.05)',
    signBorder: 'rgba(6,182,212,0.18)',
  },
}

// ─── RARIDADE ────────────────────────────────────────────────
const getRaridade = (score: number): { label: string; emoji: string; color: string; glow: string } => {
  if (score >= 90) return { label: 'Lendário', emoji: '⭐', color: '#FFD700', glow: 'rgba(255,215,0,0.4)' }
  if (score >= 75) return { label: 'Épico', emoji: '💜', color: '#B44FE8', glow: 'rgba(180,79,232,0.4)' }
  if (score >= 60) return { label: 'Raro', emoji: '💙', color: '#4F9EE8', glow: 'rgba(79,158,232,0.4)' }
  if (score >= 45) return { label: 'Misterioso', emoji: '🌙', color: '#8A8AB4', glow: 'rgba(138,138,180,0.3)' }
  return { label: 'Caótico', emoji: '🔥', color: '#E85A4F', glow: 'rgba(232,90,79,0.4)' }
}

// ─── TÍTULO DO PET ───────────────────────────────────────────
const TITULOS: Record<string, Record<string, Record<string, string>>> = {
  dog: {
    fogo: {
      'Áries': 'CEO do Caos', 'Leão': 'Mestre do Drama', 'Sagitário': 'Agente da Agitação',
    },
    terra: {
      'Touro': 'Guardião do Sofá', 'Virgem': 'Fiscal da Rotina', 'Capricórnio': 'CEO da Teimosia',
    },
    ar: {
      'Gêmeos': 'Especialista em Atenção', 'Libra': 'Colecionador de Mimos', 'Aquário': 'Agente do Caos',
    },
    água: {
      'Câncer': 'CEO da Carência', 'Escorpião': 'Manipulador Emocional', 'Peixes': 'Dormidor Profissional',
    },
  },
  cat: {
    fogo: {
      'Áries': 'Agente do Caos', 'Leão': 'Imperador do Drama', 'Sagitário': 'Fominha Estratégico',
    },
    terra: {
      'Touro': 'Dormidor Profissional', 'Virgem': 'Fiscal da Ração', 'Capricórnio': 'Guardião da Casa',
    },
    ar: {
      'Gêmeos': 'Mestre da Distração', 'Libra': 'Especialista em Carência', 'Aquário': 'CEO da Indiferença',
    },
    água: {
      'Câncer': 'Manipulador Emocional', 'Escorpião': 'Mestre das Sombras', 'Peixes': 'Sonhador Compulsivo',
    },
  },
}

const getTitulo = (tipo: string, elemento: string, signo: string): string => {
  return TITULOS[tipo]?.[elemento]?.[signo] ?? 'Guardião do Sofá'
}

// ─── ATRIBUTOS RPG ───────────────────────────────────────────
const getAtributos = (score: number, signo: string, elemento: string) => {
  const seed = score + signo.length + elemento.length
  const v = (base: number, offset: number) => Math.min(99, Math.max(40, base + ((seed * offset) % 23) - 11))
  return [
    { label: 'Drama', value: v(score, 3) },
    { label: 'Carência', value: v(score - 8, 7) },
    { label: 'Fome', value: v(score + 5, 5) },
    { label: 'Caos', value: v(100 - score, 11) },
    { label: 'Manipulação', value: v(score - 3, 9) },
  ]
}

// ─── FRASE DE COMPATIBILIDADE ────────────────────────────────
const getFraseCompat = (score: number, elemento: string): string => {
  const frases: Record<string, string[]> = {
    fogo: [
      'Essa intensidade não é normal.',
      'Vocês se inflamam juntos.',
      'Esse apego tem chama própria.',
      'Energia igual.',
      'Ele te escolheu.',
    ],
    terra: [
      'Estável por fora.',
      'Essa conexão foi construída no silêncio do dia a dia.',
      'Ele finge que não precisa.',
      'Rotina virou ritual.',
      'Esse vínculo cresce devagar — e não vai embora.',
    ],
    ar: [
      'Leveza com profundidade.',
      'Ele te lê sem você falar nada.',
      'Presença leve.',
      'Vocês se entendem sem precisar explicar.',
      'Esse nível de sintonia assusta um pouco.',
    ],
    água: [
      'Esse nível de carência não é coincidência — é destino.',
      'Finge indiferença.',
      'Ele manda em você.',
      'Sua presença é o único alarme que ele respeita.',
      'Alma gêmea com quatro patas.',
    ],
  }
  const list = frases[elemento] ?? frases['água']
  if (score >= 85) return list[0]
  if (score >= 70) return list[1]
  if (score >= 55) return list[2]
  if (score >= 40) return list[3]
  return list[4]
}

// ─── COPY WHATSAPP ───────────────────────────────────────────
const getShareText = (nome: string, titulo: string, raridade: string, score: number, sexo: string): string => {
  const pronome = sexo === 'femea' ? 'A' : 'O'
  return `${pronome} ${nome} foi classificado como "${titulo}" nível ${raridade} e ${score}% compatível comigo. 😂\nFaz grátis no signopet.com.br`
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

// Full ornamental card border frame — corners + edges + element motif bars
function CardFrame({ cfg, elemento }: { cfg: any; elemento: string }) {
  const c = cfg.oc
  const c2 = cfg.oc2

  // 68px elaborate corner — top-left orientation
  const cornerSvg = (
    <svg width={68} height={68} viewBox="0 0 84 84">
      <line x1="3" y1="3" x2="30" y2="30" stroke={c} strokeWidth="1.4" opacity="0.6"/>
      <circle cx="15" cy="15" r="10" fill="none" stroke={c} strokeWidth="2" opacity="0.75"/>
      <circle cx="15" cy="15" r="5" fill={c} opacity="0.82"/>
      <circle cx="15" cy="15" r="2" fill="white" opacity="0.75"/>
      <line x1="26" y1="15" x2="78" y2="15" stroke={c} strokeWidth="1.4" opacity="0.6"/>
      <line x1="15" y1="26" x2="15" y2="78" stroke={c} strokeWidth="1.4" opacity="0.6"/>
      <path d="M46,15 C47,10 54,9 55,15 C53,9 49,10 46,15Z" fill={c} opacity="0.62"/>
      <path d="M46,15 C47,20 54,21 55,15 C53,21 49,20 46,15Z" fill={c2} opacity="0.4"/>
      <path d="M15,46 C10,47 9,54 15,55 C9,53 10,49 15,46Z" fill={c} opacity="0.62"/>
      <path d="M15,46 C20,47 21,54 15,55 C21,53 20,49 15,46Z" fill={c2} opacity="0.4"/>
      <path d="M15,15 Q26,7 38,5" stroke={c2} strokeWidth="1.1" fill="none" opacity="0.45"/>
      <path d="M15,15 Q7,26 5,38" stroke={c2} strokeWidth="1.1" fill="none" opacity="0.45"/>
      <circle cx="78" cy="15" r="3" fill={c2} opacity="0.55"/>
      <circle cx="15" cy="78" r="3" fill={c2} opacity="0.55"/>
    </svg>
  )

  // Element-specific horizontal motif bar (top/bottom between corners)
  const edgeBar = elemento === 'fogo' ? (
    <svg width="100%" height={22} viewBox="0 0 300 22" preserveAspectRatio="xMidYMid meet">
      <line x1="0" y1="11" x2="118" y2="11" stroke={c} strokeWidth="1" opacity="0.5"/>
      <line x1="182" y1="11" x2="300" y2="11" stroke={c} strokeWidth="1" opacity="0.5"/>
      <path d="M150,11 L154,4 L158,11 L154,18Z" fill={c} opacity="0.75"/>
      <path d="M134,11 L137,6 L140,11 L137,16Z" fill={c2} opacity="0.5"/>
      <path d="M160,11 L163,6 L166,11 L163,16Z" fill={c2} opacity="0.5"/>
      <circle cx="120" cy="11" r="3" fill={c2} opacity="0.5"/>
      <circle cx="180" cy="11" r="3" fill={c2} opacity="0.5"/>
    </svg>
  ) : elemento === 'terra' ? (
    <svg width="100%" height={22} viewBox="0 0 300 22" preserveAspectRatio="xMidYMid meet">
      <path d="M0,11 C30,5 60,17 90,11 C120,5 140,17 150,11" stroke={c2} strokeWidth="1.1" fill="none" opacity="0.45"/>
      <path d="M150,11 C160,5 180,17 210,11 C240,5 270,17 300,11" stroke={c2} strokeWidth="1.1" fill="none" opacity="0.45"/>
      <circle cx="150" cy="11" r="6.5" fill="none" stroke={c} strokeWidth="1.5" opacity="0.72"/>
      <circle cx="150" cy="11" r="2.8" fill={c} opacity="0.88"/>
    </svg>
  ) : elemento === 'ar' ? (
    <svg width="100%" height={22} viewBox="0 0 300 22" preserveAspectRatio="xMidYMid meet">
      <line x1="0" y1="11" x2="126" y2="11" stroke={c2} strokeWidth="1" strokeDasharray="5,3" opacity="0.42"/>
      <line x1="174" y1="11" x2="300" y2="11" stroke={c2} strokeWidth="1" strokeDasharray="5,3" opacity="0.42"/>
      <polygon points="150,4 158,11 150,18 142,11" fill={c} opacity="0.82"/>
      <polygon points="132,7 138,11 132,15 126,11" fill={c2} opacity="0.5"/>
      <polygon points="168,7 174,11 168,15 162,11" fill={c2} opacity="0.5"/>
    </svg>
  ) : (
    <svg width="100%" height={22} viewBox="0 0 300 22" preserveAspectRatio="xMidYMid meet">
      <path d="M0,11 C25,3 50,19 75,11 C100,3 125,19 150,11" stroke={c2} strokeWidth="1.2" fill="none" opacity="0.55"/>
      <path d="M150,11 C175,3 200,19 225,11 C250,3 275,19 300,11" stroke={c2} strokeWidth="1.2" fill="none" opacity="0.55"/>
      <circle cx="150" cy="11" r="4.5" fill={c} opacity="0.82"/>
    </svg>
  )

  return (
    <div style={{position:'absolute', inset:0, pointerEvents:'none', zIndex:10, borderRadius:28, overflow:'hidden'}}>
      {/* Triple border lines */}
      <div style={{position:'absolute', inset:4,  borderRadius:24, border:`2px solid ${c}`,  opacity:0.7,  boxSizing:'border-box'}}/>
      <div style={{position:'absolute', inset:10, borderRadius:19, border:`1px solid ${c}`,  opacity:0.42, boxSizing:'border-box'}}/>
      <div style={{position:'absolute', inset:14, borderRadius:16, border:`1px solid ${c2}`, opacity:0.26, boxSizing:'border-box'}}/>

      {/* Corners */}
      <div style={{position:'absolute', top:0, left:0}}>{cornerSvg}</div>
      <div style={{position:'absolute', top:0, right:0, transform:'scaleX(-1)'}}>{cornerSvg}</div>
      <div style={{position:'absolute', bottom:0, left:0, transform:'scaleY(-1)'}}>{cornerSvg}</div>
      <div style={{position:'absolute', bottom:0, right:0, transform:'scale(-1,-1)'}}>{cornerSvg}</div>

      {/* Top & bottom element motif bars */}
      <div style={{position:'absolute', top:5,    left:68, right:68}}>{edgeBar}</div>
      <div style={{position:'absolute', bottom:5, left:68, right:68}}>{edgeBar}</div>

      {/* Side midpoint diamonds */}
      <div style={{position:'absolute', top:'50%', left:4,  transform:'translateY(-50%)'}}>
        <svg width={16} height={24} viewBox="0 0 16 24"><polygon points="8,2 15,12 8,22 1,12" fill="none" stroke={c} strokeWidth="1.2" opacity="0.7"/><circle cx="8" cy="12" r="2.5" fill={c} opacity="0.8"/></svg>
      </div>
      <div style={{position:'absolute', top:'50%', right:4, transform:'translateY(-50%)'}}>
        <svg width={16} height={24} viewBox="0 0 16 24"><polygon points="8,2 15,12 8,22 1,12" fill="none" stroke={c} strokeWidth="1.2" opacity="0.7"/><circle cx="8" cy="12" r="2.5" fill={c} opacity="0.8"/></svg>
      </div>
      <div style={{position:'absolute', top:4, left:'50%', transform:'translateX(-50%)'}}>
        <svg width={24} height={16} viewBox="0 0 24 16"><polygon points="12,1 22,8 12,15 2,8" fill="none" stroke={c} strokeWidth="1.2" opacity="0.7"/><circle cx="12" cy="8" r="2.5" fill={c} opacity="0.8"/></svg>
      </div>
      <div style={{position:'absolute', bottom:4, left:'50%', transform:'translateX(-50%)'}}>
        <svg width={24} height={16} viewBox="0 0 24 16"><polygon points="12,1 22,8 12,15 2,8" fill="none" stroke={c} strokeWidth="1.2" opacity="0.7"/><circle cx="12" cy="8" r="2.5" fill={c} opacity="0.8"/></svg>
      </div>
    </div>
  )
}

const SIGNO_PARA_ELEMENTO: Record<string, string> = {
  'Áries': 'fogo', 'Leão': 'fogo', 'Sagitário': 'fogo',
  'Touro': 'terra', 'Virgem': 'terra', 'Capricórnio': 'terra',
  'Gêmeos': 'ar', 'Libra': 'ar', 'Aquário': 'ar',
  'Câncer': 'água', 'Escorpião': 'água', 'Peixes': 'água',
}

const ELEMENTO_SVG: Record<string, JSX.Element> = {
  fogo: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#c44800">
      <path d="M12 2C9 7 6 9 6 13a6 6 0 0012 0c0-4-3-6-6-11z"/>
      <path d="M12 22c-2 0-4-1.5-4-4 0-2 2-3 4-6 2 3 4 4 4 6 0 2.5-2 4-4 4z" fill="white" opacity="0.4"/>
    </svg>
  ),
  terra: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#15803d">
      <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z"/>
      <path d="M8 12c1-3 4-5 4-5s3 2 4 5c1 2 0 4-4 4s-5-2-4-4z" fill="white" opacity="0.4"/>
    </svg>
  ),
  ar: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#7c3aed">
      <path d="M4 12c0-4 3-8 8-8s8 4 8 8" stroke="#7c3aed" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M4 16c0-2 2-4 4-4h8c2 0 4 2 4 4" stroke="#7c3aed" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5"/>
    </svg>
  ),
  água: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#0369a1">
      <path d="M12 3C9 8 5 11 5 15a7 7 0 0014 0c0-4-4-7-7-12z"/>
      <path d="M9 16c0 2 1.5 3 3 3" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5"/>
    </svg>
  ),
}

const LOADING_FRASES = (nome: string, signo: string, raca: string) => [
  `${raca} + ${signo}... isso explica muita coisa.`,
  `lendo o céu do dia em que ${nome} nasceu...`,
  `cruzando raça, signo e elemento...`,
  `cruzando signo, raça e pelagem...`,
  `decifrando ${nome}...`,
]

function ResultadoInner() {
  const params = useSearchParams()
  const id = params.get('id')
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [erroMsg, setErroMsg] = useState<string | null>(null)
  const [poder, setPoder] = useState<string>('')
  const [avatarB64, setAvatarB64] = useState<string | null>('')
  const [logoB64, setLogoB64] = useState<string>('')
  const [albumCount, setAlbumCount] = useState(0)
  const [compartilhou, setCompartilhou] = useState(false)
  const [capituloZero, setCapituloZero] = useState<{
    corpo: string;
    bloqueado: string;
  } | null>(null)
  const [capituloZeroLoading, setCapituloZeroLoading] = useState(false)
  const [loadingFraseIdx, setLoadingFraseIdx] = useState(0)
  const [titulo, setTitulo] = useState<string>('')
  const [raridade, setRaridade] = useState<{ label: string; emoji: string; color: string; glow: string } | null>(null)
  const [atributos, setAtributos] = useState<{ label: string; value: number }[]>([])
  const [fraseCompat, setFraseCompat] = useState<string>('')
  const cardRef = useRef<HTMLDivElement>(null)
  const cardWrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const s = sessionStorage.getItem(`result_${id}`)
    if (s) {
      const parsed = JSON.parse(s)
      setData(parsed)
      setPoder(getPoder(
        parsed.raca,
        parsed.signo_pet,
        parsed.tipo,
        parsed.sexo || 'macho',
        Array.isArray(parsed.cor) ? parsed.cor : [],
        parsed.email || ''
      ))
      const rar = getRaridade(parsed.score)
      setRaridade(rar)
      setTitulo(getTitulo(parsed.tipo, parsed.elemento, parsed.signo_pet))
      setAtributos(getAtributos(parsed.score, parsed.signo_pet, parsed.elemento))
      setFraseCompat(getFraseCompat(parsed.score, parsed.elemento))
      logEvent('card_viewed')
      // Save pet data to Supabase (fire and forget — never blocks the user)
      fetch('/api/pet/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          owner_name:   parsed.owner_name  ?? '',
          owner_email:  parsed.email       ?? '',
          pet_name:     parsed.nome        ?? '',
          pet_type:     parsed.tipo        ?? '',
          breed:        parsed.raca        ?? '',
          sex:          parsed.sexo        ?? 'macho',
          pet_color:    Array.isArray(parsed.cor) ? parsed.cor.join(',') : (parsed.cor ?? null),
          pet_markings: parsed.marcacoes   ?? null,
          city:         parsed.city        ?? '',
          country:      parsed.country     ?? '',
          year:         parsed.year        ?? 0,
          month:        parsed.month       ?? 0,
          day:          parsed.day         ?? 0,
          hour:         parsed.hour        ?? 0,
          minute:       parsed.minute      ?? 0,
          hour_unknown: parsed.hour_unknown ?? false,
          utm_source:   parsed.utmSource   ?? null,
          utm_medium:   parsed.utmMedium   ?? null,
          utm_campaign: parsed.utmCampaign ?? null,
          referrer:     parsed.referrer    ?? null,
          signo_pet:    parsed.signo_pet   ?? null,
          signo_tutor:  parsed.signo_tutor ?? null,
          elemento:     parsed.elemento    ?? null,
          score:        parsed.score       ?? null,
          photo_url:    parsed.photo_url   ?? null,
          ref_code:     parsed.refCode     ?? null,
        }),
      }).catch(() => {}) // silently ignore errors — never blocks the user
    }
  }, [id])

  useEffect(() => {
    if (!data) return
    const key = `signopet_album_${data.nome}_${data.raca}`
    const album = JSON.parse(localStorage.getItem('signopet_album') || '[]')
    if (!album.includes(key)) {
      album.push(key)
      localStorage.setItem('signopet_album', JSON.stringify(album))
    }
    setAlbumCount(album.length)
  }, [data])

  // Capítulo zero — geração assíncrona via Gemini
  useEffect(() => {
    if (!data) return
    setCapituloZeroLoading(true)
    fetch('/api/capitulo-zero', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: data.nome,
        raca: data.raca,
        signo_pet: data.signo_pet,
        signo_tutor: data.signo_tutor,
        tipo: data.tipo,
        sexo: data.sexo ?? 'macho',
      })
    })
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d?.corpo) setCapituloZero({
          corpo: d.corpo,
          bloqueado: d.bloqueado ?? ''
        })
      })
      .catch(() => {})
      .finally(() => setCapituloZeroLoading(false))
  }, [data])

  useEffect(() => {
    if (!capituloZeroLoading) return
    const interval = setInterval(() => {
      setLoadingFraseIdx(i => (i + 1) % 5)
    }, 2500)
    return () => clearInterval(interval)
  }, [capituloZeroLoading])

  // Pré-carrega imagens como base64 assim que data estiver disponível
  useEffect(() => {
    if (!data) return
    if (data.photo_url) {
      fetch(data.photo_url)
        .then(r => r.blob())
        .then(blob => new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.readAsDataURL(blob)
        }))
        .then(b64 => setAvatarB64(b64))
        .catch(() => setAvatarB64(null))
    }
    toBase64('/logo.png').then(setLogoB64)
  }, [data])

  const logEvent = async (event_type: string) => {
    if (!id) return
    try {
      await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pet_id: id, event_type }),
      })
    } catch {}
  }

  const gerarImagem = async (): Promise<{ dataUrl: string; file: File } | null> => {
    if (!cardRef.current) return null
    const dataUrl = await htmlToImage.toPng(cardRef.current, {
      quality: 1,
      pixelRatio: 2,
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
      const texto = getShareText(data.nome || '', titulo, raridade?.label || 'Épico', data.score ?? 0, data.sexo ?? 'macho')
      if (navigator.share && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], text: texto })
          setCompartilhou(true)
          return
        } catch { /* cai no fallback */ }
      }
      const url = `https://wa.me/?text=${encodeURIComponent(texto)}`
      window.open(url, '_blank')
      setCompartilhou(true)
      logEvent('card_shared')
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
  const elementoTutor = SIGNO_PARA_ELEMENTO[data.signo_tutor] || data.elemento
  const cfgTutor = ELEMENTO_CONFIG[elementoTutor] || ELEMENTO_CONFIG.fogo

  // Header enriched title (4C)
  const artigo = data.sexo === 'femea' ? 'a' : 'o'
  const isSRD_display = !data.raca || data.raca === 'SRD / Vira-lata' || data.raca === 'SRD' || data.raca === 'Vira-lata'
  const raca_display = isSRD_display
    ? (data.tipo === 'cat' ? (data.sexo === 'femea' ? 'gata SRD' : 'gato SRD') : 'vira-lata')
    : (data.raca || '').toLowerCase()
  const nomeCapitalized = data.nome
    ? data.nome.trim().charAt(0).toUpperCase() + data.nome.trim().slice(1)
    : '—'
  const headerTitle = `${nomeCapitalized}, ${artigo} ${raca_display} de ${data.signo_pet || ''}`

  const ELEMENTO_ATMOSFERA: Record<string, string> = {
    fogo:  'Alma de chama viva ✦',
    terra: 'Raízes fundas, presença sólida ✦',
    ar:    'Mente leve, espírito livre ✦',
    água:  'Profundo por natureza ✦',
  }

  return (
    <main className="mob-main" style={{
      background: '#f0ebe0',
      minHeight: '100vh',
      padding: '32px 16px 48px',
    }}>
      <style>{`
        @keyframes czFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 480px) {
          .mob-main         { padding: 12px 12px 24px !important; overflow-x: hidden !important; }
          .mob-card-wrap    { margin: 0 16px 12px !important; max-width: calc(100vw - 32px) !important; }
          .mob-pet-name     { font-size: 30px !important; }
          .mob-avatar       { max-height: 180px !important; width: auto !important; height: auto !important; }
          .mob-compat-block { padding: 6px 10px !important; }
          .mob-compat-pct   { font-size: 38px !important; }
          .mob-compat-label { font-size: 10px !important; }
          .mob-card-content { padding: 0 8px 6px !important; }
          .mob-signs        { padding: 6px 12px !important; margin-bottom: 2px !important; }
        }
      `}</style>
      <div style={{maxWidth: 400, margin: '0 auto'}}>

        {/* ═══════════════════════════════════════
            CARD — premium collectible card
        ═══════════════════════════════════════ */}
        {(() => {
          return (
        <div
          className="mob-card-wrap"
          ref={cardWrapRef}
          style={{
            maxWidth: 400,
            margin: '0 20px 28px',
            borderRadius: 36,
            transform: 'rotate(-3deg)',
            boxShadow: `0 0 0 2px ${cfg.oc}, 0 0 60px ${cfg.oc}77, 0 50px 120px rgba(0,0,0,0.5), 0 16px 40px rgba(0,0,0,0.3)`,
          }}
        >
          <div
            ref={cardRef}
            style={{
              background: 'transparent',
              borderRadius: 36,
              padding: '8px 8px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 0,
              background: `
                radial-gradient(ellipse 70% 50% at 50% 35%, ${cfg.oc}38 0%, transparent 70%),
                radial-gradient(ellipse 50% 40% at 25% 70%, ${cfg.oc2}22 0%, transparent 65%),
                radial-gradient(ellipse 30% 25% at 80% 20%, ${cfg.oc}18 0%, transparent 60%)
              `,
            }}>
              {/* estrelinhas como divs absolutas */}
              {([
                [40,60],[80,120],[320,80],[350,200],[60,300],
                [370,350],[90,450],[300,500],[180,40],[250,520],
                [150,180],[330,420],[70,380],[290,140],[200,560],
              ] as [number,number][]).map(([x,y], i) => (
                <div key={i} style={{
                  position: 'absolute',
                  left: x,
                  top: y,
                  width: i%3===0 ? 3 : 2,
                  height: i%3===0 ? 3 : 2,
                  borderRadius: '50%',
                  background: cfg.oc,
                  opacity: i%2===0 ? 0.5 : 0.3,
                }}/>
              ))}
            </div>
            <div
              style={{
                maxWidth: 400,
                borderRadius: 28,
                background: cfg.cardBg,
                position: 'relative',
                overflow: 'hidden',
                padding: 0,
                zIndex: 1,
              }}
            >
          <CardFrame cfg={cfg} elemento={data.elemento}/>

          {/* ── 1. HEADER BAND ── */}
          <div style={{
            background: cfg.topBand,
            borderRadius: '28px 28px 0 0',
            padding: '20px 20px 16px',
            position: 'relative',
            zIndex: 2,
          }}>
            {logoB64 && (
              <img src={logoB64} alt="SignoPet" width={32} height={32} style={{
                position: 'absolute', top: 14, right: 16,
                filter: 'brightness(0) invert(1) drop-shadow(0 1px 3px rgba(0,0,0,0.3))',
                opacity: 0.85,
              }}/>
            )}
            <div style={{
              fontSize: 17, fontFamily: 'Georgia, serif', fontWeight: 700,
              color: 'white', lineHeight: 1.3,
              marginBottom: 4, textShadow: '0 2px 8px rgba(0,0,0,0.3)',
              paddingRight: 48,
            }}>
              {headerTitle}
            </div>
            {titulo && (
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontStyle: 'italic', marginTop: 2 }}>
                {titulo}
              </div>
            )}
            {raridade && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'linear-gradient(135deg, rgba(0,0,0,0.35), rgba(0,0,0,0.2))',
                border: `1.5px solid ${raridade.color}`,
                borderRadius: 99, padding: '4px 14px', marginTop: 6,
                fontSize: 13, fontWeight: 800, color: raridade.color,
                letterSpacing: 0.8,
                boxShadow: `0 0 16px ${raridade.glow}, inset 0 0 12px rgba(255,255,255,0.05)`,
                textShadow: `0 0 12px ${raridade.glow}`
              }}>
                {raridade.emoji} {raridade.label}
              </div>
            )}
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 3, letterSpacing: 0.3 }}>
              {data.raca} + {data.signo_pet} + {data.elemento}
            </div>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <div style={{
                fontSize: 12, fontFamily: 'sans-serif', fontWeight: 700,
                color: 'rgba(255,255,255,0.75)', letterSpacing: '0.05em',
              }}>
                {cfg.emoji} {cfg.label}
              </div>
              <div style={{
                fontSize: 20, fontFamily: 'Georgia, serif', fontWeight: 800,
                color: cfg.textoSub, textShadow: `0 0 20px ${cfg.textoSub}88`,
              }}>
                {data.score ?? 0}%
              </div>
            </div>
          </div>

          {/* ── 4. AVATAR — floats on card ── */}
          <div style={{textAlign:'center', margin:'14px auto', position:'relative', zIndex:2}}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarB64 || data.photo_url || ''}
              alt={data.nome}
              width={220}
              height={220}
              style={{objectFit:'cover', display:'block', margin:'0 auto', width:220, height:220, borderRadius:'50%', border:`3px solid ${cfg.oc}`, boxShadow:'0 6px 18px rgba(0,0,0,0.15)', filter:'drop-shadow(0 4px 24px rgba(0,0,0,0.5))'}}
            />
          </div>

          {/* ── Content area ── */}
          <div className="mob-card-content" style={{padding:'0 12px 10px', position:'relative', zIndex:2}}>

            {/* ── 3. SUPER PODER ── */}
            {poder && (
              <div style={{
                margin: '0 0 8px',
                padding: '18px 20px',
                background: `radial-gradient(ellipse at 50% 0%, ${cfg.oc}28 0%, ${cfg.oc}08 70%)`,
                border: `1px solid ${cfg.oc}25`,
                borderRadius: 14,
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  background: `radial-gradient(ellipse at 50% 100%, ${cfg.oc2}18 0%, transparent 70%)`,
                  pointerEvents: 'none',
                }}/>
                <div style={{
                  fontSize: 12, letterSpacing: '0.3em', textTransform: 'uppercase',
                  fontWeight: 700, color: cfg.oc2, fontFamily: 'sans-serif',
                  marginBottom: 7, position: 'relative',
                }}>
                  ✦ super poder ✦
                </div>
                <div style={{
                  fontSize: 18, fontFamily: 'Georgia, serif', fontStyle: 'italic',
                  color: cfg.oc2, lineHeight: 1.5, fontWeight: 600,
                  position: 'relative',
                  textShadow: `0 0 20px ${cfg.oc2}44`,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical' as const,
                  overflow: 'hidden',
                }}>
                  "{poder}"
                </div>
              </div>
            )}

            {/* ── ATRIBUTOS RPG ── */}
            {atributos.length > 0 && (
              <div style={{
                margin: '0 0 8px',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: 14,
                padding: '12px 14px',
                border: '1px solid rgba(255,255,255,0.08)'
              }}>
                {atributos.map(attr => (
                  <div key={attr.label} style={{ marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                        {attr.label}
                      </span>
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)', fontWeight: 700 }}>
                        {attr.value}
                      </span>
                    </div>
                    <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 99 }}>
                      <div style={{
                        width: `${attr.value}%`, height: '100%', borderRadius: 99,
                        background: raridade ? `linear-gradient(90deg, ${raridade.color}, rgba(255,255,255,0.6))` : 'linear-gradient(90deg,#7B4F9E,#C4547A)',
                        transition: 'width 1s ease'
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── 5. SIGNS SECTION ── */}
            <div className="mob-signs" style={{
              display:'flex', alignItems:'center', justifyContent:'space-around',
              marginBottom:8,
              padding:'12px 16px',
            }}>
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:9, color:cfg.oc2, letterSpacing:'0.2em', fontWeight:700, textTransform:'uppercase', fontFamily:'sans-serif', marginBottom:4}}>PET</div>
                <div style={{fontSize:20, fontFamily:'Georgia, serif', fontWeight:800, color:cfg.oc2, marginBottom:2, textShadow:`0 0 16px ${cfg.oc2}55`}}>{data.signo_pet}</div>
                <div style={{fontSize:12, color:cfg.oc2, fontFamily:'sans-serif', fontWeight:700, letterSpacing:'0.1em', background:`${cfg.oc2}20`, padding:'2px 10px', borderRadius:999, display:'inline-block'}}>{cfg.emoji} {cfg.label}</div>
              </div>
              <div style={{width:1, height:44, background:cfg.oc, opacity:0.2}}/>
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:9, color:cfg.oc2, letterSpacing:'0.2em', fontWeight:700, textTransform:'uppercase', fontFamily:'sans-serif', marginBottom:4}}>TUTOR</div>
                <div style={{fontSize:20, fontFamily:'Georgia, serif', fontWeight:800, color:cfgTutor.oc2, marginBottom:2, textShadow:`0 0 16px ${cfgTutor.oc2}55`}}>{data.signo_tutor}</div>
                <div style={{fontSize:12, color:cfgTutor.oc2, fontFamily:'sans-serif', fontWeight:700, letterSpacing:'0.1em', background:`${cfgTutor.oc2}20`, padding:'2px 10px', borderRadius:999, display:'inline-block'}}>{cfgTutor.emoji} {cfgTutor.label}</div>
              </div>
            </div>

            {/* ── 4. COMPATIBILITY ── */}
            <div className="mob-compat-block" style={{
              margin:'0 0 8px',
              borderRadius:16,
              background:cfg.topBand,
              padding:'14px 20px',
              position:'relative',
              textAlign:'center',
            }}>
              <div style={{position:'absolute', top:7,  left:10,  fontSize:9, color:cfg.textoSub, opacity:0.5}}>✦</div>
              <div style={{position:'absolute', top:7,  right:10, fontSize:9, color:cfg.textoSub, opacity:0.5}}>✦</div>
              <div style={{position:'absolute', bottom:7, left:10,  fontSize:9, color:cfg.textoSub, opacity:0.5}}>✦</div>
              <div style={{position:'absolute', bottom:7, right:10, fontSize:9, color:cfg.textoSub, opacity:0.5}}>✦</div>
              <div style={{position:'relative', lineHeight:1, marginBottom:6}}>
                <div style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:140, height:80, background:`radial-gradient(ellipse, ${cfg.textoSub}44 0%, transparent 64%)`, zIndex:0, pointerEvents:'none'}}/>
                <span className="mob-compat-pct" style={{position:'relative', zIndex:1, fontSize:72, fontFamily:'Georgia, serif', fontWeight:700, color:cfg.textoSub, lineHeight:1, textShadow:`0 0 38px ${cfg.textoSub}aa, 0 2px 12px rgba(0,0,0,0.3)`}}>
                  {data.score}%
                </span>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' as const, letterSpacing: 2, marginTop: 4 }}>
                  compatibilidade
                </div>
              </div>
              <div className="mob-compat-label" style={{fontSize:10, color:'rgba(255,255,255,0.4)', fontFamily:'sans-serif', letterSpacing:'0.12em', marginBottom:10}}>
                compatíveis
              </div>
              <div style={{height:4, background:'rgba(255,255,255,0.12)', borderRadius:2, overflow:'hidden', marginBottom:12}}>
                <div style={{width:`${data.score}%`, height:'100%', background:cfg.compatBar, borderRadius:2}}/>
              </div>
              {fraseCompat && (
                <p style={{
                  fontSize: 15,
                  color: 'rgba(255,255,255,0.92)',
                  fontStyle: 'italic',
                  textAlign: 'center',
                  marginTop: 14,
                  marginBottom: 4,
                  lineHeight: 1.6,
                  padding: '10px 16px',
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.1)',
                  letterSpacing: 0.2
                }}>
                  &ldquo;{fraseCompat}&rdquo;
                </p>
              )}
            </div>

            {/* ── 8. FOOTER ── */}
            <div style={{textAlign:'center', padding:'6px 0 20px'}}>
              <OrnamentalDivider cfg={cfg} elemento={data.elemento}/>
              <div style={{fontSize:14, fontFamily:'Georgia, serif', fontStyle:'italic', color:cfg.oc2, fontWeight:600, letterSpacing:'0.05em', marginTop:6}}>
                🐾 gratuito em @signopet
              </div>
            </div>

          </div>
            </div>
          </div>
        </div>
          )
        })()}
        {/* END CARD */}

        {/* ── CAPÍTULO ZERO + CTA ── */}
        {(capituloZeroLoading || capituloZero) && (
          <div style={{ margin: '24px 0 8px' }}>

            {/* Linha de contexto */}
            <div style={{
              fontSize: 12,
              color: '#6b7280',
              textAlign: 'center',
              marginBottom: 12,
            }}>
              ✅ card gratuito e pronto pra compartilhar
            </div>

            {/* Loading */}
            {capituloZeroLoading && !capituloZero && (
              <div style={{ padding: '20px 0 8px', textAlign: 'center', marginBottom: 12 }}>
                <div style={{
                  fontSize: 12,
                  color: '#9ca3af',
                  marginBottom: 8,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}>
                  gerando laudo astral
                </div>
                <div style={{
                  fontSize: 18,
                  color: '#7c3aed',
                  fontWeight: 500,
                  marginBottom: 6,
                  minHeight: 20,
                  transition: 'opacity 0.4s ease',
                }}>
                  {LOADING_FRASES(
                    data?.nome ?? '...',
                    data?.signo_pet ?? '...',
                    data?.raca ?? '...'
                  )[loadingFraseIdx]}
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 6,
                  marginTop: 8,
                }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: '#7c3aed',
                      opacity: loadingFraseIdx % 3 === i ? 1 : 0.25,
                      transition: 'opacity 0.4s ease',
                    }} />
                  ))}
                </div>
              </div>
            )}

            {/* Conteúdo */}
            {capituloZero && (
              <>
                {/* Box do laudo */}
                <div style={{
                  background: 'rgba(147,51,234,0.05)',
                  border: '0.5px solid rgba(147,51,234,0.15)',
                  borderRadius: '12px 12px 0 0',
                  padding: '16px 18px',
                  position: 'relative',
                }}>
                  {/* Título grande dentro do box */}
                  <div style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: '#7c3aed',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    marginBottom: 4,
                    textAlign: 'center',
                  }}>
                    Laudo Astral · {data?.nome}
                  </div>

                  {/* Credibilidade discreta */}
                  <div style={{
                    fontSize: 11,
                    color: '#6b7280',
                    textAlign: 'center',
                    fontStyle: 'italic',
                    marginBottom: 14,
                  }}>
                    desenvolvido com astrólogos, veterinários e adestradores
                  </div>

                  {/* Label cap 1 */}
                  <div style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#7c3aed',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    marginBottom: 10,
                  }}>
                    Cap. 1 — Padrões de Comportamento
                  </div>

                  {/* Texto com fade */}
                  <div style={{
                    fontSize: 14,
                    lineHeight: 1.75,
                    color: '#1a1a2e',
                    maxHeight: 200,
                    animation: 'czFadeIn 0.6s ease',
                  }}>
                    {capituloZero.corpo}
                  </div>

                  {/* Gradiente fade-out — cor deve bater com bg do box: rgba(147,51,234,0.05) sobre #f0ebe0 */}
                  <div style={{
                    position: 'absolute',
                    bottom: -1,
                    left: 0,
                    right: 0,
                    height: 100,
                    background: 'linear-gradient(to bottom, transparent, #ede8e0)',
                    borderRadius: 0,
                    pointerEvents: 'none',
                  }} />
                </div>

                {/* Seção de unlock colada no box */}
                <div style={{
                  background: 'rgba(147,51,234,0.06)',
                  border: '0.5px solid rgba(147,51,234,0.2)',
                  borderTop: 'none',
                  borderRadius: '0 0 14px 14px',
                  padding: '20px 18px 18px',
                  textAlign: 'center',
                  marginTop: -1,
                }}>
                  <button
                    onClick={async () => { await logEvent('report_unlocked'); window.location.href = `/pagamento?pet_id=${params.get('id')}` }}
                    style={{
                      width: '100%',
                      padding: '15px',
                      background: '#7B4F9E',
                      border: 'none',
                      borderRadius: 12,
                      color: '#fff',
                      fontSize: 15,
                      fontWeight: 600,
                      cursor: 'pointer',
                      marginBottom: 12,
                    }}
                  >
                    🔒 Liberar laudo astral de {data?.nome}
                  </button>

                  <div style={{ marginBottom: 10 }}>
                    <span style={{
                      fontSize: 13,
                      color: '#9ca3af',
                      textDecoration: 'line-through',
                      marginRight: 8,
                    }}>
                      R$89,90
                    </span>
                    <span style={{
                      fontSize: 13,
                      color: '#059669',
                      fontWeight: 600,
                    }}>
                      R$37,90 — lançamento
                    </span>
                  </div>

                  <button
                    onClick={async () => { await logEvent('report_unlocked'); window.location.href = `/pagamento?pet_id=${params.get('id')}` }}
                    style={{
                      width: '100%',
                      padding: '11px',
                      background: 'transparent',
                      border: '1.5px solid rgba(147,51,234,0.4)',
                      borderRadius: 12,
                      color: '#7B4F9E',
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    Ver o que você recebe no laudo →
                  </button>

                  <div style={{
                    fontSize: 15,
                    color: '#1a1a2e',
                    fontWeight: 600,
                    marginTop: 16,
                    marginBottom: 4,
                    lineHeight: 1.4,
                  }}>
                    O card revela o signo. O laudo astral revela o animal.
                  </div>

                  <div style={{
                    fontSize: 13,
                    color: '#6b7280',
                    marginBottom: 16,
                  }}>
                    9 capítulos escritos pra {data?.nome} — não pra todo mundo.
                  </div>

                  <div style={{ fontSize: 11, color: '#9ca3af' }}>
                    signo × raça × pelagem · entrega imediata
                  </div>
                </div>
              </>
            )}
          </div>
        )}

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


        {/* ── 1. BLOCO COMPARTILHAR ── */}
        <div style={{marginBottom: 20}}>
          {/* Mock WhatsApp */}
          <div style={{
            backgroundImage: `url('/wpp-bg.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: 16, padding: 16, marginBottom: 8,
            fontFamily: 'sans-serif',
          }}>
            <div style={{fontSize: 11, color: '#667781', marginBottom: 8, textAlign: 'center'}}>
              WhatsApp • agora
            </div>
            <div style={{display: 'flex', alignItems: 'flex-end', gap: 8}}>
              <img
                src="/petala.png"
                alt="Pétala"
                style={{
                  width: 40, height: 40, borderRadius: '50%',
                  objectFit: 'cover', flexShrink: 0,
                }}
              />
              <div style={{
                background: 'white', borderRadius: '12px 12px 12px 0', padding: '10px 14px',
                maxWidth: '85%', fontSize: 14, color: '#111', lineHeight: 1.5,
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
              }}>
                {getShareText(data.nome || '', titulo, raridade?.label || 'Épico', data.score ?? 0, data.sexo ?? 'macho')}
              </div>
            </div>
          </div>

          <button
            onClick={compartilharWhatsApp}
            disabled={loading}
            style={{
              width: '100%', padding: '16px', borderRadius: 999, color: '#fff',
              fontWeight: 800, fontSize: 16, border: 'none', cursor: loading ? 'wait' : 'pointer',
              marginBottom: 8, opacity: loading ? 0.8 : 1,
              background: compartilhou
                ? 'linear-gradient(135deg,#16a34a,#15803d)'
                : 'linear-gradient(135deg,#25d366,#128c7e)',
              transition: 'background 0.3s',
            }}>
            {loading ? 'Gerando imagem... ⏳' : compartilhou ? '✓ Compartilhado! Expor de novo' : `Expor meu pet 🐾`}
          </button>
          {compartilhou && (
            <div style={{
              textAlign: 'center', fontSize: 13, color: '#16a34a',
              marginBottom: 8, fontWeight: 600,
            }}>
              Obrigado! Cada compartilhamento ajuda mais pets a serem descobertos 🐾
            </div>
          )}
        </div>

        {/* ── 4. BOTÕES SECUNDÁRIOS ── */}
        <div style={{display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 32}}>
          <button
            onClick={() => window.location.href = '/cadastro'}
            style={{
              width: '100%', padding: '12px', borderRadius: 999,
              fontWeight: 600, fontSize: 13, border: '1.5px solid #e5e7eb',
              background: 'white', color: '#6b7280', cursor: 'pointer',
            }}>
            ＋ Fazer outro pet
          </button>
          <button
            onClick={async () => {
              const texto = getShareText(data.nome || '', titulo, raridade?.label || 'Épico', data.score ?? 0, data.sexo ?? 'macho')
              const resultado = await gerarImagem()
              if (resultado) {
                const { file } = resultado
                if (navigator.share && navigator.canShare({ files: [file] })) {
                  try { await navigator.share({ files: [file], text: texto }); return } catch { /* fallback */ }
                }
              }
              window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank')
            }}
            style={{
              width: '100%', padding: '12px', borderRadius: 999,
              fontWeight: 600, fontSize: 13, border: '1.5px solid #e5e7eb',
              background: 'white', color: '#6b7280', cursor: 'pointer',
            }}>
            Ajude compartilhando o SignoPet — é grátis
          </button>
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
