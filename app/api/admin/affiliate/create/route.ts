import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function POST(req: NextRequest) {
  const adminKey = req.headers.get('x-admin-key')
  if (adminKey !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  try {
    const { code, name, email, pix, commission_pct } = await req.json()
    if (!code || !name || !email) {
      return NextResponse.json({ error: 'missing fields' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('affiliates')
      .insert({
        code: code.toUpperCase(),
        name,
        email,
        pix: pix ?? null,
        commission_pct: commission_pct ?? 50,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, affiliate: data })
  } catch (err) {
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
