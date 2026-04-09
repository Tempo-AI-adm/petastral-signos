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

function ResultadoInner() {
  const params = useSearchParams()
  const id = params.get('id')
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [erroMsg, setErroMsg] = useState<string | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const s = sessionStorage.getItem(`result_${id}`)
    if (s) setData(JSON.parse(s))
  }, [id])

  const gerarImagem = async (): Promise<{ dataUrl: string; file: File } | null> => {
    if (!cardRef.current) return null
    const dataUrl = await htmlToImage.toPng(cardRef.current, {
      quality: 1, pixelRatio: 2,
      backgroundColor: '#ffffff',
      skipFonts: true, cacheBust: true,
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
      const texto = `🐾 Descobri o signo do meu pet no SignoPet!\n${data.nome} é ${data.score}% compatível comigo 😍\nDescubra o seu: ${window.location.origin}`
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
  const avatarKey = getAvatar(data.tipo, data.porte, data.pelagem, data.raca)

  return (
    <main style={{background:'#f9f8ff', minHeight:'100vh', padding:'2rem 1rem'}}>
      <div style={{maxWidth:380, margin:'0 auto'}}>

        <div style={{display:'flex', justifyContent:'center', marginBottom:'1.5rem'}}>
          <Image src="/logo.png" alt="SignoPet" width={52} height={52}/>
        </div>

        {/* CARD */}
        <div ref={cardRef} style={{
          width:'100%', borderRadius:22, padding:8, marginBottom:24,
          background: cfg.borda, backgroundSize:'300% 300%',
          animation:'shimmer 4s ease infinite',
          boxShadow:'0 6px 30px rgba(168,85,247,0.2)',
        }}>
          <div style={{borderRadius:16, overflow:'hidden', background:'#fff', border:'1.5px solid rgba(200,150,255,0.15)'}}>

            <div style={{padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid rgba(168,85,247,0.08)'}}>
              <div style={{display:'flex', alignItems:'center', gap:7}}>
                <Image src="/logo.png" alt="SignoPet" width={24} height={24}/>
                <span style={{fontSize:12, fontWeight:700, color:'#4c1d95', fontFamily:'sans-serif'}}>signopet</span>
              </div>
              <div style={{background:cfg.badge, border:`1px solid ${cfg.badgeBorder}`, borderRadius:20, padding:'3px 10px'}}>
                <span style={{fontSize:10, color:cfg.badgeText, fontFamily:'sans-serif', fontWeight:700, letterSpacing:'0.04em'}}>
                  {cfg.emoji} {cfg.label} · ✦ {data.signo_pet}
                </span>
              </div>
            </div>

            <div style={{position:'relative', overflow:'hidden', background:cfg.avatarBg, padding:'20px 16px 0', minHeight:270}}>
              {cfg.flames && <Flames/>}
              {cfg.waves && <Waves/>}
              {cfg.stars && <Stars/>}
              {cfg.crystals && <Crystals/>}
              <div style={{position:'relative', zIndex:2, textAlign:'center', paddingBottom:85}}>
                <div style={{
                  width:152, height:152, margin:'0 auto', borderRadius:'50%',
                  background:'radial-gradient(circle,rgba(255,255,255,0.7) 0%,rgba(255,255,255,0.1) 80%,transparent 100%)',
                  border:`2px solid ${cfg.texto}33`,
                  display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden',
                }}>
                  <Image
                    src={`/avatars/${avatarKey}.png`}
                    alt={data.nome} width={145} height={145}
                    style={{objectFit:'contain'}}
                    onError={(e:any) => { e.target.style.display='none' }}
                  />
                </div>
                <div style={{fontSize:34, fontWeight:900, color:'#1a0500', fontFamily:'Georgia, serif', marginTop:10, lineHeight:1}}>{data.nome}</div>
                <div style={{fontSize:14, color:cfg.texto, fontStyle:'italic', fontFamily:'sans-serif', marginTop:3, fontWeight:600}}>{data.frase_pet}</div>
              </div>
            </div>

            <div style={{background:cfg.compatBg, padding:'18px 20px', textAlign:'center'}}>
              <div style={{fontSize:11, color:'rgba(255,255,255,0.45)', fontFamily:'sans-serif', letterSpacing:'0.1em', marginBottom:4, textTransform:'uppercase', fontWeight:600}}>
                {data.nome} e você
              </div>
              <div style={{display:'flex', alignItems:'baseline', justifyContent:'center', gap:8, marginBottom:10}}>
                <span style={{fontSize:56, fontWeight:900, color:cfg.textoSub, fontFamily:'Georgia, serif', lineHeight:1, textShadow:`0 0 30px ${cfg.textoSub}66`}}>
                  {data.score}%
                </span>
                <span style={{fontSize:14, color:'rgba(255,255,255,0.5)', fontFamily:'sans-serif'}}>compatíveis</span>
              </div>
              <div style={{height:5, background:'rgba(255,255,255,0.1)', borderRadius:3, overflow:'hidden'}}>
                <div style={{width:`${data.score}%`, height:'100%', background:cfg.compatBar, borderRadius:3}}/>
              </div>
            </div>

            <div style={{padding:'16px 20px', background:'#fff', borderBottom:'1px solid rgba(168,85,247,0.08)'}}>
              <div style={{fontSize:10, color:'#c084fc', fontFamily:'sans-serif', fontWeight:700, letterSpacing:'0.1em', marginBottom:8, textAlign:'center'}}>
                {data.nome.toUpperCase()} DEIXOU UM RECADO:
              </div>
              <div style={{fontSize:15, color:'#2d0a4e', fontStyle:'italic', fontFamily:'Georgia, serif', textAlign:'center', lineHeight:1.65, fontWeight:500}}>
                "{data.frase_compat}"
              </div>
            </div>

            <div style={{padding:'12px 20px', background:'#fafafa', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:9, color:'#9ca3af', fontFamily:'sans-serif', letterSpacing:'0.1em', marginBottom:2, fontWeight:600}}>PET</div>
                <div style={{fontSize:15, color:'#1a0a2e', fontFamily:'sans-serif', fontWeight:700}}>✦ {data.signo_pet}</div>
                <div style={{fontSize:10, color:cfg.texto, fontFamily:'sans-serif', fontWeight:600}}>{cfg.emoji} {cfg.label}</div>
              </div>
              <div style={{width:1, height:28, background:'rgba(168,85,247,0.15)'}}/>
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:9, color:'#9ca3af', fontFamily:'sans-serif', letterSpacing:'0.1em', marginBottom:2, fontWeight:600}}>TUTOR</div>
                <div style={{fontSize:15, color:'#1a0a2e', fontFamily:'sans-serif', fontWeight:700}}>✦ {data.signo_tutor}</div>
                <div style={{fontSize:10, color:cfg.texto, fontFamily:'sans-serif', fontWeight:600}}>{cfg.emoji} {ELEMENTO_CONFIG[data.elemento]?.label}</div>
              </div>
            </div>

            <div style={{padding:'10px 20px', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', borderTop:'1px solid rgba(168,85,247,0.08)'}}>
              <span style={{fontSize:11, color:'#c4b5fd', fontFamily:'sans-serif', fontStyle:'italic', letterSpacing:'0.03em'}}>
                gratuito em @signopet
              </span>
            </div>

          </div>
        </div>

        {/* MENSAGEM DE ERRO VISÍVEL NA TELA */}
        {erroMsg && (
          <div style={{background:'#fee2e2', border:'1px solid #fca5a5', borderRadius:12, padding:'12px 16px', marginBottom:12, fontSize:12, color:'#991b1b', fontFamily:'monospace', wordBreak:'break-all'}}>
            {erroMsg}
          </div>
        )}

        <button
          onClick={compartilharWhatsApp}
          disabled={loading}
          style={{
            width:'100%', padding:'16px', borderRadius:999, color:'#fff',
            fontWeight:800, fontSize:16, border:'none', cursor: loading ? 'wait' : 'pointer',
            marginBottom:10, opacity: loading ? 0.8 : 1,
            background:'linear-gradient(135deg,#25d366,#128c7e)',
            transition:'opacity 0.2s',
          }}>
          {loading ? 'Gerando imagem... ⏳' : '💬 Compartilhar no WhatsApp'}
        </button>

        <button
          onClick={salvarImagem}
          disabled={loading}
          style={{
            width:'100%', padding:'14px', borderRadius:999,
            fontWeight:700, fontSize:14, border:'2px solid #e9d5ff',
            cursor: loading ? 'wait' : 'pointer',
            marginBottom:20, opacity: loading ? 0.8 : 1,
            background:'white', color:'#7c3aed',
            transition:'opacity 0.2s',
          }}>
          {loading ? '⏳' : '📥 Salvar imagem para o Instagram'}
        </button>

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
