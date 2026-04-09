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
    cardBg: [
      'radial-gradient(ellipse at 12% 8%, rgba(196,72,0,0.18) 0%, transparent 42%)',
      'radial-gradient(ellipse at 88% 8%, rgba(196,72,0,0.18) 0%, transparent 42%)',
      'radial-gradient(ellipse at 12% 95%, rgba(120,30,0,0.22) 0%, transparent 42%)',
      'radial-gradient(ellipse at 88% 95%, rgba(120,30,0,0.22) 0%, transparent 42%)',
      'linear-gradient(160deg, #fef8ed 0%, #fdf2e0 50%, #f8e8cc 100%)',
    ].join(', '),
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
    cardBg: [
      'radial-gradient(ellipse at 12% 8%, rgba(21,128,61,0.14) 0%, transparent 42%)',
      'radial-gradient(ellipse at 88% 8%, rgba(21,128,61,0.14) 0%, transparent 42%)',
      'radial-gradient(ellipse at 12% 95%, rgba(5,46,22,0.22) 0%, transparent 42%)',
      'radial-gradient(ellipse at 88% 95%, rgba(5,46,22,0.22) 0%, transparent 42%)',
      'linear-gradient(160deg, #f8fff4 0%, #f0fce8 50%, #e8f5d8 100%)',
    ].join(', '),
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
    cardBg: [
      'radial-gradient(ellipse at 12% 8%, rgba(124,58,237,0.14) 0%, transparent 42%)',
      'radial-gradient(ellipse at 88% 8%, rgba(124,58,237,0.14) 0%, transparent 42%)',
      'radial-gradient(ellipse at 12% 95%, rgba(46,16,101,0.22) 0%, transparent 42%)',
      'radial-gradient(ellipse at 88% 95%, rgba(46,16,101,0.22) 0%, transparent 42%)',
      'linear-gradient(160deg, #fefbff 0%, #faf5ff 50%, #f3e8ff 100%)',
    ].join(', '),
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
    cardBg: [
      'radial-gradient(ellipse at 12% 8%, rgba(3,105,161,0.14) 0%, transparent 42%)',
      'radial-gradient(ellipse at 88% 8%, rgba(3,105,161,0.14) 0%, transparent 42%)',
      'radial-gradient(ellipse at 12% 95%, rgba(8,47,73,0.22) 0%, transparent 42%)',
      'radial-gradient(ellipse at 88% 95%, rgba(8,47,73,0.22) 0%, transparent 42%)',
      'linear-gradient(160deg, #f8fdff 0%, #f0faff 50%, #e0f5fc 100%)',
    ].join(', '),
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

function FogoBotanical({ cfg }: { cfg: any }) {
  const c = cfg.oc2
  const c2 = cfg.oc
  return (
    <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',zIndex:0,pointerEvents:'none'}} viewBox="0 0 320 280" preserveAspectRatio="xMidYMid slice">
      <path d="M18,280 C16,258 24,246 18,230 C27,244 32,252 27,268Z" fill={c} opacity="0.28"/>
      <path d="M36,280 C34,263 40,255 36,244 C44,255 47,263 43,274Z" fill={c2} opacity="0.22"/>
      <path d="M302,280 C304,258 296,246 302,230 C293,244 288,252 293,268Z" fill={c} opacity="0.28"/>
      <path d="M284,280 C286,263 280,255 284,244 C276,255 273,263 277,274Z" fill={c2} opacity="0.22"/>
      <circle cx="58" cy="242" r="2.5" fill={c} opacity="0.28"/>
      <circle cx="72" cy="222" r="1.8" fill={c2} opacity="0.22"/>
      <circle cx="48" cy="205" r="1.5" fill={c} opacity="0.18"/>
      <circle cx="262" cy="242" r="2.5" fill={c} opacity="0.28"/>
      <circle cx="248" cy="222" r="1.8" fill={c2} opacity="0.22"/>
      <circle cx="272" cy="205" r="1.5" fill={c} opacity="0.18"/>
      <path d="M8,185 Q14,174 10,162" stroke={c} strokeWidth="1.2" fill="none" opacity="0.2"/>
      <path d="M312,185 Q306,174 310,162" stroke={c} strokeWidth="1.2" fill="none" opacity="0.2"/>
      <circle cx="10" cy="162" r="2" fill={c2} opacity="0.18"/>
      <circle cx="310" cy="162" r="2" fill={c2} opacity="0.18"/>
    </svg>
  )
}

