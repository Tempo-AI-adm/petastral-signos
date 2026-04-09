'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

const ELEMENTO_CONFIG: Record<string, any> = {
  fogo: {
    borda: 'linear-gradient(135deg,#f5a623,#e8560a,#f5a623,#ff8800,#f5a623)',
    avatarBg: 'linear-gradient(180deg,#fff8f0 0%,#ffe8cc 40%,#ffccaa 100%)',
    compatBg: 'linear-gradient(135deg,#7a1a00,#c44000)',
    compatBar: 'linear-gradient(90deg,#ff6600,#ffd580)',
    texto: '#c44800',
    textoSub: '#ffd580',
    badge: 'rgba(255,120,0,0.08)',
    badgeBorder: 'rgba(255,120,0,0.2)',
    badgeText: '#c44800',
    emoji: '🔥',
    label: 'FOGO',
    flames: true, waves: false, stars: false, crystals: false,
  },
  terra: {
    borda: 'linear-gradient(135deg,#86efac,#4ade80,#86efac,#22c55e,#86efac)',
    avatarBg: 'linear-gradient(180deg,#f0fff4 0%,#dcfce7 40%,#bbf7d0 100%)',
    compatBg: 'linear-gradient(135deg,#14532d,#166534)',
    compatBar: 'linear-gradient(90deg,#16a34a,#d4f0a0)',
    texto: '#15803d',
    textoSub: '#d4f0a0',
    badge: 'rgba(34,197,94,0.08)',
    badgeBorder: 'rgba(34,197,94,0.2)',
    badgeText: '#15803d',
    emoji: '🌿',
    label: 'TERRA',
    flames: false, waves: false, stars: false, crystals: true,
  },
  ar: {
    borda: 'linear-gradient(135deg,#c084fc,#e879a0,#a855f7,#ec4899,#c084fc)',
    avatarBg: 'linear-gradient(180deg,#faf5ff 0%,#f3e8ff 40%,#e9d5ff 100%)',
    compatBg: 'linear-gradient(135deg,#2e1065,#4c1d95)',
    compatBar: 'linear-gradient(90deg,#a855f7,#e9d5ff)',
    texto: '#7c3aed',
    textoSub: '#e9d5ff',
    badge: 'rgba(168,85,247,0.08)',
    badgeBorder: 'rgba(168,85,247,0.2)',
    badgeText: '#7c3aed',
    emoji: '💨',
    label: 'AR',
    flames: false, waves: false, stars: true, crystals: false,
  },
  água: {
    borda: 'linear-gradient(135deg,#67e8f9,#22d3ee,#67e8f9,#06b6d4,#67e8f9)',
    avatarBg: 'linear-gradient(180deg,#f0fdff 0%,#cffafe 40%,#a5f3fc 100%)',
    compatBg: 'linear-gradient(135deg,#0c4a6e,#0369a1)',
    compatBar: 'linear-gradient(90deg,#0284c7,#a5f3fc)',
    texto: '#0369a1',
    textoSub: '#a5f3fc',
    badge: 'rgba(6,182,212,0.08)',
    badgeBorder: 'rgba(6,182,212,0.2)',
    badgeText: '#0369a1',
    emoji: '💧',
    label: 'ÁGUA',
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
    'Golden Retriever': 'golden-retriever',
    'Labrador': 'labrador-amarelo',
    'Pastor Alemão': 'pastor-alemao',
    'Husky Siberiano': 'husky-preto-branco',
    'Rottweiler': 'rottweiler',
    'Dálmata': 'dalmata',
    'Beagle': 'beagle',
    'Border Collie': 'border-collie',
    'Bulldog Francês': 'bulldog-frances-caramelo',
    'Pug': 'pug-caramelo',
    'Corgi': 'corgi',
    'Pinscher': 'pinscher-caramelo',
    'Poodle': 'poodle-branco',
    'Shih Tzu': 'shih-tzu',
    'Yorkshire': 'yorkshire',
    'Chihuahua': 'chihuahua-creme',
    'Dachshund / Salsicha': 'dachshund-caramelo',
    'Maltês': 'maltes',
    'Spitz Alemão / Lulu': 'spitz-laranja',
    'Cocker Spaniel': 'cocker-caramelo',
    'Galgo': 'galgo-cinza',
    'Siamês': 'siames',
    'Persa': 'persa-branco',
    'Maine Coon': 'maine-coon',
    'Ragdoll': 'ragdoll',
  }
  if (racaMap[raca]) return racaMap[raca]
  return AVATAR_MAP[tipo]?.[porte]?.[pelagem] || 'srd-medio-claro'
}

