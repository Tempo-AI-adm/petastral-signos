import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(req: NextRequest) {
  const key = req.headers.get("x-admin-key")
  if (!key || key !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  )

  const [
    petsRes, paymentsRes, ownersRes,
    evPageRes, evCadRes, evSharedRes,
    affiliatesRes, affiliatePetsRes,
  ] = await Promise.all([
    supabase.from("pets").select("id, name, type, breed, created_at, owner_id, ref_code").order("created_at", { ascending: false }).limit(500),
    supabase.from("payments").select("id, email, status, laudo_status, report_id, created_at, pet_data").order("created_at", { ascending: false }),
    supabase.from("owners").select("id, email, utm_source, utm_medium, utm_campaign, referrer"),
    supabase.from("events").select("id").eq("event_type", "page_viewed"),
    supabase.from("events").select("id").eq("event_type", "cadastro_iniciado"),
    supabase.from("events").select("id").eq("event_type", "card_shared"),
    supabase.from("affiliates").select("id, code, name, email, pix, commission_pct"),
    supabase.from("pets").select("ref_code, laudo_status").not("ref_code", "is", null),
  ])

if (petsRes.error) return NextResponse.json({ error: petsRes.error.message }, { status: 500 })
  if (paymentsRes.error) return NextResponse.json({ error: paymentsRes.error.message }, { status: 500 })
  if (ownersRes.error) return NextResponse.json({ error: ownersRes.error.message }, { status: 500 })

  return NextResponse.json({
    pets: petsRes.data ?? [],
    payments: paymentsRes.data ?? [],
    owners: ownersRes.data ?? [],
    affiliates: affiliatesRes.data ?? [],
    affiliatePets: affiliatePetsRes.data ?? [],
    events: {
      page_viewed: evPageRes.data?.length ?? 0,
      cadastro_iniciado: evCadRes.data?.length ?? 0,
      card_shared: evSharedRes.data?.length ?? 0,
    },
  })
}