function AguaBotanical({ cfg }: { cfg: any }) {
  const c = cfg.oc2
  const c2 = cfg.oc
  return (
    <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',zIndex:0,pointerEvents:'none'}} viewBox="0 0 320 280" preserveAspectRatio="xMidYMid slice">
      <path d="M0,238 C42,222 84,252 126,238 C168,222 210,252 252,238 C278,228 304,244 320,238" stroke={c} strokeWidth="1.4" fill="none" opacity="0.28"/>
      <path d="M0,260 C52,246 104,268 156,258 C208,246 264,266 320,258" stroke={c2} strokeWidth="1" fill="none" opacity="0.2"/>
      <path d="M14,182 C14,173 22,165 22,176 C22,185 14,190 14,182Z" fill={c} opacity="0.25"/>
      <path d="M306,182 C306,173 298,165 298,176 C298,185 306,190 306,182Z" fill={c} opacity="0.25"/>
      <path d="M6,212 C6,205 12,200 12,209 C12,216 6,220 6,212Z" fill={c2} opacity="0.2"/>
      <path d="M314,212 C314,205 308,200 308,209 C308,216 314,220 314,212Z" fill={c2} opacity="0.2"/>
      <circle cx="38" cy="252" r="2.2" fill={c} opacity="0.25"/>
      <circle cx="282" cy="252" r="2.2" fill={c} opacity="0.25"/>
      <circle cx="18" cy="232" r="1.5" fill={c2} opacity="0.2"/>
      <circle cx="302" cy="232" r="1.5" fill={c2} opacity="0.2"/>
    </svg>
  )
}

function ArBotanical({ cfg }: { cfg: any }) {
  const c = cfg.oc
  return (
    <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',zIndex:0,pointerEvents:'none'}} viewBox="0 0 320 280" preserveAspectRatio="xMidYMid slice">
      <path d="M0,222 C42,204 84,234 126,218 C168,202 210,228 252,214 C282,204 308,218 320,212" stroke={c} strokeWidth="1.1" fill="none" opacity="0.18"/>
      <path d="M0,252 C52,238 108,262 160,248 C212,234 268,258 320,246" stroke={c} strokeWidth="0.9" fill="none" opacity="0.12"/>
      <path d="M28,152 L30,146 L32,152 L38,154 L32,156 L30,162 L28,156 L22,154Z" fill={c} opacity="0.22"/>
      <path d="M292,152 L294,146 L296,152 L302,154 L296,156 L294,162 L292,156 L286,154Z" fill={c} opacity="0.22"/>
      <path d="M12,200 L13.5,196 L15,200 L19,202 L15,204 L13.5,208 L12,204 L8,202Z" fill={c} opacity="0.18"/>
      <path d="M308,200 L309.5,196 L311,200 L315,202 L311,204 L309.5,208 L308,204 L304,202Z" fill={c} opacity="0.18"/>
      <circle cx="58" cy="232" r="1.8" fill={c} opacity="0.22"/>
      <circle cx="262" cy="232" r="1.8" fill={c} opacity="0.22"/>
      <circle cx="78" cy="172" r="1.2" fill={c} opacity="0.18"/>
      <circle cx="242" cy="172" r="1.2" fill={c} opacity="0.18"/>
      <circle cx="18" cy="165" r="1" fill={c} opacity="0.15"/>
      <circle cx="302" cy="165" r="1" fill={c} opacity="0.15"/>
    </svg>
  )
}

