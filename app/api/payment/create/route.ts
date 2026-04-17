import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  )
  try {
    const body = await req.json()
    const { pet_data, email } = body

    if (!pet_data || !email) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
    }

    // Criar pagamento no Mercado Pago
    const mpRes = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': `signopet-${Date.now()}-${Math.random()}`,
      },
      body: JSON.stringify({
        transaction_amount: 37.90,
        description: `Laudo completo — ${pet_data.nome}`,
        payment_method_id: 'pix',
        payer: { email },
      }),
    })

    if (!mpRes.ok) {
      const err = await mpRes.json()
      console.error('[MP] erro:', err)
      return NextResponse.json({ error: 'Erro ao criar pagamento' }, { status: 500 })
    }

    const mp = await mpRes.json()

    // Salvar no Supabase
    const { data: payment, error } = await supabase
      .from('payments')
      .insert({
        pet_data,
        email,
        status: 'pending',
        mp_payment_id: String(mp.id),
        mp_qr_code: mp.point_of_interaction?.transaction_data?.qr_code,
        mp_qr_code_base64: mp.point_of_interaction?.transaction_data?.qr_code_base64,
        mp_ticket_url: mp.point_of_interaction?.transaction_data?.ticket_url,
      })
      .select('id')
      .single()

    if (error) {
      console.error('[Supabase] erro:', error)
      return NextResponse.json({ error: 'Erro ao salvar pagamento' }, { status: 500 })
    }

    return NextResponse.json({
      payment_id: payment.id,
      qr_code: mp.point_of_interaction?.transaction_data?.qr_code,
      qr_code_base64: mp.point_of_interaction?.transaction_data?.qr_code_base64,
      ticket_url: mp.point_of_interaction?.transaction_data?.ticket_url,
    })

  } catch (err) {
    console.error('[create] erro:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
