'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

const ELEMENTO_CONFIG: Record<string, {
  bg: string, bgCard: string, border: string,
  text: string, sub: string, bar: string,
  emoji: string, label: string,
  flames: boolean, waves: boolean, stars: boolean, crystals: boolean,
}> = {
  fogo:  { bg:'#0f0500', bgCard:'linear-gradient(180deg,#5a1800,#a03000,#e05000)',
            border:'#e8820a', text:'#ffd580', sub:'#c8a060', bar:'linear-gradient(90deg,#c44800,#ffd580)',
            emoji:'🔥', label:'Fogo', flames:true, waves:false, stars:false, crystals:false },
  terra: { bg:'#050f00', bgCard:'linear-gradient(180deg,#1a3a00,#2d6600,#4a9900)',
            border:'#6abf30', text:'#d4f0a0', sub:'#a0c870', bar:'linear-gradient(90deg,#2d6600,#d4f0a0)',
            emoji:'🌿', label:'Terra', flames:false, waves:false, stars:false, crystals:true },
  ar:    { bg:'#03050f', bgCard:'linear-gradient(180deg,#0a1040,#1a2880,#3050c0)',
            border:'#7090f0', text:'#c0d0ff', sub:'#8090cc', bar:'linear-gradient(90deg,#1a2880,#c0d0ff)',
            emoji:'💨', label:'Ar', flames:false, waves:false, stars:true, crystals:false },
  água:  { bg:'#00050f', bgCard:'linear-gradient(180deg,#001840,#003070,#0060a0)',
            border:'#30a0e0', text:'#a0d8f0', sub:'#70a8c8', bar:'linear-gradient(90deg,#003070,#a0d8f0)',
            emoji:'💧', label:'Água', flames:false, waves:true, stars:false, crystals:false },
}

const AVATAR_MAP: Record<string, Record<string, Record<string, string>>> = {
  dog: {
    pequeno: { claro:'cao-pequeno-curto-claro', escuro:'cao-pequeno-curto-escuro', mesclado:'cao-pequeno-curto-mesclado' },
    medio:   { claro:'cao-medio-curto-claro',   escuro:'cao-medio-curto-escuro',   mesclado:'cao-medio-curto-mesclado' },
    grande:  { claro:'cao-grande-curto-claro',  escuro:'cao-grande-curto-escuro',  mesclado:'cao-grande-curto-mesclado' },
  },
  cat: {
    pequeno: { claro:'gato-curto-claro', escuro:'gato-curto-escuro', mesclado:'gato-curto-mesclado' },
    medio:   { claro:'gato-curto-claro', escuro:'gato-curto-escuro', mesclado:'gato-curto-mesclado' },
    grande:  { claro:'gato-longo-claro', escuro:'gato-longo-escuro', mesclado:'gato-longo-mesclado' },
  },
}

function getAvatar(tipo: string, porte: string, pelagem: string) {
  return AVATAR_MAP[tipo]?.[porte]?.[pelagem] || 'cao-medio-curto-claro'
}

function Stars({ count, total = 5, color }: { count: number, total?: number, color: string }) {
  return (
    <span>{Array.from({length: total}, (_, i) => (
      <span key={i} style={{color: i < count ? color : 'rgba(255,255,255,0.2)', fontSize:14}}>★</span>
    ))}</span>
  )
}

