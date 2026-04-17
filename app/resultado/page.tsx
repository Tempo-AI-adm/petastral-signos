'use client'
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
    if (temBranco && temCreme)  return 'gato-srd-branco-creme'
    if (temBranco)              return 'gato-srd-branco'
    if (temCreme)               return 'gato-srd-creme'
    return 'gato-srd-tigrado-cinza'
  }

  // Novo sistema — tenta cao-srd-[pelo]-[cor] primeiro
  if (tipo !== 'cat') {
    const cor1 = corArr[0] || ''
    const cor2 = corArr[1] || ''
    const peloKey = pelo === 'longo' ? 'longo' : 'curto'
    const novosArquivos = [
      'cao-srd-curto-preto',
      'cao-srd-curto-branco',
      'cao-srd-curto-caramelo',
      'cao-srd-curto-marrom',
      'cao-srd-curto-cinza',
      'cao-srd-curto-preto-branco',
      'cao-srd-curto-caramelo-branco',
      'cao-srd-curto-preto-marrom',
      'cao-srd-longo-preto',
      'cao-srd-longo-branco',
      'cao-srd-longo-caramelo',
      'cao-srd-longo-marrom',
      'cao-srd-longo-preto-branco',
      'cao-srd-branco',
    ]
    if (cor1 && cor2) {
      const tentativa = `cao-srd-${peloKey}-${cor1}-${cor2}`
      if (novosArquivos.includes(tentativa)) return tentativa
      const tentativa2 = `cao-srd-${peloKey}-${cor1}`
      if (novosArquivos.includes(tentativa2)) return tentativa2
    } else if (cor1) {
      const tentativa = `cao-srd-${peloKey}-${cor1}`
      if (novosArquivos.includes(tentativa)) return tentativa
    }
  }

  // Dog SRD — sistema antigo (fallback)
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
    : 'claro'

  const prefix = porte === 'pequeno'
    ? (pelo === 'longo' ? 'cao-pequeno-longo' : 'cao-pequeno-curto')
    : porte === 'grande' ? 'srd-grande' : 'srd-medio'
  return `${prefix}-${shade}`
}

function getAvatar(tipo: string, porte: string, cor: string | string[], raca: string, pelo = '', racaPredominante = '') {
  const corArr = Array.isArray(cor) ? cor : (cor ? [cor] : [])
  const has = (c: string) => corArr.includes(c)

  if (raca === 'SRD / Vira-lata' && racaPredominante) {
    const cor1 = corArr[0] || ''
    const cor2 = corArr[1] || ''
    if (cor1 && cor2) return `srd-${racaPredominante}-${cor1}-${cor2}`
    if (cor1) return `srd-${racaPredominante}-${cor1}`
    return `srd-${racaPredominante}`
  }

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
    'Bulldog Inglês':   'bulldog-ingles',
  }
  if (racaMap[raca]) return racaMap[raca]

  return getSRDAvatar(tipo, porte, corArr, pelo)
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

