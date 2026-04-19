"use client"
import { useState, useEffect } from "react"

type Pet = {
  id: string
  name: string
  type: string
  breed: string
  created_at: string
  owner_id: string
}

type Payment = {
  id: string
  email: string
  status: string | null
  laudo_status: string | null
  report_id: string | null
  created_at: string
  pet_data: Record<string, string> | string | null
}

type Owner = {
  id: string
  email: string
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  referrer: string | null
}

function petNome(p: Payment): string {
  if (!p.pet_data) return "—"
  const obj = typeof p.pet_data === "string" ? JSON.parse(p.pet_data) : p.pet_data
  return obj?.nome ?? obj?.name ?? "—"
}

export default function AdminDash() {
  const [pets, setPets] = useState<Pet[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [owners, setOwners] = useState<Owner[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"todos" | "pagou" | "falhou" | "hoje">("todos")

  useEffect(() => { loadData() }, [])

  async function loadData() {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/funnel", {
        headers: { "x-admin-key": process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "" },
      })
      if (!res.ok) return
      const data = await res.json()
      setPets(Array.isArray(data.pets) ? data.pets : [])
      setPayments(Array.isArray(data.payments) ? data.payments : [])
      setOwners(Array.isArray(data.owners) ? data.owners : [])
    } finally {
      setLoading(false)
    }
  }

  const ownerMap = new Map(owners.map(o => [o.id, o]))

  const hoje = new Date(Date.now() - 3 * 3600 * 1000).toISOString().slice(0, 10)
  const total = pets.length
  const cards_hoje = pets.filter(p => p.created_at.slice(0, 10) === hoje).length
  const iniciaram_pg = payments.length
  const pagaram = payments.filter(p => p.status === "paid").length
  const laudos_ok = payments.filter(p => p.laudo_status === "success").length
  const laudos_falha = payments.filter(p => p.laudo_status === "failed").length
  const conv_rate = total > 0 ? ((pagaram / total) * 100).toFixed(1) : "0"

  const fontes: Record<string, number> = {}
  owners.forEach(o => {
    const fonte = o.utm_source || o.referrer || "direto"
    fontes[fonte] = (fontes[fonte] || 0) + 1
  })
  const fontes_sorted = Object.entries(fontes).sort((a, b) => b[1] - a[1]).slice(0, 6)

  const filteredPets = filter === "hoje"
    ? pets.filter(p => p.created_at.slice(0, 10) === hoje)
    : pets

  const filteredPayments = filter === "pagou"
    ? payments.filter(p => p.status === "paid")
    : filter === "falhou"
    ? payments.filter(p => p.laudo_status === "failed")
    : payments

  const s = {
    card: { background: "rgba(123,79,158,0.12)", border: "1px solid rgba(123,79,158,0.25)", borderRadius: 16, padding: "20px 24px" } as React.CSSProperties,
    label: { color: "#B8A0D4", fontSize: 12, textTransform: "uppercase" as const, letterSpacing: 1.5, marginBottom: 6 },
    value: { color: "#F5F0FF", fontSize: 32, fontWeight: 800, letterSpacing: -1 },
    th: { color: "#B8A0D4", fontSize: 11, textTransform: "uppercase" as const, letterSpacing: 1, padding: "8px 12px", textAlign: "left" as const, borderBottom: "1px solid rgba(123,79,158,0.2)", whiteSpace: "nowrap" as const },
    td: { color: "#F5F0FF", fontSize: 13, padding: "10px 12px", borderBottom: "1px solid rgba(123,79,158,0.1)", verticalAlign: "top" as const },
    section: { marginBottom: 32 } as React.CSSProperties,
    sectionTitle: { color: "#B8A0D4", fontSize: 13, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: 1.5, marginBottom: 12 },
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0D0A1A", color: "#F5F0FF", fontFamily: "system-ui", padding: "32px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>🐾 SignoPet — Painel</div>
          <div style={{ color: "#B8A0D4", fontSize: 13, marginTop: 4 }}>
            Atualizado: {new Date().toLocaleString("pt-BR")}
          </div>
        </div>
        <button onClick={loadData} style={{ background: "rgba(123,79,158,0.2)", border: "1px solid rgba(123,79,158,0.3)", borderRadius: 10, color: "#B8A0D4", padding: "8px 16px", cursor: "pointer", fontSize: 13 }}>
          ↻ Atualizar
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 16, marginBottom: 32 }}>
        <div style={s.card}>
          <div style={s.label}>Cards criados hoje</div>
          <div style={s.value}>{cards_hoje}</div>
        </div>
        <div style={s.card}>
          <div style={s.label}>Total de pets criados</div>
          <div style={s.value}>{total}</div>
        </div>
        <div style={s.card}>
          <div style={s.label}>Clicaram em pagar</div>
          <div style={s.value}>{iniciaram_pg}</div>
          <div style={{ color: "#B8A0D4", fontSize: 12, marginTop: 4 }}>{total > 0 ? ((iniciaram_pg / total) * 100).toFixed(1) : 0}% do total</div>
        </div>
        <div style={s.card}>
          <div style={s.label}>Pagaram de fato</div>
          <div style={{ ...s.value, color: "#4ade80" }}>{pagaram}</div>
          <div style={{ color: "#B8A0D4", fontSize: 12, marginTop: 4 }}>{conv_rate}% do total</div>
        </div>
        <div style={s.card}>
          <div style={s.label}>Laudos gerados com sucesso</div>
          <div style={{ ...s.value, color: "#4ade80" }}>{laudos_ok}</div>
        </div>
        <div style={{ ...s.card, border: "1px solid rgba(196,84,122,0.3)" }}>
          <div style={{ ...s.label, color: "#E8749A" }}>Laudos com falha</div>
          <div style={{ ...s.value, color: "#E8749A" }}>{laudos_falha}</div>
          <div style={{ color: "#B8A0D4", fontSize: 12, marginTop: 4 }}>verificar no Render</div>
        </div>
      </div>

      <div style={{ ...s.card, marginBottom: 32 }}>
        <div style={{ ...s.label, marginBottom: 16 }}>De onde vieram os visitantes</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {fontes_sorted.map(([fonte, count]) => (
            <div key={fonte} style={{ background: "rgba(123,79,158,0.15)", borderRadius: 8, padding: "6px 14px", fontSize: 13 }}>
              <span style={{ color: "#E8749A", fontWeight: 700 }}>{count}</span>
              <span style={{ color: "#B8A0D4", marginLeft: 6 }}>{fonte}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {(["todos", "hoje", "pagou", "falhou"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "6px 16px", borderRadius: 99, fontSize: 13, cursor: "pointer",
            background: filter === f ? "rgba(196,84,122,0.3)" : "rgba(123,79,158,0.1)",
            border: filter === f ? "1px solid rgba(196,84,122,0.5)" : "1px solid rgba(123,79,158,0.2)",
            color: filter === f ? "#E8749A" : "#B8A0D4"
          }}>
            {f === "todos" ? "Todos" : f === "hoje" ? "Hoje" : f === "pagou" ? "✅ Pagaram" : "❌ Falha no laudo"}
          </button>
        ))}
        <span style={{ color: "#B8A0D4", fontSize: 13, alignSelf: "center", marginLeft: 8 }}>
          {filteredPets.length} pet{filteredPets.length !== 1 ? "s" : ""} · {filteredPayments.length} pagamento{filteredPayments.length !== 1 ? "s" : ""}
        </span>
      </div>

      {loading ? (
        <div style={{ color: "#B8A0D4", padding: 40, textAlign: "center" }}>Carregando...</div>
      ) : (
        <>
          <div style={s.section}>
            <div style={s.sectionTitle}>Pets criados</div>
            <div style={{ overflowX: "auto", borderRadius: 16, border: "1px solid rgba(123,79,158,0.2)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "rgba(123,79,158,0.1)" }}>
                    <th style={s.th}>Quando criou</th>
                    <th style={s.th}>Email</th>
                    <th style={s.th}>Pet</th>
                    <th style={s.th}>Tipo / Raça</th>
                    <th style={s.th}>Fonte</th>
                    <th style={s.th}>Campanha</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPets.map((p, i) => {
                    const owner = ownerMap.get(p.owner_id)
                    return (
                      <tr key={p.id} style={{ background: i % 2 === 0 ? "transparent" : "rgba(123,79,158,0.04)" }}>
                        <td style={s.td}>{new Date(p.created_at).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</td>
                        <td style={{ ...s.td, color: "#B8A0D4", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{owner?.email ?? "—"}</td>
                        <td style={s.td}>{p.name || "—"}</td>
                        <td style={{ ...s.td, color: "#B8A0D4" }}>{p.type} · {p.breed}</td>
                        <td style={{ ...s.td, color: "#C4A8FF" }}>{owner?.utm_source || owner?.referrer || "direto"}</td>
                        <td style={{ ...s.td, color: "#B8A0D4" }}>{owner?.utm_campaign ?? "—"}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div style={s.section}>
            <div style={s.sectionTitle}>Pagamentos</div>
            <div style={{ overflowX: "auto", borderRadius: 16, border: "1px solid rgba(123,79,158,0.2)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "rgba(123,79,158,0.1)" }}>
                    <th style={s.th}>Quando</th>
                    <th style={s.th}>Email</th>
                    <th style={s.th}>Pet</th>
                    <th style={s.th}>Status pgto</th>
                    <th style={s.th}>Laudo</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((p, i) => (
                    <tr key={p.id} style={{ background: i % 2 === 0 ? "transparent" : "rgba(123,79,158,0.04)" }}>
                      <td style={s.td}>{new Date(p.created_at).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</td>
                      <td style={{ ...s.td, color: "#B8A0D4", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.email || "—"}</td>
                      <td style={s.td}>{petNome(p)}</td>
                      <td style={{ ...s.td, textAlign: "center" }}>{p.status === "paid" ? "✅ pago" : p.status ?? "—"}</td>
                      <td style={{ ...s.td, textAlign: "center" }}>
                        {p.laudo_status === "success" ? "✅" : p.laudo_status === "failed" ? "❌" : p.laudo_status === "pending" ? "⏳" : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
