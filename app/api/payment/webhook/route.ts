import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  )
  try {
    const body = await req.json()

    // MP envia type=payment e data.id
    if (body.type !== 'payment') {
      return NextResponse.json({ ok: true })
    }

    const mpPaymentId = String(body.data?.id)
    if (!mpPaymentId) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    // Verificar status real no MP
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

    // Buscar payment no Supabase
    const { data: payment, error: fetchError } = await supabase
      .from('payments')
      .select('id, pet_data, email, report_unlocked')
      .eq('mp_payment_id', mpPaymentId)
      .single()

    if (fetchError || !payment) {
      return NextResponse.json({ error: 'Pagamento não encontrado' }, { status: 404 })
    }

    // Idempotência — já processado
    if (payment.report_unlocked) {
      return NextResponse.json({ ok: true })
    }

    // Marcar como pago
    await supabase
      .from('payments')
      .update({ status: 'paid', report_unlocked: true, updated_at: new Date().toISOString() })
      .eq('id', payment.id)

    // Disparar worker para gerar laudo
    fetch(`${process.env.WORKER_URL || 'https://petastral-worker.onrender.com'}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        payment_id: payment.id,
        pet_data: payment.pet_data,
        email: payment.email,
      }),
    }).catch(err => console.error('[worker] erro ao disparar:', err))

    return NextResponse.json({ ok: true })

  } catch (err) {
    console.error('[webhook] erro:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
