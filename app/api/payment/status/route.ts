import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(req: NextRequest) {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  )
  const paymentId = req.nextUrl.searchParams.get('payment_id')
  if (!paymentId) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })

  const { data, error } = await supabase
    .from('payments')
    .select('status, report_unlocked, report_id, laudo_status')
    .eq('id', paymentId)
    .single()
    .throwOnError()

  if (error || !data) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })

  return NextResponse.json(
    { status: data.status, report_unlocked: data.report_unlocked, report_id: data.report_id, laudo_status: data.laudo_status },
    { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
  )
}