function TerraBotanical({ cfg }: { cfg: any }) {
  const c = cfg.oc
  return (
    <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',zIndex:0,pointerEvents:'none'}} viewBox="0 0 320 280" preserveAspectRatio="xMidYMid slice">
      <path d="M0,280 C18,246 8,208 28,185 C48,162 38,142 60,132" stroke={c} strokeWidth="1.5" fill="none" opacity="0.24"/>
      <path d="M28,185 C48,175 54,158 70,163" stroke={c} strokeWidth="1" fill="none" opacity="0.18"/>
      <path d="M60,132 C66,116 76,112 72,132 C68,121 64,118 60,132Z" fill={c} opacity="0.22"/>
      <path d="M28,185 C34,168 45,164 40,183 C37,173 33,170 28,185Z" fill={c} opacity="0.2"/>
      <ellipse cx="70" cy="163" rx="7" ry="4.5" fill={c} opacity="0.18" transform="rotate(-30 70 163)"/>
      <path d="M320,280 C302,246 312,208 292,185 C272,162 282,142 260,132" stroke={c} strokeWidth="1.5" fill="none" opacity="0.24"/>
      <path d="M292,185 C272,175 266,158 250,163" stroke={c} strokeWidth="1" fill="none" opacity="0.18"/>
      <path d="M260,132 C254,116 244,112 248,132 C252,121 256,118 260,132Z" fill={c} opacity="0.22"/>
      <path d="M292,185 C286,168 275,164 280,183 C283,173 287,170 292,185Z" fill={c} opacity="0.2"/>
      <ellipse cx="250" cy="163" rx="7" ry="4.5" fill={c} opacity="0.18" transform="rotate(30 250 163)"/>
      <circle cx="82" cy="148" r="3" fill={c} opacity="0.2"/>
      <circle cx="238" cy="148" r="3" fill={c} opacity="0.2"/>
      <circle cx="44" cy="205" r="2.2" fill={c} opacity="0.16"/>
      <circle cx="276" cy="205" r="2.2" fill={c} opacity="0.16"/>
    </svg>
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

// Full ornamental card border frame — corners + edges
function CardFrame({ cfg, elemento }: { cfg: any; elemento: string }) {
  const c = cfg.oc
  const c2 = cfg.oc2

  // Shared botanical corner SVG (top-left oriented; mirrored for other corners)
  const cornerSvg = (
    <svg width={56} height={56} viewBox="0 0 66 66">
      {/* Outer corner rosette */}
      <circle cx="14" cy="14" r="7.5" fill="none" stroke={c} strokeWidth="1.5" opacity="0.48"/>
      <circle cx="14" cy="14" r="3" fill={c} opacity="0.6"/>
      {/* Horizontal arm */}
      <line x1="22" y1="14" x2="56" y2="14" stroke={c} strokeWidth="1" opacity="0.3"/>
      {/* Vertical arm */}
      <line x1="14" y1="22" x2="14" y2="56" stroke={c} strokeWidth="1" opacity="0.3"/>
      {/* Leaf on horizontal arm */}
      <path d="M34,14 C35,10 40,9 41,14 C39,9 37,10 34,14Z" fill={c} opacity="0.42"/>
      <path d="M34,14 C35,18 40,19 41,14 C39,19 37,18 34,14Z" fill={c2} opacity="0.26"/>
      {/* Leaf on vertical arm */}
      <path d="M14,34 C10,35 9,40 14,41 C9,39 10,37 14,34Z" fill={c} opacity="0.42"/>
      <path d="M14,34 C18,35 19,40 14,41 C19,39 18,37 14,34Z" fill={c2} opacity="0.26"/>
      {/* Diagonal flourish curves from center */}
      <path d="M14,14 Q22,7 31,5" stroke={c2} strokeWidth="0.9" fill="none" opacity="0.36"/>
      <path d="M14,14 Q7,22 5,31" stroke={c2} strokeWidth="0.9" fill="none" opacity="0.36"/>
      {/* Arm-end dots */}
      <circle cx="56" cy="14" r="1.8" fill={c2} opacity="0.36"/>
      <circle cx="14" cy="56" r="1.8" fill={c2} opacity="0.36"/>
      {/* Small inner accent dot */}
      <circle cx="14" cy="14" r="1" fill="white" opacity="0.55"/>
    </svg>
  )

  return (
    <div style={{position:'absolute', inset:0, pointerEvents:'none', zIndex:10, borderRadius:28, overflow:'hidden'}}>

      {/* Double-line border frame */}
      <div style={{
        position:'absolute', inset:4, borderRadius:24,
        border:`2px solid ${c}`,
        opacity:0.65, boxSizing:'border-box',
      }}/>
      <div style={{
        position:'absolute', inset:8, borderRadius:21,
        border:`1px solid ${c2}`,
        opacity:0.45, boxSizing:'border-box',
      }}/>

      {/* ── CORNERS ── */}
      <div style={{position:'absolute', top:0, left:0}}>{cornerSvg}</div>
      <div style={{position:'absolute', top:0, right:0, transform:'scaleX(-1)'}}>{cornerSvg}</div>
      <div style={{position:'absolute', bottom:0, left:0, transform:'scaleY(-1)'}}>{cornerSvg}</div>
      <div style={{position:'absolute', bottom:0, right:0, transform:'scale(-1,-1)'}}>{cornerSvg}</div>

      {/* ── TOP EDGE ornament ── */}
      <div style={{position:'absolute', top:5, left:66, right:66, height:18, display:'flex', alignItems:'center'}}>
        <svg width="100%" height={18} viewBox="0 0 208 18" preserveAspectRatio="xMidYMid meet">
          <line x1="0" y1="9" x2="76" y2="9" stroke={c} strokeWidth="0.8" opacity="0.26"/>
          <line x1="132" y1="9" x2="208" y2="9" stroke={c} strokeWidth="0.8" opacity="0.26"/>
          <circle cx="104" cy="9" r="5.5" fill="none" stroke={c} strokeWidth="1" opacity="0.42"/>
          <circle cx="104" cy="9" r="2.2" fill={c} opacity="0.5"/>
          <circle cx="76" cy="9" r="2" fill={c2} opacity="0.3"/>
          <circle cx="132" cy="9" r="2" fill={c2} opacity="0.3"/>
          <path d="M84,9 C90,4 98,4 104,9" stroke={c2} strokeWidth="0.8" fill="none" opacity="0.36"/>
          <path d="M104,9 C110,4 118,4 124,9" stroke={c2} strokeWidth="0.8" fill="none" opacity="0.36"/>
        </svg>
      </div>

      {/* ── BOTTOM EDGE ornament ── */}
      <div style={{position:'absolute', bottom:5, left:66, right:66, height:18, display:'flex', alignItems:'center'}}>
        <svg width="100%" height={18} viewBox="0 0 208 18" preserveAspectRatio="xMidYMid meet">
          <line x1="0" y1="9" x2="76" y2="9" stroke={c} strokeWidth="0.8" opacity="0.26"/>
          <line x1="132" y1="9" x2="208" y2="9" stroke={c} strokeWidth="0.8" opacity="0.26"/>
          <circle cx="104" cy="9" r="5.5" fill="none" stroke={c} strokeWidth="1" opacity="0.42"/>
          <circle cx="104" cy="9" r="2.2" fill={c} opacity="0.5"/>
          <circle cx="76" cy="9" r="2" fill={c2} opacity="0.3"/>
          <circle cx="132" cy="9" r="2" fill={c2} opacity="0.3"/>
          <path d="M84,9 C90,4 98,4 104,9" stroke={c2} strokeWidth="0.8" fill="none" opacity="0.36"/>
          <path d="M104,9 C110,4 118,4 124,9" stroke={c2} strokeWidth="0.8" fill="none" opacity="0.36"/>
        </svg>
      </div>

      {/* ── LEFT EDGE dots ── */}
      <div style={{
        position:'absolute', top:66, bottom:66, left:5, width:14,
        display:'flex', flexDirection:'column', justifyContent:'space-evenly', alignItems:'center',
      }}>
        {[0,1,2,3,4,5].map(i => (
          <div key={i} style={{
            width: i % 3 === 0 ? 4 : 2.5,
            height: i % 3 === 0 ? 4 : 2.5,
            borderRadius: '50%',
            background: c,
            opacity: i % 3 === 0 ? 0.28 : 0.16,
          }}/>
        ))}
      </div>

      {/* ── RIGHT EDGE dots ── */}
      <div style={{
        position:'absolute', top:66, bottom:66, right:5, width:14,
        display:'flex', flexDirection:'column', justifyContent:'space-evenly', alignItems:'center',
      }}>
        {[0,1,2,3,4,5].map(i => (
          <div key={i} style={{
            width: i % 3 === 0 ? 4 : 2.5,
            height: i % 3 === 0 ? 4 : 2.5,
            borderRadius: '50%',
            background: c,
            opacity: i % 3 === 0 ? 0.28 : 0.16,
          }}/>
        ))}
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
            maxWidth: 360,
            margin: '0 auto 28px',
            borderRadius: 28,
            background: cfg.cardBg,
            boxShadow: [
              '0 28px 72px rgba(0,0,0,0.26)',
              '0 8px 24px rgba(0,0,0,0.14)',
              '0 2px 8px rgba(0,0,0,0.08)',
              '0 0 0 1px rgba(0,0,0,0.05)',
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
              letterSpacing: '0.3em', fontStyle: 'italic',
              fontFamily: 'Georgia, serif', marginBottom: 7,
            }}>
              MAPA ASTRAL PET
            </div>
            <div style={{
              fontSize: 22, fontFamily: 'Georgia, serif',
              fontWeight: 'bold', color: cfg.textoSub, marginBottom: 5,
              letterSpacing: '0.04em',
            }}>
              {cfg.emoji} {cfg.label}
            </div>
            <div style={{
              fontSize: 12, color: 'rgba(255,255,255,0.65)',
              letterSpacing: '0.2em', fontFamily: 'sans-serif',
            }}>
              ✦ {data.signo_pet}
            </div>
          </div>

          {/* ── 2. AVATAR ZONE — white spotlight on parchment ── */}
          <div style={{
            position: 'relative',
            minHeight: 262,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            margin: '0 16px',
          }}>
            {/* Botanical edge decorations (behind spotlight, zIndex 0) */}
            {cfg.flames && <FogoBotanical cfg={cfg}/>}
            {cfg.waves && <AguaBotanical cfg={cfg}/>}
            {cfg.stars && <ArBotanical cfg={cfg}/>}
            {cfg.crystals && <TerraBotanical cfg={cfg}/>}

            {/* White oval spotlight — pet floats here */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(ellipse 78% 82% at 50% 54%, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.82) 42%, rgba(255,255,255,0.18) 68%, transparent 100%)',
              zIndex: 1, pointerEvents: 'none',
            }}/>

            {/* Avatar */}
            <div style={{position:'relative', zIndex:3}}>
              {avatarB64
                ? <img
                    src={avatarB64}
                    alt={data.nome}
                    width={240}
                    height={240}
                    style={{objectFit:'contain', display:'block', filter:'drop-shadow(0 8px 24px rgba(0,0,0,0.18))'}}
                  />
                : <span style={{fontSize:80, display:'block', textAlign:'center', padding:'24px 0'}}>🐾</span>
              }
            </div>
          </div>

          {/* ── Parchment content area ── */}
          <div style={{padding:'0 16px 20px', position:'relative', zIndex:2}}>

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
              padding: '14px 20px 16px',
              position: 'relative',
              textAlign: 'center',
            }}>
              {/* Sparkle accents */}
              <div style={{position:'absolute', top:9, left:12, fontSize:8, color:cfg.textoSub, opacity:0.45, letterSpacing:4}}>✦ ✦</div>
              <div style={{position:'absolute', top:9, right:12, fontSize:8, color:cfg.textoSub, opacity:0.45, letterSpacing:4}}>✦ ✦</div>

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
                  fontSize:64, fontFamily:'Georgia, serif', fontWeight:700,
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
