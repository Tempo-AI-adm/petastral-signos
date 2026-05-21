"use client"
import { useState, useEffect } from "react"

type Pet = {
  id: string
  name: string
  type: string
  breed: string
  created_at: string
  owner_id: string
  ref_code?: string | null
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

type Affiliate = {
  id: string
  code: string
  name: string
  email: string
  pix: string | null
  commission_pct: number
}

type AffiliatePet = {
  ref_code: string
  laudo_status: string | null
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
  const [affiliates, setAffiliates] = useState<Affiliate[]>([])
  const [affiliatePets, setAffiliatePets] = useState<AffiliatePet[]>([])
  const [events, setEvents] = useState({ page_viewed: 0, cadastro_iniciado: 0, card_shared: 0 })
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"todos" | "pagou" | "falhou" | "hoje">("todos")
  const [period, setPeriod] = useState<"hoje" | "30d" | "total">("total")
  const [newAff, setNewAff] = useState({ code: '', name: '', email: '', pix: '', commission_pct: '50' })
  const [affCreating, setAffCreating] = useState(false)
  const [affError, setAffError] = useState('')

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
      setAffiliates(Array.isArray(data.affiliates) ? data.affiliates : [])
      setAffiliatePets(Array.isArray(data.affiliatePets) ? data.affiliatePets : [])
      setEvents(data.events ?? { page_viewed: 0, cadastro_iniciado: 0, card_shared: 0 })
    } finally {
      setLoading(false)
    }
  }

  async function createAffiliate() {
    setAffCreating(true)
    setAffError('')
    try {
      const res = await fetch('/api/admin/affiliate/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? '' },
        body: JSON.stringify({ ...newAff, code: newAff.code.toUpperCase(), commission_pct: parseInt(newAff.commission_pct) }),
      })
      const data = await res.json()
      if (!res.ok) { setAffError(data.error ?? 'Erro'); return }
      setNewAff({ code: '', name: '', email: '', pix: '', commission_pct: '50' })
      await loadData()
    } catch { setAffError('Erro interno') }
    finally { setAffCreating(false) }
  }

  const ownerMap = new Map(owners.map(o => [o.id, o]))

  const hoje = new Date(Date.now() - 3 * 3600 * 1000).toISOString().slice(0, 10)
  const dias30 = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString()

  function inPeriod(dateStr: string) {
    if (period === "total") return true
    if (period === "hoje") return dateStr.slice(0, 10) === hoje
    return dateStr >= dias30
  }

  const petsInPeriod = pets.filter(p => inPeriod(p.created_at))
  const paymentsInPeriod = payments.filter(p => inPeriod(p.created_at))

  const total = petsInPeriod.length
  const cards_hoje = pets.filter(p => p.created_at.slice(0, 10) === hoje).length
  const iniciaram_pg = paymentsInPeriod.length
  const pagaram = paymentsInPeriod.filter(p => p.status === "paid").length
  const laudos_ok = paymentsInPeriod.filter(p => p.laudo_status === "success").length
  const laudos_falha = paymentsInPeriod.filter(p => p.laudo_status === "failed").length
  const receita = pagaram * 37.90
  const tutoresUnicos = new Set(owners.map(o => o.email)).size

  const fontes: Record<string, number> = {}
  petsInPeriod.forEach(p => {
    const owner = ownerMap.get(p.owner_id)
    const fonte = owner?.utm_source || owner?.referrer || "direto"
    fontes[fonte] = (fontes[fonte] || 0) + 1
  })
  const fontes_sorted = Object.entries(fontes).sort((a, b) => b[1] - a[1]).slice(0, 6)

  const filteredPets = filter === "hoje"
    ? petsInPeriod.filter(p => p.created_at.slice(0, 10) === hoje)
    : petsInPeriod

  const filteredPayments = filter === "pagou"
    ? paymentsInPeriod.filter(p => p.status === "paid")
    : filter === "falhou"
    ? paymentsInPeriod.filter(p => p.laudo_status === "failed")
    : paymentsInPeriod

  const funnelSteps = [
    { label: "LP Visitada", count: events.page_viewed },
    { label: "Cadastro Iniciado", count: events.cadastro_iniciado },
    { label: "Card Gerado", count: pets.length },
    { label: "Compartilhado", count: events.card_shared },
    { label: "Laudo Pago", count: payments.filter(p => p.status === "paid").length },
  ]

  const affStats = affiliates.map(aff => {
    const petsCreated = affiliatePets.filter(ap => ap.ref_code === aff.code).length
    const laudosSold = affiliatePets.filter(ap => ap.ref_code === aff.code && ap.laudo_status === 'done').length
    const commission = laudosSold * 37.90 * (aff.commission_pct / 100)
    return { ...aff, petsCreated, laudosSold, commission }
  })

  const s = {
    card: { background: "rgba(123,79,158,0.12)", border: "1px solid rgba(123,79,158,0.25)", borderRadius: 16, padding: "20px 24px" } as React.CSSProperties,
    label: { color: "#B8A0D4", fontSize: 12, textTransform: "uppercase" as const, letterSpacing: 1.5, marginBottom: 6 },
    value: { color: "#F5F0FF", fontSize: 32, fontWeight: 800, letterSpacing: -1 },
    th: { color: "#B8A0D4", fontSize: 11, textTransform: "uppercase" as const, letterSpacing: 1, padding: "8px 12px", textAlign: "left" as const, borderBottom: "1px solid rgba(123,79,158,0.2)", whiteSpace: "nowrap" as const },
    td: { color: "#F5F0FF", fontSize: 13, padding: "10px 12px", borderBottom: "1px solid rgba(123,79,158,0.1)", verticalAlign: "top" as const },
    section: { marginBottom: 32 } as React.CSSProperties,
    sectionTitle: { color: "#B8A0D4", fontSize: 13, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: 1.5, marginBottom: 12 },
    input: { background: "rgba(123,79,158,0.1)", border: "1px solid rgba(123,79,158,0.3)", borderRadius: 8, color: "#F5F0FF", padding: "8px 12px", fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box" } as React.CSSProperties,
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0D0A1A", color: "#F5F0FF", fontFamily: "system-ui", padding: "32px 24px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>🐾 SignoPet — Painel</div>
          <div style={{ color: "#B8A0D4", fontSize: 13, marginTop: 4 }}>Atualizado: {new Date().toLocaleString("pt-BR")}</div>
        </div>
        <button onClick={loadData} style={{ background: "rgba(123,79,158,0.2)", border: "1px solid rgba(123,79,158,0.3)", borderRadius: 10, color: "#B8A0D4", padding: "8px 16px", cursor: "pointer", fontSize: 13 }}>
          ↻ Atualizar
        </button>
      </div>

      {/* FUNNEL */}
      <div style={s.section}>
        <div style={s.sectionTitle}>Funil de conversão</div>
        <div style={{ display: "flex", alignItems: "center", gap: 0, overflowX: "auto", paddingBottom: 8 }}>
          {funnelSteps.map((step, i) => {
            const prev = i > 0 ? funnelSteps[i - 1].count : null
            const conv = prev && prev > 0 ? Math.round((step.count / prev) * 100) : null
            return (
              <div key={step.label} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ background: "rgba(123,79,158,0.12)", border: "1px solid rgba(123,79,158,0.25)", borderRadius: 12, padding: "16px 20px", textAlign: "center", minWidth: 130 }}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: "#F5F0FF" }}>{step.count.toLocaleString("pt-BR")}</div>
                  <div style={{ fontSize: 11, color: "#B8A0D4", marginTop: 4 }}>{step.label}</div>
                  {conv !== null && (
                    <div style={{ fontSize: 11, fontWeight: 700, marginTop: 6, color: conv >= 50 ? "#4ade80" : conv >= 20 ? "#facc15" : "#E8749A" }}>
                      {conv}% anterior
                    </div>
                  )}
                </div>
                {i < funnelSteps.length - 1 && (
                  <div style={{ color: "#B8A0D4", fontSize: 18, padding: "0 10px", flexShrink: 0 }}>→</div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* PERIOD FILTER */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ color: "#B8A0D4", fontSize: 12, textTransform: "uppercase", letterSpacing: 1, marginRight: 4 }}>Período:</span>
        {(["hoje", "30d", "total"] as const).map(p => (
          <button key={p} onClick={() => setPeriod(p)} style={{
            padding: "6px 16px", borderRadius: 99, fontSize: 13, cursor: "pointer",
            background: period === p ? "rgba(123,79,158,0.4)" : "rgba(123,79,158,0.1)",
            border: period === p ? "1px solid rgba(123,79,158,0.6)" : "1px solid rgba(123,79,158,0.2)",
            color: period === p ? "#F5F0FF" : "#B8A0D4",
          }}>
            {p === "hoje" ? "Hoje" : p === "30d" ? "30 dias" : "Total"}
          </button>
        ))}
      </div>

      {/* STAT CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 16, marginBottom: 32 }}>
        <div style={s.card}>
          <div style={s.label}>Cards criados hoje</div>
          <div style={s.value}>{cards_hoje}</div>
        </div>
        <div style={s.card}>
          <div style={s.label}>Total de pets</div>
          <div style={s.value}>{total}</div>
        </div>
        <div style={s.card}>
          <div style={s.label}>Tutores únicos</div>
          <div style={s.value}>{tutoresUnicos}</div>
        </div>
        <div style={s.card}>
          <div style={s.label}>Receita total</div>
          <div style={{ ...s.value, color: "#4ade80" }}>R${receita.toFixed(2)}</div>
        </div>
        <div style={s.card}>
          <div style={s.label}>Tentativas de pgto</div>
          <div style={s.value}>{iniciaram_pg}</div>
        </div>
        <div style={s.card}>
          <div style={s.label}>Pagamentos confirmados</div>
          <div style={{ ...s.value, color: "#4ade80" }}>{pagaram}</div>
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

      {/* FONTES */}
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

      {/* TABLE FILTER */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {(["todos", "hoje", "pagou", "falhou"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "6px 16px", borderRadius: 99, fontSize: 13, cursor: "pointer",
            background: filter === f ? "rgba(196,84,122,0.3)" : "rgba(123,79,158,0.1)",
            border: filter === f ? "1px solid rgba(196,84,122,0.5)" : "1px solid rgba(123,79,158,0.2)",
            color: filter === f ? "#E8749A" : "#B8A0D4",
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
          {/* PETS TABLE */}
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
                    <th style={s.th}>Ref</th>
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
                        <td style={{ ...s.td, color: "#E8749A" }}>{p.ref_code ?? "—"}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* PAYMENTS TABLE */}
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

          {/* AFFILIATES SECTION */}
          <div style={s.section}>
            <div style={s.sectionTitle}>Parceiros / Afiliados</div>
            <div style={{ overflowX: "auto", borderRadius: 16, border: "1px solid rgba(123,79,158,0.2)", marginBottom: 24 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "rgba(123,79,158,0.1)" }}>
                    <th style={s.th}>Código</th>
                    <th style={s.th}>Nome</th>
                    <th style={s.th}>Email</th>
                    <th style={s.th}>Pix</th>
                    <th style={s.th}>Pets criados</th>
                    <th style={s.th}>Laudos vendidos</th>
                    <th style={s.th}>Comissão devida</th>
                    <th style={s.th}>Links</th>
                  </tr>
                </thead>
                <tbody>
                  {affStats.map((aff, i) => (
                    <tr key={aff.id} style={{ background: i % 2 === 0 ? "transparent" : "rgba(123,79,158,0.04)" }}>
                      <td style={{ ...s.td, fontWeight: 700, color: "#E8749A" }}>{aff.code}</td>
                      <td style={s.td}>{aff.name}</td>
                      <td style={{ ...s.td, color: "#B8A0D4" }}>{aff.email}</td>
                      <td style={{ ...s.td, color: "#B8A0D4" }}>{aff.pix || '—'}</td>
                      <td style={{ ...s.td, textAlign: "center" }}>{aff.petsCreated}</td>
                      <td style={{ ...s.td, textAlign: "center" }}>{aff.laudosSold}</td>
                      <td style={{ ...s.td, color: "#4ade80" }}>R${aff.commission.toFixed(2)}</td>
                      <td style={s.td}>
                        <button onClick={() => navigator.clipboard.writeText(`https://signopet.com.br?ref=${aff.code}`)} style={{ background: "rgba(123,79,158,0.2)", border: "none", borderRadius: 6, color: "#B8A0D4", padding: "4px 10px", cursor: "pointer", fontSize: 11, marginRight: 6 }}>
                          📋 Link
                        </button>
                        <button onClick={() => navigator.clipboard.writeText(`https://signopet.com.br/parceiro/${aff.code}`)} style={{ background: "rgba(123,79,158,0.2)", border: "none", borderRadius: 6, color: "#B8A0D4", padding: "4px 10px", cursor: "pointer", fontSize: 11 }}>
                          📊 Dash
                        </button>
                      </td>
                    </tr>
                  ))}
                  {affStats.length === 0 && (
                    <tr><td colSpan={7} style={{ ...s.td, textAlign: "center", color: "#B8A0D4" }}>Nenhum parceiro cadastrado ainda.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* CREATE AFFILIATE FORM */}
            <div style={s.card}>
              <div style={{ ...s.label, marginBottom: 16 }}>Criar novo parceiro</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12, marginBottom: 12 }}>
                <input placeholder="CÓDIGO" value={newAff.code} onChange={e => setNewAff(a => ({ ...a, code: e.target.value.toUpperCase() }))} style={s.input} />
                <input placeholder="Nome" value={newAff.name} onChange={e => setNewAff(a => ({ ...a, name: e.target.value }))} style={s.input} />
                <input placeholder="Email" value={newAff.email} onChange={e => setNewAff(a => ({ ...a, email: e.target.value }))} style={s.input} />
                <input placeholder="Pix (opcional)" value={newAff.pix} onChange={e => setNewAff(a => ({ ...a, pix: e.target.value }))} style={s.input} />
                <input placeholder="Comissão %" type="number" value={newAff.commission_pct} onChange={e => setNewAff(a => ({ ...a, commission_pct: e.target.value }))} style={s.input} />
              </div>
              {affError && <div style={{ color: "#E8749A", fontSize: 13, marginBottom: 10 }}>{affError}</div>}
              <button onClick={createAffiliate} disabled={affCreating} style={{ background: "rgba(196,84,122,0.3)", border: "1px solid rgba(196,84,122,0.5)", borderRadius: 10, color: "#E8749A", padding: "10px 24px", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>
                {affCreating ? "Criando..." : "Criar Parceiro"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
