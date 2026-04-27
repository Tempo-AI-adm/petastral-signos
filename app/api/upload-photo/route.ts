import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function POST(request: Request) {
  try {
    const { contentType } = await request.json()

    const ext = contentType === 'image/png' ? 'png' : contentType === 'image/webp' ? 'webp' : 'jpg'
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { data, error } = await supabase.storage
      .from('pet-photos')
      .createSignedUploadUrl(path)

    if (error || !data) {
      return NextResponse.json({ error: error?.message || 'Falha ao gerar URL de upload' }, { status: 500 })
    }

    const publicUrl = supabase.storage.from('pet-photos').getPublicUrl(path).data.publicUrl

    return NextResponse.json({ signedUrl: data.signedUrl, token: data.token, path, publicUrl })
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
