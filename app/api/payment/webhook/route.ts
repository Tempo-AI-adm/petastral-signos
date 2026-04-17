import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createHmac } from 'crypto'

function validarAssinatura(req: NextRequest, body: string): boolean {
  const secret = process.env.MP_WEBHOOK_SECRET
  if (!secret) return false

  const xSignature = req.headers.get('x-signature')
  const xRequestId = req.headers.get('x-request-id')
  const dataId = req.nextUrl.searchParams.get('data.id')

  if (!xSignature) return false

  const parts = xSignature.split(',')
  const ts = parts.find(p => p.startsWith('ts='))?.split('=')[1]
  const v1 = parts.find(p => p.startsWith('v1='))?.split('=')[1]

  if (!ts || !v1) return false

  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`
  const hmac = createHmac('sha256', secret).update(manifest).digest('hex')

  return hmac === v1
}

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  )

  try {
    const bodyText = await req.text()

    if (!validarAssinatura(req, bodyText)) {
      console.warn('[webhook] assinatura inválida')
      return NextResponse.json({ error: 'Assinatura inválida' }, { status: 401 })
    }

    const body = JSON.parse(bodyText)

    if (body.type !== 'payment') {
      return NextResponse.json({ ok: true })
    }

    const mpPaymentId = String(body.data?.id)
    if (!mpPaymentId) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${mpPaymentId}`, {
      headers: { 'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}` },
    })

    if (!mpRes.ok) {
      return NextResponse.json({ error: 'Erro ao verificar pagamento' }, { status: 500 })
    }

    const mp = await mpRes.json()

    if (mp.status !== 'approved') {
      return NextResponse.json({ ok: true })
    }

    const { data: payment, error: fetchError } = await supabase
      .from('payments')
      .select('id, pet_data, email, report_unlocked')
      .eq('mp_payment_id', mpPaymentId)
      .single()

    if (fetchError || !payment) {
      return NextResponse.json({ error: 'Pagamento não encontrado' }, { status: 404 })
    }

    if (payment.report_unlocked) {
      return NextResponse.json({ ok: true })
    }

    await supabase
      .from('payments')
      .update({ status: 'paid', report_unlocked: true, updated_at: new Date().toISOString() })
      .eq('id', payment.id)

    await fetch(`${process.env.WORKER_URL || 'https://petastral-worker.onrender.com'}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        payment_id: payment.id,
        pet_data: payment.pet_data,
        email: payment.email,
      }),
    }).catch(err => console.error('[worker] erro ao disparar:', err))

    try {
      const petNome = payment.pet_data?.nome || '(sem nome)'
      const clientEmail = payment.email || '(sem email)'
      const horario = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'SignoPet <noreply@signopet.com.br>',
          to: process.env.ADMIN_EMAIL,
          subject: '💰 Nova venda SignoPet — R$37,90',
          text: `Nova venda confirmada!\nPet: ${petNome}\nEmail do cliente: ${clientEmail}\nValor: R$37,90\nHorário: ${horario}`,
        }),
      })
    } catch { /* notificação falhou — não quebra o webhook */ }

    return NextResponse.json({ ok: true })

  } catch (err) {
    console.error('[webhook] erro:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
