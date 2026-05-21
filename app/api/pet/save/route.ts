import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      owner_name, owner_email,
      pet_name, pet_type, breed, sex,
      pet_color, pet_markings,
      city, country, year, month, day, hour, minute, hour_unknown,
      utm_source, utm_medium, utm_campaign, referrer,
      signo_pet, signo_tutor, elemento, score, photo_url,
      ref_code,
    } = body

    if (!owner_email || !pet_name) {
      return NextResponse.json({ ok: false, error: 'missing fields' }, { status: 400 })
    }

    // 1. Upsert owner
    const { data: ownerData, error: ownerError } = await supabase
      .from('owners')
      .upsert(
        { name: owner_name, email: owner_email, utm_source, utm_medium, utm_campaign, referrer, ref_code: ref_code ?? null },
        { onConflict: 'email', ignoreDuplicates: false }
      )
      .select('id')
      .single()

    if (ownerError || !ownerData) {
      return NextResponse.json({ ok: false, error: 'owner_save_failed' }, { status: 500 })
    }

    const owner_id = ownerData.id

    // 2. Insert pet
    const birth_data = { city, country, year, month, day, hour, minute, hour_unknown: hour_unknown ?? false }

    const { data: petData, error: petError } = await supabase
      .from('pets')
      .insert({
        owner_id,
        name: pet_name,
        type: pet_type,
        breed,
        sex,
        pet_color: pet_color ?? null,
        pet_markings: pet_markings ?? null,
        birth_data,
        signo_pet: signo_pet ?? null,
        signo_tutor: signo_tutor ?? null,
        elemento: elemento ?? null,
        score: score ?? null,
        photo_url: photo_url ?? null,
        ref_code: ref_code ?? null,
      })
      .select('id')
      .single()

    if (petError || !petData) {
      // Pet insert failed — não bloqueia o usuário, só loga
      console.error('pet_save_failed', petError)
      return NextResponse.json({ ok: true, pet_id: null, owner_id })
    }

    return NextResponse.json({ ok: true, pet_id: petData.id, owner_id })

  } catch (err) {
    console.error('pet/save error', err)
    return NextResponse.json({ ok: false, error: 'internal' }, { status: 500 })
  }
}
