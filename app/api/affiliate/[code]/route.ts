import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function GET(
  _req: NextRequest,
  { params }: { params: { code: string } }
) {
  const code = params.code?.toUpperCase()

  // Check affiliate exists
  const { data: affiliate, error } = await supabase
    .from('affiliates')
    .select('id, name, code, commission_pct')
    .eq('code', code)
    .single()

  if (error || !affiliate) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }

  // Count pets created via this code
  const { count: petsCount } = await supabase
    .from('pets')
    .select('id', { count: 'exact', head: true })
    .eq('ref_code', code)

  // Count paid laudos via this code (pets that have a report)
  const { count: laudosCount } = await supabase
    .from('pets')
    .select('id', { count: 'exact', head: true })
    .eq('ref_code', code)
    .eq('laudo_status', 'done')

  const revenue = (laudosCount ?? 0) * 37.90
  const commission = revenue * ((affiliate.commission_pct ?? 50) / 100)

  return NextResponse.json({
    name: affiliate.name,
    code: affiliate.code,
    commission_pct: affiliate.commission_pct,
    pets_created: petsCount ?? 0,
    laudos_sold: laudosCount ?? 0,
    revenue_generated: revenue.toFixed(2),
    commission_owed: commission.toFixed(2),
  })
}
