"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

// ─── Rotating word pairs (adjetivo / signo) ───────────────────────────────
const PAIRS: [string, string][] = [
  ["teimoso", "Touro"], ["dramático", "Leão"], ["avoado", "Gêmeos"],
  ["grudento", "Câncer"], ["intenso", "Escorpião"], ["agitado", "Áries"],
  ["controlador", "Virgem"], ["distante", "Aquário"], ["impulsivo", "Áries"],
  ["ciumento", "Escorpião"], ["preguiçoso", "Touro"], ["sonhador", "Peixes"],
];

// ─── Background color journey (scroll 0→1) ───────────────────────────────
const COLOR_STOPS: [number, [number, number, number]][] = [
  [0,    [13, 10, 26]],
  [0.12, [19, 10, 34]],
  [0.25, [28, 14, 56]],
  [0.40, [42, 22, 82]],
  [0.52, [56, 38, 108]],
  [0.62, [80, 64, 152]],
  [0.70, [100, 110, 185]],
  [0.77, [130, 165, 215]],
  [0.83, [168, 205, 235]],
  [0.88, [200, 228, 248]],
  [0.93, [225, 242, 255]],
  [0.97, [242, 250, 255]],
  [1.0,  [255, 255, 255]],
];

function lerpColor(p: number): [number, number, number] {
  for (let i = 0; i < COLOR_STOPS.length - 1; i++) {
    const [p0, c0] = COLOR_STOPS[i];
    const [p1, c1] = COLOR_STOPS[i + 1];
    if (p >= p0 && p <= p1) {
      const t = (p - p0) / (p1 - p0);
      return c0.map((v, j) => Math.round(v + t * (c1[j] - v))) as [number, number, number];
    }
  }
  return COLOR_STOPS[COLOR_STOPS.length - 1][1];
}

// ─── AnimatedCounter ─────────────────────────────────────────────────────
function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      let n = 0;
      const step = Math.ceil(target / 60);
      const t = setInterval(() => {
        n = Math.min(n + step, target);
        setCount(n);
        if (n >= target) clearInterval(t);
      }, 24);
      obs.disconnect();
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{count.toLocaleString("pt-BR")}</span>;
}

// ─── FAQ Item ─────────────────────────────────────────────────────────────
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: "1px solid rgba(123,79,158,0.3)", borderRadius: 16, overflow: "hidden", marginBottom: 10, background: "rgba(10,7,22,0.80)" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: "100%", background: "none", border: "none", padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", color: "#F5F0FF", fontSize: 15, fontWeight: 600, textAlign: "left", gap: 12, fontFamily: "inherit" }}
      >
        <span>{q}</span>
        <span style={{ color: "#C4547A", fontSize: 22, flexShrink: 0, transition: "transform 0.25s ease", transform: open ? "rotate(45deg)" : "rotate(0deg)" }}>+</span>
      </button>
      {open && <div style={{ padding: "0 22px 18px", color: "#B8A0D4", fontSize: 14, lineHeight: 1.65 }}>{a}</div>}
    </div>
  );
}