function ResultadoInner() {
  const params = useSearchParams()
  const id = params.get('id')
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    const saved = sessionStorage.getItem(`result_${id}`)
    if (saved) setData(JSON.parse(saved))
  }, [id])

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
        <div style={{
          width:'100%', borderRadius:22, padding:8, marginBottom:24,
          background: cfg.borda,
          backgroundSize:'300% 300%',
          animation:'shimmer 4s ease infinite',
          boxShadow:'0 6px 30px rgba(168,85,247,0.2)',
        }}>
          <div style={{borderRadius:16, overflow:'hidden', background:'#fff', border:'1.5px solid rgba(200,150,255,0.15)'}}>

            {/* HEADER */}
            <div style={{padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid rgba(168,85,247,0.08)'}}>
              <div style={{display:'flex', alignItems:'center', gap:7}}>
                <Image src="/logo.png" alt="SignoPet" width={24} height={24}/>
                <span style={{fontSize:13, fontWeight:700, color:'#4c1d95', fontFamily:'sans-serif', letterSpacing:'0.02em'}}>signopet</span>
              </div>
              <div style={{background:cfg.badge, border:`1px solid ${cfg.badgeBorder}`, borderRadius:20, padding:'4px 12px'}}>
                <span style={{fontSize:11, color:cfg.badgeText, fontFamily:'sans-serif', fontWeight:700, letterSpacing:'0.04em'}}>
                  {cfg.emoji} {cfg.label} · ✦ {data.signo_pet}
                </span>
              </div>
            </div>

            {/* AVATAR AREA */}
            <div style={{position:'relative', overflow:'hidden', background:cfg.avatarBg, padding:'24px 16px 0', minHeight:290}}>

              {/* FOGO */}
              {cfg.flames && (
                <div style={{position:'absolute', bottom:0, left:0, right:0, height:110, display:'flex', alignItems:'flex-end', justifyContent:'space-around', padding:'0 2px', zIndex:1}}>
                  {[
                    {w:34,h:95,a:'flicker1',t:1.2,d:0},
                    {w:24,h:70,a:'flicker2',t:0.9,d:0.1},
                    {w:44,h:110,a:'flicker3',t:1.4,d:0},
                    {w:22,h:65,a:'flicker1',t:1.0,d:0.3},
                    {w:38,h:100,a:'flicker2',t:1.3,d:0.1},
                    {w:26,h:72,a:'flicker3',t:0.8,d:0.2},
                    {w:32,h:88,a:'flicker1',t:1.1,d:0.4},
                    {w:20,h:58,a:'flicker2',t:1.0,d:0.15},
                    {w:36,h:92,a:'flicker3',t:1.25,d:0.05},
                  ].map((f,i) => (
                    <div key={i} style={{
                      width:f.w, height:f.h,
                      background:`linear-gradient(180deg,${i%2===0?'#ffdd00':'#ffaa00'},${i%3===0?'#ff2200':'#ff4400'})`,
                      borderRadius:'50% 50% 15% 15%',
                      animation:`${f.a} ${f.t}s ease-in-out ${f.d}s infinite`,
                      transformOrigin:'bottom', opacity:0.9,
                    }}/>
                  ))}
                </div>
              )}

              {/* ÁGUA */}
              {cfg.waves && (
                <>
                  <div style={{position:'absolute', bottom:0, left:0, right:0, zIndex:1}}>
                    <svg viewBox="0 0 300 80" style={{width:'100%', height:80}}>
                      <path d="M0,40 C40,15 80,60 120,40 C160,15 200,60 240,40 C265,25 285,50 300,40 L300,80 L0,80 Z" fill="rgba(6,182,212,0.5)"/>
                      <path d="M0,50 C50,28 100,65 150,50 C200,28 250,65 300,50 L300,80 L0,80 Z" fill="rgba(14,116,144,0.45)"/>
                      <path d="M0,60 C60,42 120,72 180,60 C230,45 270,68 300,58 L300,80 L0,80 Z" fill="rgba(8,145,178,0.4)"/>
                    </svg>
                  </div>
                  {[20,80,150,220,270].map((x,i) => (
                    <div key={i} style={{
                      position:'absolute', top:20+i*18, left:x,
                      width:i%2===0?10:7, height:i%2===0?14:10,
                      borderRadius:'50%',
                      border:'2px solid rgba(6,182,212,0.5)',
                      animation:`rise ${1.5+i*0.3}s ease-out ${i*0.4}s infinite`,
                      zIndex:1,
                    }}/>
                  ))}
                </>
              )}

              {/* AR / ESTRELAS */}
              {cfg.stars && (
                <>
                  {[
                    {t:15,l:20,s:8},{t:30,l:70,s:6},{t:12,l:140,s:10},
                    {t:45,l:30,s:6},{t:20,l:200,s:8},{t:55,l:110,s:7},
                    {t:35,l:250,s:9},{t:10,l:180,s:6},{t:60,l:60,s:7},
                    {t:25,l:230,s:8},{t:50,l:160,s:6},{t:18,l:100,s:9},
                  ].map((s,i) => (
                    <div key={i} style={{
                      position:'absolute', top:s.t, left:s.l, zIndex:1,
                      width:s.s, height:s.s,
                      background:`linear-gradient(135deg,#e879a0,#a855f7)`,
                      borderRadius:'50%', opacity:0.7,
                      animation:`twinkle ${1.2+i*0.25}s ease-in-out ${i*0.15}s infinite`,
                    }}/>
                  ))}
                  <div style={{position:'absolute', bottom:0, left:0, right:0, height:60, zIndex:1, overflow:'hidden'}}>
                    <svg viewBox="0 0 300 60" style={{width:'100%', height:60}}>
                      <path d="M0,30 C30,10 60,50 90,30 C120,10 150,50 180,30 C210,10 240,50 270,30 C285,20 295,35 300,30 L300,60 L0,60 Z" fill="rgba(168,85,247,0.15)"/>
                      <path d="M0,42 C40,22 80,55 120,42 C160,22 200,55 240,42 C265,32 285,48 300,42 L300,60 L0,60 Z" fill="rgba(232,121,160,0.12)"/>
                    </svg>
                  </div>
                </>
              )}

              {/* TERRA / CRISTAIS */}
              {cfg.crystals && (
                <div style={{position:'absolute', bottom:0, left:0, right:0, height:100, zIndex:1, display:'flex', alignItems:'flex-end', justifyContent:'space-around', padding:'0 8px'}}>
                  {[
                    {w:18,h:85,c:'#4ade80'},{w:14,h:65,c:'#22c55e'},
                    {w:22,h:100,c:'#86efac'},{w:16,h:75,c:'#4ade80'},
                    {w:24,h:95,c:'#22c55e'},{w:14,h:60,c:'#86efac'},
                    {w:20,h:80,c:'#4ade80'},{w:18,h:70,c:'#16a34a'},
                    {w:12,h:55,c:'#86efac'},{w:22,h:90,c:'#22c55e'},
                  ].map((c,i) => (
                    <div key={i} style={{
                      width:c.w, height:c.h,
                      background:`linear-gradient(180deg,${c.c}dd,${c.c}66)`,
                      clipPath:'polygon(50% 0%, 100% 100%, 0% 100%)',
                      opacity:0.75,
                      animation:`crystalGrow ${1+i*0.15}s ease-in-out ${i*0.1}s infinite alternate`,
                    }}/>
                  ))}
                </div>
              )}

              {/* Partículas fogo */}
              {cfg.flames && [
                {t:20,l:25},{t:25,l:90},{t:15,r:40},{t:35,l:150},
              ].map((p,i) => (
                <div key={i} style={{
                  position:'absolute', top:p.t, left:(p as any).l, right:(p as any).r,
                  width:i%2===0?5:4, height:i%2===0?5:4,
                  background:i%2===0?'#ffaa00':'#ff8800',
                  borderRadius:'50%', zIndex:2,
                  animation:`rise ${1.8+i*0.3}s ease-out ${i*0.5}s infinite`,
                }}/>
              ))}

              {/* AVATAR */}
              <div style={{position:'relative', zIndex:2, textAlign:'center', paddingBottom:100}}>
                <div style={{
                  width:152, height:152, margin:'0 auto',
                  borderRadius:'50%',
                  background:'radial-gradient(circle,rgba(255,255,255,0.7) 0%,rgba(255,255,255,0.1) 80%,transparent 100%)',
                  border:`2px solid ${cfg.texto}33`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  overflow:'hidden',
                }}>
                  <Image
                    src={`/avatars/${avatarKey}.png`}
                    alt={data.nome}
                    width={145} height={145}
                    style={{objectFit:'contain'}}
                    onError={(e:any) => { e.target.style.display='none' }}
                  />
                </div>

                {/* NOME — tipografia grande e bold */}
                <div style={{
                  fontSize:34, fontWeight:900, color:'#1a0500',
                  fontFamily:'Georgia, serif', marginTop:12, lineHeight:1,
                  letterSpacing:'-0.5px',
                }}>{data.nome}</div>

                {/* FRASE ELEMENTO */}
                <div style={{
                  fontSize:14, color:cfg.texto, fontStyle:'italic',
                  fontFamily:'sans-serif', marginTop:5, fontWeight:600,
                }}>{data.frase_pet}</div>
              </div>
            </div>

            {/* COMPATIBILIDADE */}
            <div style={{background:cfg.compatBg, padding:'18px 20px', textAlign:'center'}}>
              <div style={{
                fontSize:11, color:'rgba(255,255,255,0.45)',
                fontFamily:'sans-serif', letterSpacing:'0.1em',
                marginBottom:4, textTransform:'uppercase', fontWeight:600,
              }}>
                {data.nome} e você
              </div>
              <div style={{display:'flex', alignItems:'baseline', justifyContent:'center', gap:8, marginBottom:10}}>
                <span style={{
                  fontSize:56, fontWeight:900, color:cfg.textoSub,
                  fontFamily:'Georgia, serif', lineHeight:1,
                  textShadow:`0 0 30px ${cfg.textoSub}66`,
                }}>
                  {data.score}%
                </span>
                <span style={{fontSize:14, color:'rgba(255,255,255,0.5)', fontFamily:'sans-serif'}}>compatíveis</span>
              </div>
              <div style={{height:5, background:'rgba(255,255,255,0.1)', borderRadius:3, overflow:'hidden'}}>
                <div style={{width:`${data.score}%`, height:'100%', background:cfg.compatBar, borderRadius:3}}/>
              </div>
            </div>

            {/* RECADO IRÔNICO */}
            <div style={{padding:'16px 20px', background:'#fff', borderBottom:'1px solid rgba(168,85,247,0.08)'}}>
              <div style={{
                fontSize:10, color:'#c084fc', fontFamily:'sans-serif',
                fontWeight:700, letterSpacing:'0.1em', marginBottom:8, textAlign:'center',
              }}>
                {data.nome.toUpperCase()} DEIXOU UM RECADO:
              </div>
              <div style={{
                fontSize:15, color:'#2d0a4e', fontStyle:'italic',
                fontFamily:'Georgia, serif', textAlign:'center', lineHeight:1.65,
                fontWeight:500,
              }}>
                "{data.frase_compat}"
              </div>
            </div>

            {/* SIGNOS */}
            <div style={{padding:'12px 20px', background:'#fafafa', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:9, color:'#9ca3af', fontFamily:'sans-serif', letterSpacing:'0.1em', marginBottom:3, fontWeight:600}}>PET</div>
                <div style={{fontSize:15, color:'#1a0a2e', fontFamily:'sans-serif', fontWeight:700}}>✦ {data.signo_pet}</div>
                <div style={{fontSize:10, color:cfg.texto, fontFamily:'sans-serif', fontWeight:600}}>{cfg.emoji} {cfg.label}</div>
              </div>
              <div style={{width:1, height:32, background:'rgba(168,85,247,0.15)'}}/>
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:9, color:'#9ca3af', fontFamily:'sans-serif', letterSpacing:'0.1em', marginBottom:3, fontWeight:600}}>TUTOR</div>
                <div style={{fontSize:15, color:'#1a0a2e', fontFamily:'sans-serif', fontWeight:700}}>✦ {data.signo_tutor}</div>
                <div style={{fontSize:10, color:cfg.texto, fontFamily:'sans-serif', fontWeight:600}}>{cfg.emoji} {cfg.label}</div>
              </div>
            </div>

            {/* RODAPÉ */}
            <div style={{padding:'10px 20px', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', borderTop:'1px solid rgba(168,85,247,0.08)'}}>
              <span style={{fontSize:11, color:'#c4b5fd', fontFamily:'sans-serif', fontStyle:'italic', letterSpacing:'0.03em', fontWeight:500}}>
                gratuito em @signopet
              </span>
            </div>

          </div>
        </div>

        {/* BOTÃO COMPARTILHAR */}
        <button style={{
          width:'100%', padding:'16px', borderRadius:999, color:'#fff',
          fontWeight:800, fontSize:16, border:'none', cursor:'pointer', marginBottom:12,
          background:'linear-gradient(135deg,#a855f7,#ec4899)',
          letterSpacing:'0.02em',
        }}>
          Compartilhar no Instagram 📸
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
        @keyframes rise{0%{opacity:0.8;transform:translateY(0) scale(1)}100%{opacity:0;transform:translateY(-55px) scale(0.2)}}
        @keyframes twinkle{0%,100%{opacity:0.2;transform:scale(1)}50%{opacity:1;transform:scale(1.6)}}
        @keyframes crystalGrow{0%{transform:scaleY(0.88)}100%{transform:scaleY(1.08)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.7}}
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
