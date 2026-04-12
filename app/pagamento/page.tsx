'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function PagamentoInner() {
  const params = useSearchParams()
  const petId = params.get('pet_id')

  const [step, setStep] = useState<'loading' | 'pix' | 'polling' | 'success' | 'error'>('loading')
  const [qrCode, setQrCode] = useState('')
  const [qrBase64, setQrBase64] = useState('')
  const [paymentId, setPaymentId] = useState('')
  const [reportId, setReportId] = useState('')
  const [petNome, setPetNome] = useState('')
  const [copiado, setCopiado] = useState(false)

  useEffect(() => {
    const s = sessionStorage.getItem(`result_${petId}`)
    if (!s) { setStep('error'); return }
    const pet = JSON.parse(s)
    setPetNome(pet.nome || 'seu pet')

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
    const interval = setInterval(async () => {
      if (!paymentId) return
      const res = await fetch(`/api/payment/status?payment_id=${paymentId}`)
      const data = await res.json()
      if (data.status === 'paid') {
        clearInterval(interval)
        if (data.report_id) setReportId(data.report_id)
        setStep('success')
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [step, paymentId])

  const copiarCodigo = () => {
    navigator.clipboard.writeText(qrCode)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 3000)
  }

  if (step === 'loading') return (
    <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f0ebe0'}}>
      <div style={{textAlign:'center'}}>
        <div style={{fontSize:40, marginBottom:12}}>🔮</div>
        <p style={{color:'#6b7280'}}>Gerando seu Pix...</p>
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

  useEffect(() => {
    if (step !== 'success') return
    const timer = setTimeout(() => {
      window.location.href = reportId ? `/laudo/${reportId}` : `/resultado?id=${petId}`
    }, 3000)
    return () => clearTimeout(timer)
  }, [step, reportId, petId])

  if (step === 'success') return (
    <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f0ebe0'}}>
      <div style={{textAlign:'center', padding:24, maxWidth:360}}>
        <div style={{fontSize:48, marginBottom:12}}>🎉</div>
        <div style={{fontSize:22, fontWeight:800, color:'#1a1a2e', marginBottom:8}}>
          Pagamento confirmado!
        </div>
        <p style={{color:'#6b7280', lineHeight:1.6}}>
          Abrindo seu laudo...
        </p>
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

          <button
            onClick={copiarCodigo}
            style={{
              width:'100%', padding:'13px', borderRadius:999,
              fontWeight:700, fontSize:14, border:'2px solid #a855f7',
              background: copiado ? '#a855f7' : 'white',
              color: copiado ? 'white' : '#a855f7',
              cursor:'pointer', transition:'all 0.2s', marginBottom:12,
            }}>
            {copiado ? '✓ Código copiado!' : '📋 Copiar código Pix'}
          </button>

          <div style={{fontSize:12, color:'#9ca3af'}}>
            Pagamento via Pix · R$19,90 · Liberação imediata
          </div>
        </div>

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