// ─── Main LP ──────────────────────────────────────────────────────────────
export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [bgColor, setBgColor] = useState("rgb(13,10,26)");
  const [cloudOpacity, setCloudOpacity] = useState(0);
  const [starsOpacity, setStarsOpacity] = useState(1);
  const [pairIndex, setPairIndex] = useState(0);
  const [adjAnim, setAdjAnim] = useState("");
  const [signAnim, setSignAnim] = useState("");
  const starsRef = useRef<HTMLDivElement>(null);
  const rafPending = useRef(false);

  // Generate stars once
  useEffect(() => {
    if (!starsRef.current) return;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < 100; i++) {
      const s = document.createElement("div");
      const size = Math.random() * 2.8 + 0.6;
      s.style.cssText = `position:absolute;background:#F5F0FF;border-radius:50%;left:${Math.random()*100}%;top:${Math.random()*100}%;width:${size}px;height:${size}px;animation:twinkle ${(Math.random()*3+2).toFixed(1)}s ease-in-out infinite ${(Math.random()*6).toFixed(1)}s`;
      frag.appendChild(s);
    }
    starsRef.current.appendChild(frag);
  }, []);

  // Scroll handler
  const handleScroll = useCallback(() => {
    if (rafPending.current) return;
    rafPending.current = true;
    requestAnimationFrame(() => {
      rafPending.current = false;
      const y = window.scrollY;
      setScrolled(y > 40);
      const totalH = Math.max(document.body.scrollHeight - window.innerHeight, 1);
      const p = Math.min(y / totalH, 1);
      const [r, g, b] = lerpColor(p);
      setBgColor(`rgb(${r},${g},${b})`);
      if (p > 0.55) {
        const fade = Math.min((p - 0.55) / 0.35, 1);
        setStarsOpacity(1 - fade);
      }
      if (p > 0.55 && p < 0.97) {
        setCloudOpacity(Math.min((p - 0.55) / 0.15, 1) * 0.92);
      } else if (p >= 0.97) {
        setCloudOpacity(Math.max(0.92 - (p - 0.97) / 0.03 * 0.92, 0));
      } else {
        setCloudOpacity(0);
      }
      // Parallax nebulae
      const neb = (id: string, factor: number) => {
        const el = document.getElementById(id);
        if (el) el.style.transform = `translateY(${y * factor}px)`;
      };
      neb("neb1", 0.07); neb("neb2", 0.04); neb("neb3", 0.025);
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Scroll reveal
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { (e.target as HTMLElement).style.opacity = "1"; (e.target as HTMLElement).style.transform = "translateY(0)"; obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Rotating words
  useEffect(() => {
    const interval = setInterval(() => {
      const next = (pairIndex + 1) % PAIRS.length;
      setAdjAnim("word-out");
      setTimeout(() => {
        setPairIndex(next);
        setAdjAnim("word-in");
        setTimeout(() => setAdjAnim(""), 350);
      }, 330);
      setTimeout(() => {
        setSignAnim("word-out");
        setTimeout(() => {
          setSignAnim("word-in");
          setTimeout(() => setSignAnim(""), 350);
        }, 330);
      }, 120);
    }, 3000);
    return () => clearInterval(interval);
  }, [pairIndex]);

  const [adj, sign] = PAIRS[pairIndex];

  return (
    <>
      <style>{`
        @keyframes twinkle { 0%,100%{opacity:0.1;transform:scale(1)} 50%{opacity:0.7;transform:scale(1.6)} }
        @keyframes wordOut { 0%{opacity:1;transform:translateY(0);filter:blur(0)} 100%{opacity:0;transform:translateY(-10px);filter:blur(3px)} }
        @keyframes wordIn  { 0%{opacity:0;transform:translateY(10px);filter:blur(3px)} 100%{opacity:1;transform:translateY(0);filter:blur(0)} }
        @keyframes mascotFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes marqueeScroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        .word-out { animation: wordOut 0.35s ease forwards; }
        .word-in  { animation: wordIn  0.35s ease forwards; }
        .reveal { opacity:0; transform:translateY(28px); transition:opacity 0.65s ease,transform 0.65s ease; }
        .reveal-d1{transition-delay:.1s} .reveal-d2{transition-delay:.2s} .reveal-d3{transition-delay:.3s} .reveal-d4{transition-delay:.45s}
        .btn-primary { background:#FFFFFF;color:#0D0A1A;border:none;border-radius:50px;padding:14px 28px;font-size:15px;font-weight:700;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;gap:8px;transition:transform .18s ease,box-shadow .18s ease;font-family:inherit }
        .btn-primary:hover{transform:translateY(-2px);box-shadow:0 10px 36px rgba(255,255,255,0.25)}
        .btn-primary.large{font-size:17px;padding:18px 36px}
        .btn-secondary{background:transparent;color:#F5F0FF;border:1.5px solid rgba(196,84,122,.45);border-radius:50px;padding:13px 28px;font-size:15px;font-weight:600;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;gap:8px;transition:all .18s ease;font-family:inherit}
        .btn-secondary:hover{border-color:#C4547A;background:rgba(196,84,122,.1);transform:translateY(-2px)}
        .btn-secondary.large{font-size:17px;padding:17px 34px}
        .btn-laudo{background:linear-gradient(135deg,rgba(196,84,122,.2) 0%,rgba(123,79,158,.2) 100%);color:#E8749A;border:1.5px solid rgba(232,116,154,.5);border-radius:50px;padding:16px 36px;font-size:16px;font-weight:700;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;gap:10px;transition:all .2s ease;font-family:inherit}
        .btn-laudo:hover{background:linear-gradient(135deg,rgba(196,84,122,.3),rgba(123,79,158,.3));border-color:#E8749A;transform:translateY(-2px);box-shadow:0 8px 28px rgba(196,84,122,.2)}
        .glass-card{background:rgba(10,7,22,.82);border:1px solid rgba(123,79,158,.22);border-radius:20px}
        .testimonial{flex:1;min-width:260px;background:rgba(10,7,22,.82);border:1px solid rgba(123,79,158,.25);border-radius:20px;padding:26px 24px;transition:transform .2s ease,border-color .2s ease}
        .testimonial:hover{transform:translateY(-4px);border-color:rgba(196,84,122,.35)}
        @media(max-width:900px){.mascot-left-wrap,.mascot-right-wrap{display:none!important}}
        @media(max-width:768px){
          .hero-btns,.final-btns{flex-direction:column!important;align-items:stretch!important}
          .hero-btns a,.final-btns a{text-align:center;justify-content:center}
          .preview-row,.testimonials-row,.steps-row,.laudo-content{flex-direction:column!important;align-items:center!important}
        }
      `}</style>

      {/* ── Scroll bg ── */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, background: bgColor, transition: "background 0.3s ease" }} />

      {/* ── Nebulae ── */}
      <div id="neb1" style={{ position: "fixed", width: 700, height: 500, background: "radial-gradient(circle,#7B4F9E,transparent)", borderRadius: "50%", filter: "blur(90px)", opacity: 0.16, top: "-5%", left: "-15%", pointerEvents: "none", zIndex: 1 }} />
      <div id="neb2" style={{ position: "fixed", width: 500, height: 400, background: "radial-gradient(circle,#C4547A,transparent)", borderRadius: "50%", filter: "blur(90px)", opacity: 0.16, top: "25%", right: "-10%", pointerEvents: "none", zIndex: 1 }} />
      <div id="neb3" style={{ position: "fixed", width: 600, height: 400, background: "radial-gradient(circle,#2E1B5F,transparent)", borderRadius: "50%", filter: "blur(90px)", opacity: 0.16, top: "60%", left: "20%", pointerEvents: "none", zIndex: 1 }} />

      {/* ── Stars ── */}
      <div ref={starsRef} style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 1, opacity: starsOpacity, transition: "opacity 0.5s ease" }} />

      {/* ── CSS Clouds ── */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, opacity: cloudOpacity, transition: "opacity 0.8s ease" }}>
        {[
          { w: 500, h: 200, top: "20%", left: -60 },
          { w: 600, h: 240, top: "35%", right: -80 },
          { w: 420, h: 160, top: "55%", left: "10%" },
          { w: 680, h: 260, top: "65%", right: -40 },
          { w: 480, h: 180, top: "78%", left: -30 },
        ].map((c, i) => (
          <div key={i} style={{ position: "absolute", background: "rgba(255,255,255,0.65)", borderRadius: "50%", filter: "blur(55px)", width: c.w, height: c.h, top: c.top, left: "left" in c ? c.left : undefined, right: "right" in c ? c.right : undefined }} />
        ))}
      </div>

      {/* ── Navbar ── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: scrolled ? "13px 40px" : "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", backdropFilter: scrolled ? "blur(20px)" : "none", background: scrolled ? "rgba(13,10,26,0.45)" : "transparent", transition: "all 0.3s ease" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", color: "#F5F0FF" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-branca-horizontal.svg" alt="SignoPet" style={{ height: 30, width: "auto" }} />
        </Link>
        <Link href="/cadastro" className="btn-primary" style={{ padding: "10px 22px", fontSize: 14 }}>
          Criar card do meu pet
        </Link>
      </nav>

      {/* ── Hero ── */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "130px 24px 80px", position: "relative", zIndex: 2, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "45%", left: "50%", transform: "translate(-50%,-50%)", width: 800, height: 700, background: "radial-gradient(ellipse at 50% 40%,rgba(123,79,158,.18) 0%,rgba(196,84,122,.07) 45%,transparent 68%)", borderRadius: "50%", pointerEvents: "none" }} />

        {/* Dog mascot — left */}
        <div className="mascot-left-wrap" style={{ position: "absolute", left: "clamp(60px,10vw,200px)", bottom: 0, width: "clamp(140px,18vw,260px)", pointerEvents: "none", animation: "mascotFloat 4.2s ease-in-out infinite" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/mascote-espaco.png" alt="Mascote cachorro" style={{ width: "100%", display: "block" }} />
        </div>

        {/* Cat mascot — right */}
        <div className="mascot-right-wrap" style={{ position: "absolute", right: "clamp(60px,10vw,200px)", bottom: 0, width: "clamp(140px,18vw,260px)", pointerEvents: "none", animation: "mascotFloat 3.8s ease-in-out infinite 0.6s" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/mascote-gato-espaco.png" alt="Mascote gato" style={{ width: "100%", display: "block", transform: "scaleX(-1)" }} />
        </div>

        <div className="reveal" style={{ marginBottom: 14 }}>
          <span style={{ background: "rgba(196,84,122,.13)", border: "1px solid rgba(196,84,122,.3)", color: "#E8749A", fontSize: 13, fontWeight: 600, padding: "6px 16px", borderRadius: 99, letterSpacing: 0.4 }}>✨ 100% grátis para criar</span>
        </div>

        <h1 className="reveal reveal-d1" style={{ fontSize: "clamp(36px,6.5vw,68px)", fontWeight: 800, lineHeight: 1.1, letterSpacing: -2, marginBottom: 26, maxWidth: 800 }}>
          <span style={{ display: "block", background: "linear-gradient(135deg,#F5F0FF 40%,#E8749A 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Ele não é{" "}
            <span className={adjAnim} style={{ color: "#C4A8FF", WebkitTextFillColor: "#C4A8FF", display: "inline-block" }}>{adj}</span>.
          </span>
          <span style={{ display: "block", background: "linear-gradient(135deg,#F5F0FF 40%,#E8749A 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Ele é{" "}
            <span className={signAnim} style={{ color: "#E8749A", WebkitTextFillColor: "#E8749A", display: "inline-block" }}>{sign}</span>.
          </span>
        </h1>

        <p className="reveal reveal-d2" style={{ fontSize: "clamp(16px,2vw,19px)", color: "#B8A0D4", maxWidth: 490, lineHeight: 1.65, marginBottom: 42 }}>
          Gere o card astrológico do seu pet em menos de 1 minuto. Grátis e compartilhável.
        </p>

        <div className="hero-btns reveal reveal-d3" style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", marginBottom: 20 }}>
          <Link href="/cadastro?tipo=cachorro" className="btn-primary large">🐶 É um cachorro</Link>
          <Link href="/cadastro?tipo=gato" className="btn-primary large">🐱 É um gato</Link>
        </div>
        <p className="reveal reveal-d4" style={{ color: "rgba(245,240,255,0.55)", fontSize: 13 }}>Sem cadastro. Sem assinatura. Sempre grátis.</p>
      </section>

      {/* ── Social proof ── */}
      <div style={{ background: "rgba(10,7,22,.82)", borderTop: "1px solid rgba(123,79,158,.18)", borderBottom: "1px solid rgba(123,79,158,.18)", padding: "20px 24px", textAlign: "center", position: "relative", zIndex: 2 }}>
        <p style={{ color: "#B8A0D4", fontSize: 15 }}>
          <span style={{ fontSize: 26, fontWeight: 800, color: "#E8749A", textShadow: "0 0 28px rgba(232,116,154,.5)" }}><AnimatedCounter target={3847} /></span> pets já descobriram o signo deles
        </p>
      </div>

      {/* ── Marquee ── */}
      <div style={{ overflow: "hidden", padding: "12px 0", background: "rgba(10,7,22,.6)", borderBottom: "1px solid rgba(123,79,158,.12)", position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", width: "max-content", animation: "marqueeScroll 30s linear infinite" }}>
          {[0, 1].map(i => (
            <div key={i} style={{ display: "flex", whiteSpace: "nowrap" }}>
              {["🐶 Descobri que meu cachorro é Leão e faz TOTAL sentido", "🐱 Minha gata Escorpiana me ignora do jeito exato", "🐾 Melhor coisa que fiz hoje", "✨ Compartilhei e minha amiga ficou assustada de preciso", "🌟 O signo do pet é mais real que o meu", "💜 Virgem explicou tudo sobre minha gata ansiosa", "🐶 Nunca vi meu cachorro tão bem descrito", "🌙 Assustadoramente preciso para um produto grátis"].map((text, j) => (
                <span key={j} style={{ color: j % 4 === 0 ? "#E8749A" : j % 4 === 2 ? "#C4A8FF" : "rgba(245,240,255,0.85)", fontSize: 13, padding: "0 28px" }}>{text}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Preview ── */}
      <section style={{ padding: "16px 16px 0", position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "72px 48px" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 56 }}>
            <h2 style={{ color: "#F5F0FF", fontSize: "clamp(28px,4.5vw,44px)", fontWeight: 800, letterSpacing: -0.8, marginBottom: 12 }}>O card do seu pet</h2>
            <p style={{ color: "#B8A0D4", fontSize: 17 }}>Parece uma carta colecionável. Funciona como um espelho.</p>
          </div>
          <div className="preview-row" style={{ display: "flex", alignItems: "center", gap: 64, justifyContent: "center", flexWrap: "wrap" }}>
            {/* Card mockup */}
            <div className="reveal reveal-d1" style={{ transform: "rotate(-3deg)", flexShrink: 0, filter: "drop-shadow(0 0 60px rgba(196,84,122,0.7)) drop-shadow(0 0 120px rgba(123,79,158,0.5))" }}>
              <div style={{ width: 250, borderRadius: 22, overflow: "hidden", background: "linear-gradient(160deg,#1e1035 0%,#110920 100%)", border: "1.5px solid rgba(196,84,122,.3)" }}>
                <div style={{ background: "linear-gradient(135deg,#C4547A 0%,#7B4F9E 100%)", padding: "14px 16px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>Luna</div>
                    <div style={{ color: "rgba(255,255,255,.82)", fontSize: 11, marginTop: 2 }}>♍ Virgem · Terra</div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,.15)", borderRadius: "50%", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🐾</div>
                </div>
                {/* Avatar with mascote */}
                <div style={{ height: 128, position: "relative", background: "radial-gradient(circle at 50% 65%,rgba(123,79,158,.35) 0%,transparent 70%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/mascote-perto.png" alt="mascote" style={{ height: 90, width: "auto", objectFit: "contain", display: "block" }} />
                  <div style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center", gap: 5 }}>
                    <svg width="38" height="24" viewBox="0 0 38 24" fill="none">
                      <path d="M35 12 C28 3, 14 3, 3 12" stroke="rgba(245,240,255,.55)" strokeWidth="1.8" strokeLinecap="round" />
                      <path d="M8 5 L2 12 L8 19" stroke="rgba(245,240,255,.55)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span style={{ fontFamily: "var(--font-caveat, cursive)", color: "rgba(245,240,255,.55)", fontSize: 12, lineHeight: 1.2 }}>seu pet<br />aqui</span>
                  </div>
                </div>
                <div style={{ margin: "0 12px 10px", background: "rgba(196,84,122,.1)", border: "1px solid rgba(196,84,122,.28)", borderRadius: 10, padding: "7px 10px", textAlign: "center" }}>
                  <div style={{ color: "#E8749A", fontSize: 9, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 3 }}>Super Poder</div>
                  <div style={{ color: "#F5F0FF", fontSize: 11.5, fontWeight: 600 }}>✨ Leitura emocional implacável</div>
                </div>
                <div style={{ padding: "0 12px 14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ color: "#B8A0D4", fontSize: 10 }}>Compatibilidade com tutor</span>
                    <span style={{ color: "#E8749A", fontSize: 13, fontWeight: 700 }}>87%</span>
                  </div>
                  <div style={{ height: 5, background: "rgba(255,255,255,.08)", borderRadius: 99, marginBottom: 8 }}>
                    <div style={{ width: "87%", height: "100%", background: "linear-gradient(90deg,#7B4F9E,#C4547A)", borderRadius: 99 }} />
                  </div>
                  <div style={{ color: "#B8A0D4", fontSize: 9.5, textAlign: "center", fontStyle: "italic" }}>Ela sente tudo que você sente — e guarda pra ela.</div>
                </div>
                <div style={{ margin: "0 12px 10px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
                  {[["PET", "♍ Virgem"], ["TUTOR", "♒ Aquário"]].map(([label, val]) => (
                    <div key={label} style={{ background: "rgba(123,79,158,.14)", border: "1px solid rgba(123,79,158,.22)", borderRadius: 9, padding: "6px 8px", textAlign: "center" }}>
                      <div style={{ color: "#B8A0D4", fontSize: 8, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
                      <div style={{ color: "#F5F0FF", fontSize: 11, fontWeight: 600, marginTop: 2 }}>{val}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background: "rgba(123,79,158,.18)", padding: 8, textAlign: "center", color: "#B8A0D4", fontSize: 9, letterSpacing: 1 }}>🐾 gratuito em @signopet</div>
              </div>
            </div>
            {/* Features */}
            <div className="reveal reveal-d2" style={{ maxWidth: 380 }}>
              {[
                ["✨", "Signo e elemento", "Sol, Lua e os astros do seu pet baseados na data de nascimento."],
                ["⚡", "Super Poder único", "Gerado pela combinação signo × raça — 84 combinações possíveis."],
                ["💜", "Compatibilidade com tutor", "Percentual + frase personalizada sobre a relação de vocês."],
                ["🐾", "Um clique pra compartilhar", "A gente prepara o texto. Você só aperta enviar."],
              ].map(([icon, title, desc]) => (
                <div key={title} style={{ display: "flex", gap: 16, marginBottom: 12, alignItems: "flex-start", background: "rgba(10,7,22,.75)", border: "1px solid rgba(123,79,158,.18)", borderRadius: 16, padding: 16 }}>
                  <div style={{ width: 46, height: 46, flexShrink: 0, background: "linear-gradient(135deg,rgba(196,84,122,.12),rgba(123,79,158,.12))", border: "1px solid rgba(123,79,158,.28)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{icon}</div>
                  <div>
                    <div style={{ color: "#F5F0FF", fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{title}</div>
                    <div style={{ color: "#B8A0D4", fontSize: 14, lineHeight: 1.55 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ padding: "0 16px", position: "relative", zIndex: 2, marginTop: 32 }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "72px 48px" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ display: "inline-block", background: "rgba(196,84,122,.13)", border: "1px solid rgba(196,84,122,.3)", color: "#E8749A", fontSize: 12, fontWeight: 700, padding: "5px 14px", borderRadius: 99, letterSpacing: 1, textTransform: "uppercase" as const, marginBottom: 16 }}>Como funciona</div>
            <h2 style={{ color: "#F5F0FF", fontSize: "clamp(32px,5vw,52px)", fontWeight: 800, letterSpacing: -1, lineHeight: 1.15 }}>Três passos.<br />Menos de 1 minuto.</h2>
          </div>
          <div className="steps-row" style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
            {[
              ["🐾", "PASSO 1", "Crie seu pet", "Nome, raça e data de nascimento. Rápido — a gente cuida do resto."],
              ["✨", "PASSO 2", "Cruzamos signo com raça", "O card é montado a partir da combinação única de signo, elemento e perfil comportamental da raça."],
              ["💬", "PASSO 3", "Ajude compartilhando", "A gente prepara o texto. Você só aperta enviar — e espalha o que o universo tinha a dizer sobre o seu pet."],
            ].map(([icon, num, title, desc], i) => (
              <div key={i} className={`reveal reveal-d${i + 1}`} style={{ flex: 1, minWidth: 220, maxWidth: 260, textAlign: "center", background: "rgba(10,7,22,.82)", border: "1px solid rgba(123,79,158,.22)", borderRadius: 20, padding: 28 }}>
                <div style={{ width: 68, height: 68, margin: "0 auto 18px", background: "linear-gradient(135deg,rgba(196,84,122,.12),rgba(123,79,158,.12))", border: "1.5px solid rgba(196,84,122,.28)", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>{icon}</div>
                <div style={{ color: "#C4547A", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>{num}</div>
                <div style={{ color: "#F5F0FF", fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{title}</div>
                <div style={{ color: "#B8A0D4", fontSize: 14, lineHeight: 1.55 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={{ padding: "40px 24px", maxWidth: 1060, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: "clamp(28px,4.5vw,44px)", fontWeight: 800, letterSpacing: -0.8, textShadow: "0 2px 20px rgba(10,7,22,.8)" }}>O que os tutores estão dizendo</h2>
        </div>
        {/* Rating block */}
        <div className="reveal" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginBottom: 48, flexWrap: "wrap" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 42, fontWeight: 800, letterSpacing: -1, color: "#F5F0FF", lineHeight: 1 }}>4.9</div>
            <div style={{ color: "#f5a623", fontSize: 18, marginTop: 4 }}>⭐⭐⭐⭐⭐</div>
            <div style={{ color: "#B8A0D4", fontSize: 12, marginTop: 4 }}>nota média</div>
          </div>
          <div style={{ width: 1, height: 56, background: "rgba(123,79,158,.3)" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 42, fontWeight: 800, letterSpacing: -1, color: "#F5F0FF", lineHeight: 1 }}>+3.8k</div>
            <div style={{ color: "#B8A0D4", fontSize: 12, marginTop: 8 }}>pets com signo descoberto</div>
          </div>
          <div style={{ width: 1, height: 56, background: "rgba(123,79,158,.3)" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 42, fontWeight: 800, letterSpacing: -1, color: "#F5F0FF", lineHeight: 1 }}>100%</div>
            <div style={{ color: "#B8A0D4", fontSize: 12, marginTop: 8 }}>grátis para criar o card</div>
          </div>
        </div>
        <div className="testimonials-row" style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {[
            { name: "🐾 Cisco (Pinscher · Sagitário)", quote: "Quando chegou o segundo cachorro eu achei que o Cisco ia enlouquecer. Aí vi que Sagitário precisa de espaço e hierarquia clara. Mudei a rotina e melhorou na hora.", handle: "@bruna_franciscojasminemaya", img: "/depoimento_cisco.jpeg" },
            { name: "🐾 Gus (Caramelo · Áries)", quote: "Descobri que o Gus é ariano. Agora ele tem direitos. Se eu chegar atrasado com a ração, é desrespeito ao signo. 😂", handle: "@_gus.dog", img: "/depoimento_gus.jpeg" },
            { name: "🐾 Maria Guadalupe (Shih Tzu · Gêmeos)", quote: "Comecei a explorar a curiosidade dela em vez de brigar. Gêmeos precisa de estímulo mental. Ensinei um truque novo por semana — ela mudou completamente.", handle: "@falcaomarina", img: "/depoimento_maria.jpeg" },
            { name: "🐾 Tobias (Golden · Câncer)", quote: "Achei que era exagero, mas o laudo descreveu exatamente como o Tobias age quando fico fora. Câncer mesmo — apegado, dramático e completamente meu.", handle: "@amanda.tobias.pet", img: "/depoimento_gus.jpeg" },
            { name: "🐾 Mel (SRD · Libra)", quote: "A Mel fica em cima de qualquer pessoa que apareça em casa. O laudo disse que Libra precisa de equilíbrio social. Faz todo sentido agora.", handle: "@rafaelinha_mel", img: "/depoimento_maria.jpeg" },
            { name: "🐾 Zeus (Bulldog · Capricórnio)", quote: "Meu Bulldog é o ser mais teimoso que eu já vi. Ler que Capricórnio não cede até entender o motivo foi uma revelação. Agora eu negocio com ele.", handle: "@zeusthefrench", img: "/depoimento_cisco.jpeg" },
          ].map((t, i) => (
            <div key={i} className={`testimonial reveal reveal-d${(i % 3) + 1}`}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", border: "2px solid rgba(196,84,122,.4)", flexShrink: 0, overflow: "hidden", background: "rgba(123,79,158,.2)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.img} alt={t.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#E8749A" }}>{t.name}</div>
                  <div style={{ color: "#f5a623", fontSize: 12, marginTop: 2 }}>⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p style={{ color: "#F5F0FF", fontSize: 14.5, lineHeight: 1.65, marginBottom: 14 }}>&ldquo;{t.quote}&rdquo;</p>
              <div style={{ color: "rgba(184,160,212,.75)", fontSize: 12 }}>{t.handle}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Laudo ── */}
      <section style={{ padding: "0 16px", position: "relative", zIndex: 2, marginBottom: 32 }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "72px 48px" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p className="reveal" style={{ color: "#E8749A", fontSize: 13, textTransform: "uppercase" as const, letterSpacing: 2, marginBottom: 16 }}>Quer ir mais fundo? É opcional.</p>
            <h2 className="reveal reveal-d1" style={{ color: "#1A0A2E", fontSize: "clamp(32px,5vw,62px)", fontWeight: 800, letterSpacing: -2, lineHeight: 1.0, marginBottom: 12 }}>O Laudo Completo.</h2>
            <p className="reveal reveal-d2" style={{ color: "#2E2B5F", fontSize: 18, marginBottom: 0 }}>9 capítulos personalizados sobre o comportamento, emoções e personalidade do seu pet — baseados no cruzamento entre signo, raça e pelagem.</p>
          </div>
          <div className="laudo-content" style={{ display: "flex", gap: 48, alignItems: "flex-start", flexWrap: "wrap", justifyContent: "center" }}>
            {/* Chapters left col */}
            <div className="reveal reveal-d1" style={{ flex: 1, minWidth: 280, maxWidth: 520 }}>
              {[
                ["☀️","Cap. 1","Sol: Essência e personalidade"],
                ["🌙","Cap. 2","Lua: Emoções e vínculo com o tutor"],
                ["🌍","Cap. 3","Elementos: Energia e ambiente ideal"],
                ["☿️","Cap. 4","Mercúrio: Como seu pet se comunica"],
                ["♀️","Cap. 5","Vênus: Relacionamentos e afeto"],
                ["♂️","Cap. 6","Marte: Energia e comportamento"],
                ["♃","Cap. 7","Júpiter: Crescimento e abundância"],
                ["♄","Cap. 8","Saturno: Limites e aprendizado"],
                ["✨","Cap. 9","Síntese: O pet inteiro em uma visão"],
              ].map(([icon, cap, text]) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 0", borderBottom: "1px solid rgba(123,79,158,.15)" }}>
                  <div style={{ width: 38, height: 38, flexShrink: 0, background: "linear-gradient(135deg,rgba(196,84,122,.1),rgba(123,79,158,.1))", border: "1px solid rgba(123,79,158,.22)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>{icon}</div>
                  <span style={{ color: "#1A0A2E", fontSize: 15 }}>{text}</span>
                  <span style={{ marginLeft: "auto", flexShrink: 0, color: "#2E2B5F", fontSize: 11, fontWeight: 700, background: "rgba(30,10,60,.15)", border: "1px solid rgba(46,43,95,.3)", padding: "2px 8px", borderRadius: 6 }}>{cap}</span>
                </div>
              ))}
            </div>
            {/* Sticky price right col */}
            <div className="reveal reveal-d2" style={{ flex: "0 0 300px", position: "sticky", top: 100, background: "rgba(10,7,22,.78)", border: "1px solid rgba(123,79,158,.2)", borderRadius: 20, padding: 28 }}>
              <div style={{ background: "rgba(123,79,158,.12)", border: "1px solid rgba(123,79,158,.25)", borderRadius: 16, padding: "20px 24px", marginBottom: 20, textAlign: "center" }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{ color: "#FFFFFF", fontSize: 38, fontWeight: 800, letterSpacing: -1 }}>R$37,90</span>
                  <span style={{ fontSize: 17, color: "rgba(184,160,212,.6)", textDecoration: "line-through" }}>R$89,90</span>
                </div>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
                  <span style={{ background: "rgba(196,84,122,.18)", border: "1px solid rgba(196,84,122,.28)", color: "#E8749A", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 99 }}>desconto Instagram</span>
                </div>
                <p style={{ color: "#B8A0D4", fontSize: 13 }}>Pagamento único via Pix. Sem assinatura.</p>
              </div>
              <Link href="/cadastro" className="btn-primary" style={{ width: "100%", justifyContent: "center", boxSizing: "border-box" as const }}>Ver o laudo do meu pet →</Link>
              <div style={{ marginTop: 16, textAlign: "center" }}>
                <div style={{ color: "#B8A0D4", fontSize: 13, marginBottom: 8 }}>🛡️ Garantia de 7 dias</div>
                <p style={{ color: "rgba(100,90,120,.8)", fontSize: 12, lineHeight: 1.5 }}>Sobre comportamento e personalidade.<br />Não substitui veterinário.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: "0 16px", maxWidth: "none", position: "relative", zIndex: 2, marginBottom: 32 }}>
        <div style={{ maxWidth: 1060, margin: "0 auto", display: "flex", gap: 64, alignItems: "flex-start", flexWrap: "wrap" }}>
          {/* Sticky left heading */}
          <div className="reveal" style={{ flex: "0 0 220px", position: "sticky", top: 120 }}>
            <h2 style={{ fontSize: "clamp(26px,3.5vw,38px)", fontWeight: 800, letterSpacing: -0.8, lineHeight: 1.2 }}>Perguntas<br />frequentes</h2>
            <p style={{ color: "#2E2B5F", fontSize: 14, marginTop: 12, lineHeight: 1.6 }}>Alguma dúvida?<br />A gente responde.</p>
          </div>
          {/* FAQ items */}
          <div className="reveal" style={{ flex: 1, minWidth: 280 }}>
            <FAQItem q="Preciso acreditar em astrologia para usar?" a="Não precisa. O SignoPet cruza dados astrológicos com perfis comportamentais de raça e pelagem — uma combinação que surpreende até os mais céticos." />
            <FAQItem q="É realmente grátis?" a="O card é sempre grátis, sem limite de pets. O laudo completo é opcional e custa R$37,90, pagamento único." />
            <FAQItem q="O que tem no laudo pago?" a="9 capítulos personalizados: personalidade, emoções, vínculo com o tutor, energia ideal, comunicação, comportamento e mais. Cada laudo é único — gerado a partir do cruzamento entre signo, raça, pelagem e data de nascimento do seu pet." />
            <FAQItem q="Não sei a data de nascimento do meu pet." a="Usa a data do resgate ou uma estimativa. O sistema funciona com datas aproximadas — e o resultado ainda assim costuma surpreender." />
            <FAQItem q="Como funciona a garantia?" a="7 dias de garantia total. Se não curtir o laudo, devolvemos o dinheiro sem formulário e sem perguntas. Só manda email." />
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section style={{ padding: "0 16px 16px", position: "relative", zIndex: 2 }}>
        <div style={{ background: "rgba(10,7,22,.78)", border: "1px solid rgba(123,79,158,.22)", borderRadius: 28, maxWidth: 1140, margin: "0 auto", padding: "80px 48px", textAlign: "center", position: "relative" }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 900, height: 500, background: "radial-gradient(ellipse,rgba(196,84,122,.15) 0%,rgba(123,79,158,.1) 40%,transparent 70%)", pointerEvents: "none" }} />
          <h2 className="reveal" style={{ fontSize: "clamp(34px,6vw,58px)", fontWeight: 800, letterSpacing: -1.5, marginBottom: 16, background: "linear-gradient(135deg,#F5F0FF 30%,#E8749A 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Qual é o signo do seu pet?</h2>
          <p className="reveal reveal-d1" style={{ color: "#B8A0D4", fontSize: 17, marginBottom: 44 }}>Grátis. Pronto em menos de 1 minuto.</p>
          <div className="final-btns reveal reveal-d2" style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/cadastro?tipo=cachorro" className="btn-primary large">🐶 Meu pet é cachorro</Link>
            <Link href="/cadastro?tipo=gato" className="btn-secondary large">🐱 Meu pet é gato</Link>
          </div>
          <p className="reveal reveal-d3" style={{ color: "rgba(184,160,212,.45)", fontSize: 13, marginTop: 22 }}>Sem cadastro. Sem assinatura. O card é sempre grátis.</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: "rgba(10,7,22,.88)", borderTop: "1px solid rgba(123,79,158,.18)", padding: "44px 40px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 24, position: "relative", zIndex: 2 }}>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-branca-horizontal.svg" alt="SignoPet" style={{ height: 24, width: "auto", display: "block", marginBottom: 6 }} />
          <p style={{ color: "rgba(184,160,212,0.6)", fontSize: 12 }}>Descubra por que seu pet é assim.</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <a href="https://instagram.com/signopet" style={{ color: "#B8A0D4", fontSize: 13, textDecoration: "none", display: "block", marginBottom: 5 }}>Instagram @signopet</a>
          <a href="mailto:signopet@gmail.com" style={{ color: "#B8A0D4", fontSize: 13, textDecoration: "none", display: "block", marginBottom: 5 }}>signopet@gmail.com</a>
          <p style={{ color: "rgba(184,160,212,0.6)", fontSize: 11, lineHeight: 1.6 }}>© 2026 SignoPet · Produto de entretenimento.<br />Para saúde, consulte um veterinário.</p>
        </div>
      </footer>
    </>
  );
}