function ResultadoInner() {
  const params = useSearchParams()
  const id = params.get('id')
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [erroMsg, setErroMsg] = useState<string | null>(null)
  const [poder, setPoder] = useState<string>('')
  const [avatarB64, setAvatarB64] = useState<string>('')
  const [logoB64, setLogoB64] = useState<string>('')
  const [albumCount, setAlbumCount] = useState(0)
  const [compartilhou, setCompartilhou] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const s = sessionStorage.getItem(`result_${id}`)
    if (s) {
      const parsed = JSON.parse(s)
      setData(parsed)
      const sessionKey = `${parsed.nome}_${parsed.raca}`
      setPoder(getPoder(parsed.raca, parsed.signo_pet, parsed.tipo, sessionKey))
      logEvent('card_viewed')
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

  // Pré-carrega imagens como base64 assim que data estiver disponível
  useEffect(() => {
    if (!data) return
    const avatarKey = getAvatar(data.tipo, data.porte, data.cor, data.raca, data.pelo, data.racaPredominante)
    const avatarPath = `/avatars/${avatarKey}.png`
    toBase64(avatarPath).then(b64 => {
      setAvatarB64(b64)
    })
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
      const pronome = data.sexo === 'femea' ? 'ela' : 'ele'
      const texto = `Eu sou ${data.score}% compatível com ${data.nome} 🐾 Será que você bate mais com o seu? signopet.com.br`
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
        @media (max-width: 480px) {
          .mob-main         { padding: 12px 12px 24px !important; }
          .mob-card-wrap    { margin-bottom: 12px !important; }
          .mob-logo-pad     { padding-top: 16px !important; }
          .mob-pet-name     { font-size: 30px !important; }
          .mob-avatar       { max-height: 180px !important; width: auto !important; height: auto !important; }
          .mob-compat-block { padding: 6px 10px !important; }
          .mob-compat-pct   { font-size: 38px !important; }
          .mob-compat-label { font-size: 10px !important; }
          .mob-card-content { padding: 0 8px 6px !important; }
          .mob-phrase-wrap  { padding: 4px 10px 4px !important; }
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
              background: '#ffffff',
              borderRadius: 36,
              padding: '24px 20px',
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

          {/* ── 1. LOGO (inside card) ── */}
          <div className="mob-logo-pad" style={{textAlign:'center', padding:'16px 16px 8px', paddingTop:32, position:'relative', zIndex:2}}>
            {logoB64
              ? <img src={logoB64} alt="SignoPet" width={44} height={44} style={{filter:'drop-shadow(0 2px 8px rgba(0,0,0,0.14))', display:'inline-block'}}/>
              : <Image src="/logo.png" alt="SignoPet" width={44} height={44}/>
            }
          </div>

          {/* ── 2. THIN DIVIDER ── */}
          <div style={{padding:'0 20px 6px', position:'relative', zIndex:2}}>
            <OrnamentalDivider cfg={cfg} elemento={data.elemento}/>
          </div>

          {/* ── 3. PET NAME BADGE ── */}
          <div style={{textAlign:'center', padding:'0 20px 0', position:'relative', zIndex:2}}>
            <div style={{
              display:'inline-block',
              border:`1.5px solid ${cfg.oc}55`,
              borderRadius:999,
              padding:'8px 24px',
              background:`${cfg.oc}0d`,
            }}>
              <div className="mob-pet-name" style={{
                fontSize:42, fontFamily:'Georgia, serif', fontWeight:800,
                color:cfg.oc, letterSpacing:'0.02em', lineHeight:1.1,
              }}>
                {data.nome}
              </div>
            </div>
            {poder && (
              <div style={{
                margin: '12px 16px 0',
                padding: '14px 18px',
                background: `radial-gradient(ellipse at 50% 0%, ${cfg.oc}22 0%, ${cfg.oc}06 70%)`,
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
                  fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase',
                  fontWeight: 700, color: cfg.oc, fontFamily: 'sans-serif',
                  marginBottom: 7, opacity: 0.6, position: 'relative',
                }}>
                  ✦ super poder ✦
                </div>
                <div style={{
                  fontSize: 16, fontFamily: 'Georgia, serif', fontStyle: 'italic',
                  color: cfg.oc, lineHeight: 1.5, fontWeight: 600,
                  position: 'relative',
                  textShadow: `0 0 20px ${cfg.oc}44`,
                }}>
                  "{poder}"
                </div>
              </div>
            )}
          </div>

          {/* ── 4. AVATAR — floats on card ── */}
          <div style={{textAlign:'center', margin:'8px auto', position:'relative', zIndex:2}}>
            {avatarB64
              ? <img
                  src={avatarB64}
                  alt={data.nome}
                  width={280}
                  height={280}
                  className="mob-avatar"
                  style={{objectFit:'contain', display:'block', margin:'0 auto', filter:'drop-shadow(0 6px 18px rgba(0,0,0,0.15))'}}
                />
              : <span style={{fontSize:80, display:'block', textAlign:'center'}}>🐾</span>
            }
          </div>

          {/* ── Content area ── */}
          <div className="mob-card-content" style={{padding:'0 12px 10px', position:'relative', zIndex:2}}>

            {/* ── 5+6. COMPATIBILITY + FRASE UNIFICADOS ── */}
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
              <div style={{fontSize:10, color:'rgba(255,255,255,0.48)', letterSpacing:'0.22em', textTransform:'uppercase', fontFamily:'sans-serif', fontWeight:700, marginBottom:8}}>
                {data.nome.toUpperCase()} E VOCÊ
              </div>
              <div style={{position:'relative', lineHeight:1, marginBottom:6}}>
                <div style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:140, height:80, background:`radial-gradient(ellipse, ${cfg.textoSub}44 0%, transparent 64%)`, zIndex:0, pointerEvents:'none'}}/>
                <span className="mob-compat-pct" style={{position:'relative', zIndex:1, fontSize:72, fontFamily:'Georgia, serif', fontWeight:700, color:cfg.textoSub, lineHeight:1, textShadow:`0 0 38px ${cfg.textoSub}aa, 0 2px 12px rgba(0,0,0,0.3)`}}>
                  {data.score}%
                </span>
              </div>
              <div className="mob-compat-label" style={{fontSize:10, color:'rgba(255,255,255,0.4)', fontFamily:'sans-serif', letterSpacing:'0.12em', marginBottom:10}}>
                compatíveis
              </div>
              <div style={{height:4, background:'rgba(255,255,255,0.12)', borderRadius:2, overflow:'hidden', marginBottom:12}}>
                <div style={{width:`${data.score}%`, height:'100%', background:cfg.compatBar, borderRadius:2}}/>
              </div>
              <div style={{fontSize:15, fontFamily:'Georgia, serif', fontStyle:'italic', color:cfg.textoSub, lineHeight:1.5, opacity:0.85, marginBottom:8}}>
                "{data.frase_compat}"
              </div>
              <div style={{fontSize:10, fontStyle:'italic', color:cfg.textoSub, opacity:0.6, letterSpacing:'0.05em'}}>
                {ELEMENTO_ATMOSFERA[data.elemento] || ''}
              </div>
            </div>

            {/* ── 7. SIGNS SECTION ── */}
            <div className="mob-signs" style={{
              display:'flex', alignItems:'center', justifyContent:'space-around',
              marginBottom:8,
              padding:'12px 16px',
            }}>
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:9, color:cfg.oc, letterSpacing:'0.2em', fontWeight:700, textTransform:'uppercase', fontFamily:'sans-serif', marginBottom:4}}>PET</div>
                <div style={{fontSize:20, fontFamily:'Georgia, serif', fontWeight:800, color:cfg.oc, marginBottom:2, textShadow:`0 0 16px ${cfg.oc}55`}}>{data.signo_pet}</div>
                <div style={{fontSize:12, color:cfg.oc, fontFamily:'sans-serif', fontWeight:700, letterSpacing:'0.1em', background:`${cfg.oc}15`, padding:'2px 10px', borderRadius:999, display:'inline-block'}}>{cfg.emoji} {cfg.label}</div>
              </div>
              <div style={{width:1, height:44, background:cfg.oc, opacity:0.2}}/>
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:9, color:cfg.oc, letterSpacing:'0.2em', fontWeight:700, textTransform:'uppercase', fontFamily:'sans-serif', marginBottom:4}}>TUTOR</div>
                <div style={{fontSize:20, fontFamily:'Georgia, serif', fontWeight:800, color:cfgTutor.oc, marginBottom:2, textShadow:`0 0 16px ${cfgTutor.oc}55`}}>{data.signo_tutor}</div>
                <div style={{fontSize:12, color:cfgTutor.oc, fontFamily:'sans-serif', fontWeight:700, letterSpacing:'0.1em', background:`${cfgTutor.oc}15`, padding:'2px 10px', borderRadius:999, display:'inline-block'}}>{cfgTutor.emoji} {cfgTutor.label}</div>
              </div>
            </div>

            {/* ── 8. FOOTER ── */}
            <div style={{textAlign:'center', padding:'6px 0 20px'}}>
              <OrnamentalDivider cfg={cfg} elemento={data.elemento}/>
              <div style={{fontSize:14, fontFamily:'Georgia, serif', fontStyle:'italic', color:cfg.oc, fontWeight:600, letterSpacing:'0.05em', marginTop:6}}>
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
                Eu sou {data.score}% compatível com {data.nome} 🐾<br/>
                Será que você bate mais com o seu?<br/>
                <span style={{color: '#0070f3', fontSize: 13}}>signopet.com.br</span>
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
            {loading ? 'Gerando imagem... ⏳' : compartilhou ? '✓ Desafiado! Desafiar de novo' : '🐾 Desafiar outro tutor'}
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

        {/* ── 2. BLOCO LAUDO ── */}
        <div style={{marginBottom: 20}}>
          <div style={{
            fontSize: 16, fontWeight: 700, color: '#1a1a2e', textAlign: 'center',
            marginBottom: 12,
          }}>
            O card mostra quem seu pet é. O laudo explica por quê.
          </div>

          <button
            onClick={async () => { await logEvent('report_unlocked'); window.location.href = `/pagamento?pet_id=${params.get('id')}` }}
            style={{
              width: '100%', padding: '14px', borderRadius: 999,
              fontWeight: 700, fontSize: 15, border: '2px solid #a855f7',
              background: 'white', color: '#7c3aed', cursor: 'pointer',
            }}>
            Abrir laudo completo — {data.nome}
          </button>
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
              const texto = `Fiz o mapa astral do meu pet no SignoPet e somos ${data.score}% compatíveis 😱 É grátis e leva 30 segundos: signopet.com.br`
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