function ResultadoInner() {
  const params = useSearchParams()
  const id = params.get('id')
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = sessionStorage.getItem(`result_${id}`)
    if (saved) { setData(JSON.parse(saved)); setLoading(false) }
    else setLoading(false)
  }, [id])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="text-5xl mb-4 animate-pulse">🔮</div>
        <p className="text-gray-400">Calculando compatibilidade...</p>
      </div>
    </div>
  )

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <p className="text-gray-400 mb-4">Resultado não encontrado.</p>
        <Link href="/cadastro" className="text-purple-500 underline">Tentar novamente</Link>
      </div>
    </div>
  )

  const cfg = ELEMENTO_CONFIG[data.elemento] || ELEMENTO_CONFIG.fogo
  const avatarKey = getAvatar(data.tipo, data.porte, data.pelagem)

  return (
    <main style={{background: '#f9f8ff', minHeight: '100vh', padding: '2rem 1rem'}}>
      <div style={{maxWidth: 380, margin: '0 auto'}}>

        {/* Header */}
        <div style={{display:'flex', justifyContent:'center', marginBottom: '1.5rem'}}>
          <Image src="/logo.png" alt="SignoPet" width={48} height={48} />
        </div>

        {/* CARD */}
        <div style={{
          width: '100%', borderRadius: 24, overflow: 'hidden',
          padding: 10, marginBottom: 24,
          background: 'linear-gradient(135deg,#f5c842,#f0a000,#f5c842,#e8860a)',
          boxShadow: `0 8px 32px ${cfg.border}66`,
        }}>
          <div style={{borderRadius: 13, overflow: 'hidden', background: cfg.bg, border: `2px solid ${cfg.border}44`}}>

            {/* Topo do card */}
            <div style={{position:'relative', background: cfg.bgCard, padding: '16px 16px 0', minHeight: 300, overflow:'hidden'}}>

              {/* Badges */}
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 10, position:'relative', zIndex:2}}>
                <div style={{background:'rgba(0,0,0,0.5)', borderRadius: 20, padding:'4px 12px', border:`1px solid ${cfg.border}66`}}>
                  <span style={{color: cfg.text, fontSize: 11, fontWeight: 600, letterSpacing:'0.05em'}}>{cfg.emoji} {cfg.label.toUpperCase()}</span>
                </div>
                <div style={{background:'rgba(0,0,0,0.5)', borderRadius: 20, padding:'4px 12px', border:`1px solid ${cfg.border}66`}}>
                  <span style={{color: cfg.text, fontSize: 12}}>✦ {data.signo_pet}</span>
                </div>
              </div>

              {/* Nome centralizado */}
              <div style={{textAlign:'center', position:'relative', zIndex:2, paddingBottom: 80}}>
                <div style={{fontSize: 34, fontWeight: 700, color: '#fff', fontFamily:'serif', textShadow:'0 2px 12px rgba(0,0,0,0.6)'}}>{data.nome}</div>
                <div style={{fontSize: 13, color: cfg.text, fontStyle:'italic', marginTop: 4}}>{data.frase_pet}</div>
                <div style={{fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing:'0.1em', marginTop: 6, textTransform:'uppercase'}}>{data.raca} · {data.sexo}</div>

                {/* Avatar */}
                <div style={{margin:'14px auto 0', width: 150, height: 150, borderRadius:'50%',
                  background:`radial-gradient(circle, ${cfg.border}22 0%, ${cfg.border}44 70%, transparent 100%)`,
                  border:`1.5px solid ${cfg.border}33`,
                  display:'flex', alignItems:'center', justifyContent:'center', position:'relative'}}>
                  <Image
                    src={`/avatars/${avatarKey}.png`}
                    alt={data.nome}
                    width={130} height={130}
                    style={{objectFit:'contain'}}
                    onError={(e: any) => { e.target.style.display='none' }}
                  />
                </div>
              </div>

              {/* Chamas (fogo) */}
              {cfg.flames && (
                <div style={{position:'absolute', bottom:0, left:0, right:0, height:75, display:'flex', alignItems:'flex-end', justifyContent:'space-around', padding:'0 4px', zIndex:1}}>
                  {[55,42,68,38,62,44,58].map((h,i) => (
                    <div key={i} style={{width: i%2===0?22:18, height: h,
                      background:'linear-gradient(180deg,#ff8800,#ff2200)',
                      borderRadius:'50% 50% 15% 15%', opacity: 0.85,
                      transformOrigin:'bottom', animation:`flicker${(i%3)+1} ${0.8+i*0.1}s ease-in-out infinite`}} />
                  ))}
                </div>
              )}

              {/* Ondas (água) */}
              {cfg.waves && (
                <div style={{position:'absolute', bottom:0, left:0, right:0, height:40, zIndex:1}}>
                  <svg viewBox="0 0 300 40" style={{width:'100%', height:40}}>
                    <path d="M0,20 C50,5 100,35 150,20 C200,5 250,35 300,20 L300,40 L0,40 Z" fill="rgba(0,150,255,0.3)" />
                    <path d="M0,25 C60,10 120,38 180,25 C240,10 270,35 300,25 L300,40 L0,40 Z" fill="rgba(0,100,200,0.3)" />
                  </svg>
                </div>
              )}

              {/* Estrelas (ar) */}
              {cfg.stars && [20,60,120,180,240,280].map((x,i) => (
                <div key={i} style={{position:'absolute', top: 20+i*15, left: x,
                  width: i%2===0?6:4, height: i%2===0?6:4,
                  background: cfg.text, borderRadius:'50%', zIndex:1, opacity:0.6,
                  animation:`twinkle ${1+i*0.3}s ease-in-out infinite`}} />
              ))}

              {/* Cristais (terra) */}
              {cfg.crystals && (
                <div style={{position:'absolute', bottom:0, left:0, right:0, height:50, zIndex:1, display:'flex', alignItems:'flex-end', justifyContent:'space-around'}}>
                  {[30,50,40,60,35,45].map((h,i) => (
                    <div key={i} style={{width:12, height: h,
                      background:`linear-gradient(180deg,${cfg.text},${cfg.border})`,
                      clipPath:'polygon(50% 0%, 100% 100%, 0% 100%)', opacity:0.5}} />
                  ))}
                </div>
              )}
            </div>

            {/* Faixa info */}
            <div style={{padding:'4px 12px 5px', background:'rgba(0,0,0,0.3)', borderTop:`1px solid ${cfg.border}33`}}>
              <div style={{fontSize:9, color:'rgba(255,255,255,0.3)', fontFamily:'serif', textAlign:'center', fontStyle:'italic', padding:'3px 0'}}>
                {data.raca} · {data.porte} · pelo {data.pelo}
              </div>
            </div>

            {/* Body do card */}
            <div style={{background: cfg.bg, padding: 12}}>

              {/* Compatibilidade */}
              <div style={{background:'rgba(255,255,255,0.05)', border:`1px solid ${cfg.border}33`, borderRadius:12, padding:12, marginBottom:10}}>
                <div style={{fontSize:9, color: cfg.border, fontWeight:600, letterSpacing:'0.08em', marginBottom:8, fontFamily:'sans-serif'}}>
                  COMPATIBILIDADE COM {data.signo_tutor.toUpperCase()}
                </div>
                <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:8}}>
                  <div style={{flex:1, height:8, background:'rgba(255,255,255,0.07)', borderRadius:4, overflow:'hidden'}}>
                    <div style={{width:`${data.score}%`, height:'100%', background: cfg.bar, borderRadius:4}} />
                  </div>
                  <div style={{fontSize:22, fontWeight:700, color: cfg.text, minWidth:44, textAlign:'right'}}>{data.score}%</div>
                </div>
                <div style={{fontSize:12, color: cfg.sub, fontStyle:'italic', textAlign:'center', lineHeight:1.5}}>
                  {data.frase_compat}
                </div>
              </div>

              {/* Stats */}
              <div style={{display:'flex', gap:6, marginBottom:12}}>
                {Object.entries(data.stats).map(([k,v]:any) => (
                  <div key={k} style={{flex:1, background:'rgba(255,255,255,0.05)', border:`1px solid ${cfg.border}22`, borderRadius:8, padding:'6px 4px', textAlign:'center'}}>
                    <div style={{fontSize:8, color: cfg.border, fontWeight:600, fontFamily:'sans-serif', marginBottom:2}}>{k.toUpperCase()}</div>
                    <Stars count={v} color={cfg.text} />
                  </div>
                ))}
              </div>

              {/* Rodapé */}
              <div style={{borderTop:`1px solid ${cfg.border}22`, paddingTop:8, display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                <div style={{fontSize:8, color:'rgba(255,255,255,0.2)', fontFamily:'sans-serif'}}>N° 001 · RARA</div>
                <div style={{display:'flex', alignItems:'center', gap:5}}>
                  <svg viewBox="0 0 100 100" width={16} height={16}>
                    <ellipse cx="50" cy="72" rx="28" ry="18" fill="none" stroke="white" strokeWidth="5"/>
                    <ellipse cx="30" cy="38" rx="14" ry="14" fill="white"/>
                    <ellipse cx="52" cy="28" rx="10" ry="10" fill="white"/>
                    <ellipse cx="70" cy="32" rx="10" ry="10" fill="white"/>
                    <ellipse cx="76" cy="52" rx="13" ry="13" fill="white"/>
                  </svg>
                  <span style={{fontSize:10, color:'rgba(255,255,255,0.3)', letterSpacing:'0.06em'}}>signopet</span>
                </div>
                <div style={{fontSize:8, color:'rgba(255,255,255,0.2)'}}>◆</div>
              </div>
            </div>
          </div>
        </div>

        {/* Botão compartilhar */}
        <button style={{width:'100%', padding:'16px', borderRadius:999, color:'#fff', fontWeight:700, fontSize:16,
          background:'linear-gradient(135deg,#a855f7,#ec4899)', border:'none', cursor:'pointer', marginBottom:12}}>
          Compartilhar no Instagram 📸
        </button>

        {/* Upsell */}
        <div style={{background:'#fff', border:'1px solid #f0e0ff', borderRadius:20, padding:20, textAlign:'center'}}>
          <div style={{fontSize:22, marginBottom:8}}>🔮</div>
          <div style={{fontSize:16, fontWeight:700, color:'#1a1a2e', marginBottom:6}}>
            Quer entender por que vocês são {data.score}% compatíveis?
          </div>
          <div style={{fontSize:13, color:'#6b7280', marginBottom:16, lineHeight:1.5}}>
            Laudo completo com 9 capítulos sobre {data.nome} — personalidade, missão de vida, como se relaciona com você e muito mais.
          </div>
          <button style={{width:'100%', padding:'14px', borderRadius:999, color:'#fff', fontWeight:700, fontSize:15,
            background:'linear-gradient(135deg,#a855f7,#ec4899)', border:'none', cursor:'pointer', marginBottom:8}}>
            Ver laudo completo — R$19,90
          </button>
          <div style={{fontSize:11, color:'#d1d5db'}}>De R$39,90 · Pagamento único · Entrega em até 5 min</div>
        </div>

      </div>
    </main>
  )
}

export default function Resultado() {
  return (
    <Suspense>
      <ResultadoInner />
    </Suspense>
  )
}
