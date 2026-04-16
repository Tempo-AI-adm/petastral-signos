import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { pet_id, event_type } = await req.json()
    if (!pet_id || !event_type) {
      return NextResponse.json({ error: 'missing fields' }, { status: 400 })
    }
    await supabase.from('events').insert({ pet_id, event_type })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}
