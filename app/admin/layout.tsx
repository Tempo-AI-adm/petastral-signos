"use client"
import { useState, useEffect } from "react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false)
  const [input, setInput] = useState("")
  const [error, setError] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (sessionStorage.getItem("admin_ok") === "1") setAuthed(true)
    setChecking(false)
  }, [])

  function tryLogin() {
    const pwd = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "signopet2026"
    if (input === pwd) { sessionStorage.setItem("admin_ok", "1"); setAuthed(true) }
    else setError(true)
  }

  if (checking) return null

  if (!authed) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0D0A1A", fontFamily: "system-ui" }}>
      <div style={{ background: "rgba(123,79,158,0.15)", border: "1px solid rgba(123,79,158,0.3)", borderRadius: 20, padding: "40px 48px", width: 340 }}>
        <div style={{ color: "#F5F0FF", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>🐾 SignoPet Admin</div>
        <div style={{ color: "#B8A0D4", fontSize: 14, marginBottom: 24 }}>Área restrita</div>
        <input
          type="password"
          placeholder="Senha"
          value={input}
          onChange={e => { setInput(e.target.value); setError(false) }}
          onKeyDown={e => { if (e.key === "Enter") tryLogin() }}
          style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: error ? "1px solid #C4547A" : "1px solid rgba(123,79,158,0.4)", background: "rgba(13,10,26,0.8)", color: "#F5F0FF", fontSize: 15, marginBottom: 12, outline: "none", boxSizing: "border-box" }}
        />
        {error && <div style={{ color: "#E8749A", fontSize: 13, marginBottom: 10 }}>Senha incorreta</div>}
        <button
          onClick={tryLogin}
          style={{ width: "100%", padding: "12px", background: "linear-gradient(135deg,#C4547A,#9B3A6B)", border: "none", borderRadius: 10, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer" }}
        >
          Entrar
        </button>
      </div>
    </div>
  )

  return <>{children}</>
}
