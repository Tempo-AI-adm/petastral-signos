import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  if (req.headers.get('x-admin-key') !== process.env.ADMIN_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  )

  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  const hojeISO = hoje.toISOString()

  const [
    { count: totalPets },
    { count: totalVendas },
    { data: ultimasVendas },
    { count: petshoje },
  ] = await Promise.all([
    supabase.from('pets').select('*', { count: 'exact', head: true }),
    supabase.from('payments').select('*', { count: 'exact', head: true }).eq('status', 'paid'),
    supabase.from('payments')
      .select('id, email, pet_data, created_at')
      .eq('status', 'paid')
      .order('created_at', { ascending: false })
      .limit(10),
    supabase.from('pets').select('*', { count: 'exact', head: true }).gte('created_at', hojeISO),
  ])

  return NextResponse.json({
    total_pets: totalPets ?? 0,
    total_vendas: totalVendas ?? 0,
    pets_hoje: petshoje ?? 0,
    ultimas_vendas: ultimasVendas ?? [],
  })
}
