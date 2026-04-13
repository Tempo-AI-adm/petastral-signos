'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function PagamentoInner() {
  const params = useSearchParams()
  const petId = params.get('pet_id')

  const [step, setStep] = useState<'loading' | 'pix' | 'polling' | 'success' | 'timeout' | 'error'>('loading')
  const [qrCode, setQrCode] = useState('')
  const [qrBase64, setQrBase64] = useState('')
  const [paymentId, setPaymentId] = useState('')
  const [reportId, setReportId] = useState('')
  const [petNome, setPetNome] = useState('')
  const [petSigno, setPetSigno] = useState('')
  const [copiado, setCopiado] = useState(false)
  const [fraseIdx, setFraseIdx] = useState(0)
  const [fraseVisible, setFraseVisible] = useState(true)
  const [laudoMsg, setLaudoMsg] = useState<'generating' | 'ready' | 'button'>('generating')

  useEffect(() => {
    const s = sessionStorage.getItem(`result_${petId}`)
    if (!s) { setStep('error'); return }
    const pet = JSON.parse(s)
    setPetNome(pet.nome || 'seu pet')
    setPetSigno(pet.signo_pet || '')

    fetch('/api/payment/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pet_data: pet, email: pet.email }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.error) { setStep('error'); return }
        setQrCode(data.qr_code)
        setQrBase64(data.qr_code_base64)
        setPaymentId(data.payment_id)
        setStep('pix')
      })
      .catch(() => setStep('error'))
  }, [petId])

  // Polling de status
  useEffect(() => {
    if (step !== 'pix' && step !== 'polling') return

    let paid = false
    let attempts = 0
    let paidAttempts = 0
    const MAX_ATTEMPTS = 100       // 100 × 3s = 5min timeout geral antes do paid
    const MAX_PAID_ATTEMPTS = 30   // 30 × 3s = 90s após paid para aguardar report_id

    const interval = setInterval(async () => {
      if (!paymentId) return

      const res = await fetch(`/api/payment/status?payment_id=${paymentId}`)
      const data = await res.json()

      if (!paid && data.status === 'paid') {
        paid = true
        setStep('success')
      }

      if (paid) {
        paidAttempts++

        if (data.report_id) {
          clearInterval(interval)
          setReportId(data.report_id)
          return
        }

        if (paidAttempts >= MAX_PAID_ATTEMPTS) {
          clearInterval(interval)
          setStep('timeout')
          return
        }
      } else {
        attempts++
        if (attempts >= MAX_ATTEMPTS) {
          clearInterval(interval)
          setStep('timeout')
        }
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [step, paymentId])

  // Verificação imediata ao voltar para a aba após paid
  useEffect(() => {
    if (step !== 'success' || !paymentId) return

    const handleVisibility = async () => {
      if (document.visibilityState !== 'visible') return
      const res = await fetch(`/api/payment/status?payment_id=${paymentId}`)
      const data = await res.json()
      if (data.report_id) {
        setReportId(data.report_id)
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [step, paymentId])

  // Frases rotativas na tela de sucesso
  useEffect(() => {
    if (step !== 'success' || laudoMsg !== 'generating') return
    const NUM_FRASES = 10
    const t = setInterval(() => {
      setFraseVisible(false)
      setTimeout(() => {
        setFraseIdx(i => (i + 1) % NUM_FRASES)
        setFraseVisible(true)
      }, 400)
    }, 3000)
    return () => clearInterval(t)
  }, [step, laudoMsg])

  // Quando report_id chega: mostra "Laudo pronto!" por 1s depois exibe botão
  useEffect(() => {
    if (!reportId) return
    setLaudoMsg('ready')
    const t = setTimeout(() => setLaudoMsg('button'), 1000)
    return () => clearTimeout(t)
  }, [reportId])

  const copiarCodigo = () => {
    navigator.clipboard.writeText(qrCode)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 3000)
  }

  if (step === 'loading') return (
    <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f0ebe0'}}>
      <div style={{textAlign:'center'}}>
        <div style={{fontSize:40, marginBottom:12}}>🔮</div>
        <p style={{color:'#6b7280'}}>Gerando laudo completo...</p>
      </div>
    </div>
  )

  if (step === 'error') return (
    <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f0ebe0'}}>
      <div style={{textAlign:'center', padding:24}}>
        <div style={{fontSize:40, marginBottom:12}}>😕</div>
        <p style={{color:'#6b7280', marginBottom:16}}>Algo deu errado. Tente novamente.</p>
        <button onClick={() => window.history.back()} style={{padding:'12px 24px', borderRadius:999, background:'#a855f7', color:'white', border:'none', fontWeight:700, cursor:'pointer'}}>
          Voltar
        </button>
      </div>
    </div>
  )

  const frases = [
    `Localizando ${petNome} no mapa astral... 🔭`,
    `Cruzando o jeito de ser de ${petNome} com a posição dos planetas... 🪐`,
    `Isso vai explicar muita coisa que você já desconfiava... 😂`,
    `Analisando a dinâmica entre vocês dois... 💫`,
    `Preparando os 10 capítulos só sobre ${petNome}... 📖`,
    `Os astros estão conversando. ${petNome} também, provavelmente. 🐾`,
    `Quase pronto — prepare-se para entender tudo. ✨`,
    `Aqui não tem achismo — tem dado astronômico sobre ${petNome}. 📊`,
    `${petNome} não é difícil. Só tem personalidade forte. Você vai entender. 😅`,
    `Gerando PDF cósmico... brincadeira, é melhor que PDF. 📱`,
  ]

  if (step === 'success') return (
    <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f0ebe0'}}>
      <div style={{textAlign:'center', padding:24, maxWidth:360}}>
        <div style={{fontSize:48, marginBottom:12}}>🎉</div>
        <div style={{fontSize:22, fontWeight:800, color:'#1a1a2e', marginBottom:20}}>
          Pagamento confirmado!
        </div>

        {laudoMsg === 'generating' && (
          <>
            <div style={{
              opacity: fraseVisible ? 1 : 0,
              transition: 'opacity 0.4s ease',
              fontSize:15, fontStyle:'italic', color:'#6b7280', lineHeight:1.6, minHeight:52,
            }}>
              {frases[fraseIdx]}
            </div>
            <div style={{fontSize:12, color:'#9ca3af', marginTop:12}}>
              Isso pode levar até 2 minutinhos ⏳
            </div>
          </>
        )}

        {laudoMsg === 'ready' && (
          <div style={{fontSize:22, fontWeight:800, color:'#a855f7'}}>
            Laudo pronto! 🎉
          </div>
        )}

        {laudoMsg === 'button' && (
          <button
            onClick={() => { window.location.href = `/laudo/${reportId}` }}
            style={{
              width:'100%', padding:'16px', borderRadius:999,
              fontWeight:800, fontSize:17, border:'none', cursor:'pointer',
              background:'linear-gradient(135deg,#a855f7,#ec4899)',
              color:'white', marginBottom:12,
            }}
          >
            Ver laudo de {petNome} →
          </button>
        )}

        <p style={{color:'#a855f7', fontWeight:600, fontSize:13, marginTop:16}}>
          Seu laudo também foi enviado para o seu email 📩
        </p>
      </div>
    </div>
  )

  if (step === 'timeout') return (
    <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f0ebe0'}}>
      <div style={{textAlign:'center', padding:24, maxWidth:360}}>
        <div style={{fontSize:48, marginBottom:12}}>📩</div>
        <div style={{fontSize:20, fontWeight:800, color:'#1a1a2e', marginBottom:12}}>
          Seu laudo está sendo gerado
        </div>
        <p style={{color:'#6b7280', lineHeight:1.6, marginBottom:24}}>
          Você receberá o laudo completo por email em instantes.
        </p>
        <a
          href={`/resultado?id=${petId}`}
          style={{
            display:'inline-block', padding:'13px 28px', borderRadius:999,
            background:'#a855f7', color:'white', fontWeight:700, fontSize:14,
            textDecoration:'none',
          }}
        >
          Ver card gratuito
        </a>
      </div>
    </div>
  )

  return (
    <main style={{background:'#f0ebe0', minHeight:'100vh', padding:'32px 16px 48px'}}>
      <div style={{maxWidth:400, margin:'0 auto'}}>

        <div style={{textAlign:'center', marginBottom:24}}>
          <div style={{fontSize:13, color:'#9ca3af', marginBottom:4}}>Desbloqueando laudo de</div>
          <div style={{fontSize:26, fontWeight:800, color:'#1a1a2e'}}>{petNome}</div>
        </div>

        {/* ── PREVIEW DO LAUDO ── */}
        <div style={{background:'white', borderRadius:20, padding:20, marginBottom:16}}>
          <div style={{fontSize:11, fontWeight:600, color:'#9ca3af', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:12}}>
            O que você vai receber:
          </div>
          <div style={{background:'#faf5ff', borderRadius:12, padding:'12px 14px', marginBottom:14}}>
            {[
              `Sol em ${petSigno || '…'}: Essência, Comportamento e Personalidade`,
              `Lua: Emoções, Necessidades e Vínculo com o Tutor`,
              `Elementos Astrológicos: O Ambiente e a Energia Ideal`,
              `Mercúrio: Como ${petNome} Se Comunica`,
              `Vênus: Relacionamentos e Conexões`,
              `Marte: Energia, Atividade e Comportamento`,
              `Júpiter: Sorte, Descobertas e Expansão`,
              `Saturno: Desafios e Aprendizados`,
              `Urano, Netuno e Plutão: Transformações e Propósito`,
              `Pilar de Bem-Estar: Dicas Práticas`,
            ].map((titulo, i) => (
              <div key={i} style={{display:'flex', gap:8, alignItems:'flex-start', marginBottom: i < 9 ? 7 : 0}}>
                <span style={{fontSize:11, fontWeight:700, color:'#a855f7', minWidth:16, lineHeight:'18px'}}>{i + 1}.</span>
                <span style={{fontSize:12, color:'#4b3f6b', lineHeight:'18px'}}>{titulo}</span>
              </div>
            ))}
          </div>
          <div style={{position:'relative', maxHeight:60, overflow:'hidden'}}>
            <div style={{fontSize:12, fontStyle:'italic', color:'#6b7280', lineHeight:1.6}}>
              {petNome} tem padrões de comportamento muito específicos — e a maioria dos tutores acha que é personalidade, mas tem uma explicação mais profunda. O laudo revela o que está por trás de cada hábito, reação e forma de demonstrar afeto...
            </div>
            <div style={{position:'absolute', bottom:0, left:0, right:0, height:'60%', background:'linear-gradient(to bottom, transparent, white)'}}/>
          </div>
        </div>

        <div style={{background:'white', borderRadius:20, padding:24, marginBottom:16, textAlign:'center'}}>
          <div style={{fontSize:13, fontWeight:600, color:'#6b7280', marginBottom:16}}>
            Escaneie o QR Code ou use o código Pix
          </div>

          {qrBase64 && (
            <img
              src={`data:image/png;base64,${qrBase64}`}
              alt="QR Code Pix"
              style={{width:200, height:200, margin:'0 auto 16px', display:'block'}}
            />
          )}

          <div style={{textAlign:'center', fontSize:13, marginBottom:12}}>
            <s style={{color:'#9ca3af'}}>R$39,90</s>{' '}
            <span style={{color:'#a855f7', fontWeight:700}}>por R$19,90</span>
            <span style={{color:'#9ca3af'}}> · pagamento único · acesso vitalício</span>
          </div>

          <button
            onClick={copiarCodigo}
            style={{
              width:'100%', padding:'13px', borderRadius:999,
              fontWeight:700, fontSize:14, border:'2px solid #a855f7',
              background: copiado ? '#a855f7' : 'white',
              color: copiado ? 'white' : '#a855f7',
              cursor:'pointer', transition:'all 0.2s', marginBottom:16,
            }}>
            {copiado ? '✓ Código copiado!' : '📋 Copiar código Pix'}
          </button>

          <div style={{textAlign:'left', marginBottom:16}}>
            {[
              `10 capítulos sobre ${petNome}`,
              'Personalidade profunda',
              'Pontos fortes e desafios',
              'Dinâmica com o dono',
              'Acesso imediato e vitalício',
            ].map(item => (
              <div key={item} style={{fontSize:13, color:'#4b3f6b', marginBottom:6, display:'flex', alignItems:'center', gap:8}}>
                <span style={{color:'#a855f7', fontWeight:700}}>✔</span> {item}
              </div>
            ))}
          </div>

          <div style={{fontSize:12, color:'#9ca3af', marginBottom:16}}>
            Pagamento via Pix · R$19,90 · Liberação imediata
          </div>
        </div>

        <button
          onClick={() => window.history.back()}
          style={{
            width:'100%', padding:'13px', borderRadius:999,
            fontWeight:600, fontSize:13, border:'1.5px solid #d1d5db',
            background:'transparent', color:'#9ca3af', cursor:'pointer',
            marginBottom:8,
          }}>
          ← Voltar ao card gratuito
        </button>

        <div style={{background:'white', borderRadius:16, padding:16, textAlign:'center'}}>
          <div style={{fontSize:13, color:'#6b7280', marginBottom:4}}>
            {step === 'polling' ? '⏳ Verificando pagamento...' : '⏳ Aguardando pagamento...'}
          </div>
          <div style={{fontSize:12, color:'#9ca3af'}}>
            A página atualiza automaticamente
          </div>
        </div>

      </div>
    </main>
  )
}

export default function Pagamento() {
  return (
    <Suspense>
      <PagamentoInner />
    </Suspense>
  )
}
