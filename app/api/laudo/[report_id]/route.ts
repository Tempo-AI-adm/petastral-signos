import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: NextRequest,
  { params }: { params: { report_id: string } }
) {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  )

  const { report_id } = params

  const { data: report, error: reportError } = await supabase
    .from('reports')
    .select('id, report_text, signs, created_at')
    .eq('id', report_id)
    .single()

  if (reportError || !report) {
    return NextResponse.json({ error: 'Laudo não encontrado' }, { status: 404 })
  }

  const { data: payment } = await supabase
    .from('payments')
    .select('pet_data')
    .eq('report_id', report_id)
    .single()

  const petData = payment?.pet_data || {}

  const reportText = typeof report.report_text === 'string'
    ? report.report_text
    : JSON.stringify(report.report_text)

  return NextResponse.json({
    id: report.id,
    report_text: reportText,
    signs: report.signs,
    created_at: report.created_at,
    pet: {
      name: petData.nome || '',
      breed: petData.raca || '',
      type: petData.tipo || '',
      signo: petData.signo_pet || report.signs?.pet || '',
      elemento: petData.elemento || '',
    },
  })
}
