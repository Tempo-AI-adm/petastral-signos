"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

// ─── Data Constants ───────────────────────────────────────────────────────────

const WORDS = ["grudento","avoado","ciumento","dramático","mandão","nervoso","preguiçoso","intenso","teimoso","controlador"];

const MARQUEE_ITEMS = [
  { text: "🐾 Signo × raça × pelagem = comportamento explicado", pink: true },
  { text: "📖 9 capítulos com dicas práticas pro dia a dia", pink: false },
  { text: "🔮 Cada signo reage diferente ao adestramento", pink: true },
  { text: "🏥 Cruzamento com base em veterinários e adestradores", pink: false },
  { text: "⚡ Descubra o super poder único do seu pet", pink: true },
  { text: "💜 Compatibilidade real entre tutor e pet", pink: false },
  { text: "🌟 Padrões de comportamento que fazem sentido", pink: true },
  { text: "🐶 SRD, Golden, Persa, Pinscher — funciona pra qualquer raça", pink: false },
];

const RACE_STRIP = [
  { file: "bassethound-mesclado.png", name: "Basset", sign: "♊ Gêmeos" },
  { file: "boxer.png", name: "Boxer", sign: "♈ Áries" },
  { file: "chihuahua-caramelo.png", name: "Chihuahua", sign: "♏ Escorpião" },
  { file: "dachshund-preto-fogo.png", name: "Dachshund", sign: "♑ Capricórnio" },
  { file: "siames.png", name: "Siamês", sign: "♌ Leão" },
  { file: "persa-laranja.png", name: "Persa", sign: "♉ Touro" },
  { file: "galgo-cinza.png", name: "Galgo", sign: "♍ Virgem" },
  { file: "sphynx-rosa.png", name: "Sphynx", sign: "♓ Peixes" },
  { file: "cao-srd-branco.png", name: "SRD", sign: "♒ Aquário" },
  { file: "pitbull-caramelo.png", name: "Pitbull", sign: "♈ Áries" },
  { file: "ragdoll.png", name: "Ragdoll", sign: "♋ Câncer" },
  { file: "srd-longo-preto-marrom.png", name: "SRD", sign: "♏ Escorpião" },
  { file: "yorkshire.png", name: "Yorkshire", sign: "♍ Virgem" },
  { file: "spitz-laranja.png", name: "Spitz", sign: "♌ Leão" },
  { file: "shihtzu-preto-branco.png", name: "Shih Tzu", sign: "♎ Libra" },
  { file: "gato-srd-branco.png", name: "SRD", sign: "♓ Peixes" },
];

const CHAPTERS = [
  { emoji: "🌟", text: "Personalidade & Temperamento" },
  { emoji: "⚡", text: "Instintos & Impulsos" },
  { emoji: "❤️", text: "Vínculo com o tutor" },
  { emoji: "😰", text: "Medos & Gatilhos de estresse" },
  { emoji: "🏠", text: "Comportamento em casa" },
  { emoji: "🌙", text: "Energia & Ritmo de vida" },
  { emoji: "🐾", text: "Linguagem corporal & Comunicação" },
  { emoji: "🍖", text: "Alimentação & Corpo" },
  { emoji: "🔮", text: "Previsão do próximo ciclo" },
];

const TESTIMONIALS = [
  { img: "/depoimento_cisco.jpeg", initial: "C", name: "Cisco (Pinscher · Sagitário)", handle: "@bruna_franciscojasminemaya", quote: "Quando chegou o segundo cachorro eu achei que o Cisco ia enlouquecer. Aí vi que Sagitário precisa de espaço e hierarquia clara. Mudei a rotina e melhorou na hora." },
  { img: "/depoimento_gus.jpeg", initial: "G", name: "Gus (Caramelo · Áries)", handle: "@_gus.dog", quote: "Descobri que o Gus é ariano. Agora ele tem direitos. Se eu chegar atrasado com a ração, é desrespeito ao signo. 😄" },
  { img: "/depoimento_maria.jpeg", initial: "M", name: "Maria Guadalupe (Shih Tzu · Gêmeos)", handle: "@falcaomarina", quote: "Comecei a explorar a curiosidade dela em vez de brigar. Gêmeos precisa de estímulo mental. Ensinei um truque novo por semana — ela mudou completamente." },
  { img: "/golden-tobias.png", initial: "T", name: "Tobias (Golden · Câncer)", handle: "@amanda.tobias.pet", quote: "Achei que era exagero, mas o laudo descreveu exatamente como o Tobias age quando fico fora. Câncer mesmo — apegado, dramático e completamente meu.", fallback: { emoji: "🐕", bg: "linear-gradient(135deg,#b8860b,#daa520)" } },
  { img: "/mel-srd.png", initial: "M", name: "Mel (SRD · Libra)", handle: "@rafaelinha.mel", quote: "A Mel fica em cima de qualquer pessoa que apareça em casa. O laudo disse que Libra precisa de equilíbrio social. Faz todo sentido agora.", fallback: { emoji: "🐈", bg: "linear-gradient(135deg,#666,#999)" } },
  { img: "/bulldog-zeus.png", initial: "Z", name: "Zeus (Bulldog · Capricórnio)", handle: "@zeusthefrench", quote: "Meu Bulldog é o ser mais teimoso que eu já vi. Ler que Capricórnio não cede até entender o motivo foi uma revelação. Agora eu negocio com ele.", fallback: { emoji: "🐶", bg: "linear-gradient(135deg,#8b4513,#a0522d)" } },
];

const FAQ_ITEMS = [
  { q: "É realmente grátis?", a: "Sim. O card astrológico é 100% grátis, sem cadastro e sem assinatura. O laudo completo (9 capítulos) é opcional, por R$37,90." },
  { q: "Como é calculado o signo do meu pet?", a: "Pelo dia e mês de nascimento, igual ao signo humano. Cruzamos com a raça, pelagem e elemento para gerar o perfil completo." },
  { q: "O que tem no laudo astral?", a: "9 capítulos personalizados: personalidade, instintos, vínculo com o tutor, medos, comportamento em casa, energia, linguagem corporal, alimentação e previsão do próximo ciclo." },
  { q: "Como recebo o laudo?", a: "Por e-mail em até 5 minutos após o pagamento, e via link acessível a qualquer hora." },
  { q: "Funciona para qualquer raça?", a: "Sim. Funciona para cães, gatos, SRDs e qualquer raça reconhecida. Quanto mais específica a raça, mais rico o cruzamento." },
  { q: "Posso fazer para mais de um pet?", a: "Sim, pode criar quantos quiser. Cada pet gera um card e um laudo únicos." },
];

// ─── AnimatedCounter ──────────────────────────────────────────────────────────
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

// ─── FAQItem (controlled) ─────────────────────────────────────────────────────
function FAQItem({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.65)", backdropFilter: "blur(8px)", border: "1px solid rgba(123,79,158,0.15)", borderRadius: 16, overflow: "hidden", marginBottom: 10 }}>
      <button
        onClick={onToggle}
        style={{ width: "100%", background: "none", border: "none", padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", color: "#1A1035", fontSize: 15, fontWeight: 600, textAlign: "left", gap: 12, fontFamily: "inherit" }}
      >
        <span>{q}</span>
        <span style={{ color: "#7B4F9E", fontSize: 22, flexShrink: 0, transition: "transform 0.25s ease", transform: isOpen ? "rotate(45deg)" : "rotate(0deg)", display: "inline-block" }}>+</span>
      </button>
      {isOpen && <div style={{ padding: "0 22px 18px", fontSize: 14, color: "#4A3B6B", lineHeight: 1.65 }}>{a}</div>}
    </div>
  );
}

// ─── Page CSS (extracted to avoid SSR template-literal re-processing) ────────
const PAGE_CSS = `
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{overflow-x:hidden;max-width:100vw}
  body{background:#EEF2FB !important;min-height:100vh}
  @keyframes wordOut{0%{opacity:1;transform:translateY(0);filter:blur(0)}100%{opacity:0;transform:translateY(-10px);filter:blur(3px)}}
  @keyframes wordIn{0%{opacity:0;transform:translateY(10px);filter:blur(3px)}100%{opacity:1;transform:translateY(0);filter:blur(0)}}
  @keyframes marqueeScroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
  .word-out{animation:wordOut 0.3s ease forwards}
  .word-in{animation:wordIn 0.3s ease forwards}
  .reveal{opacity:0;transform:translateY(24px);transition:opacity 0.65s ease,transform 0.65s ease}
  .reveal-d1{transition-delay:.1s}.reveal-d2{transition-delay:.2s}.reveal-d3{transition-delay:.3s}.reveal-d4{transition-delay:.45s}
  .hero-btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
  .btn{border:none;cursor:pointer;font-family:inherit;display:inline-flex;align-items:center;gap:8px;text-decoration:none;transition:all 0.2s ease}
  .btn-solid{background:#1A1035;color:#fff;border-radius:50px;padding:16px 36px;font-size:16px;font-weight:700}
  .btn-solid:hover{background:#7B4F9E;transform:translateY(-2px)}
  .race-strip{display:flex;gap:18px;justify-content:center;flex-wrap:wrap;margin-top:32px}
  .race-pill{display:flex;flex-direction:column;align-items:center;gap:5px;cursor:default}
  .race-pill-name{font-size:11px;font-weight:600;color:#1A1035}
  .race-pill-sign{font-size:10px;color:#7B4F9E}
  .steps-row{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
  .testimonials-row{display:flex;gap:20px;flex-wrap:wrap}
  .ch-item{display:flex;align-items:center;gap:14px;padding:12px 16px;border-radius:12px;border:1px solid rgba(123,79,158,0.08);margin-bottom:8px;transition:all 0.3s ease;cursor:default}
  .ch-item.active{background:rgba(255,255,255,0.10);border-color:rgba(123,79,158,0.3);box-shadow:0 4px 20px rgba(123,79,158,0.1);transform:translateX(6px)}
  .ch-accent{width:4px;height:36px;border-radius:2px;background:rgba(123,79,158,0.2);flex-shrink:0;transition:all 0.3s ease}
  .ch-item.active .ch-accent{background:linear-gradient(180deg,#7B4F9E,#C4547A)}
  .marquee-wrapper{overflow:hidden;position:relative}
  .marquee-wrapper::before,.marquee-wrapper::after{content:none;position:absolute;top:0;bottom:0;width:80px;z-index:2;pointer-events:none}
  .marquee-wrapper::before{left:0;background:linear-gradient(90deg,#EEF2FB,transparent)}
  .marquee-wrapper::after{right:0;background:linear-gradient(270deg,#EEF2FB,transparent)}
  @media(max-width:768px){
    .hero-btns{flex-direction:column;align-items:stretch}
    .hero-btns a{text-align:center;justify-content:center}
    .final-btns{flex-direction:column!important;align-items:stretch!important}
    .final-btns a{text-align:center;justify-content:center}
    .features-layout{flex-direction:column!important;align-items:center!important}
    .laudo-layout{flex-direction:column!important}
    .price-sticky{position:static!important}
    .steps-row{flex-wrap:nowrap!important;overflow-x:auto!important;scroll-snap-type:x mandatory!important;-webkit-overflow-scrolling:touch!important;padding-bottom:12px!important;gap:12px!important;justify-content:flex-start!important}
    .steps-row .step-card{min-width:260px!important;flex-shrink:0!important;scroll-snap-align:start!important;max-width:none!important}
    .testimonials-row{flex-wrap:nowrap!important;overflow-x:auto!important;scroll-snap-type:x mandatory!important;-webkit-overflow-scrolling:touch!important;padding-bottom:12px!important;gap:12px!important}
    .testimonials-row .testi-card{min-width:85vw!important;flex-shrink:0!important;scroll-snap-align:start!important}
    .steps-row::-webkit-scrollbar,.testimonials-row::-webkit-scrollbar{display:none}
    .steps-row,.testimonials-row{scrollbar-width:none}
    .reveal{transition-delay:0s!important}
    #hero{padding-top:100px!important;padding-bottom:40px!important;min-height:auto!important}
  }
  @media(max-width:768px){ .testi-grid{grid-template-columns:1fr!important} }
`;

// ─── HomePage ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [wordAnim, setWordAnim] = useState("");
  const [activeChapter, setActiveChapter] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [raceIndex, setRaceIndex] = useState(0);
  const stepsRef = useRef<HTMLDivElement>(null);
  const testiRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  // Scroll handler
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 40);
  }, []);

  useEffect(() => {
    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pet_id: null, event_type: 'page_viewed' }),
    }).catch(() => {})
  }, [])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Rotating word
  useEffect(() => {
    const interval = setInterval(() => {
      setWordAnim("word-out");
      setTimeout(() => {
        setWordIndex(i => (i + 1) % WORDS.length);
        setWordAnim("word-in");
      }, 290);
      setTimeout(() => setWordAnim(""), 640);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Active chapter cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveChapter(prev => (prev + 1) % 9);
    }, 1600);
    return () => clearInterval(interval);
  }, []);

  // Race strip rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setRaceIndex(prev => (prev + 1) % RACE_STRIP.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Scroll reveal
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).style.opacity = "1";
          (e.target as HTMLElement).style.transform = "translateY(0)";
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Mobile carousels
  useEffect(() => {
    const isMobile = () => window.innerWidth <= 768;
    const stepsInt = setInterval(() => {
      if (!isMobile() || !stepsRef.current) return;
      const el = stepsRef.current;
      const cardW = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 16 : 276;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 10) el.scrollTo({ left: 0, behavior: "smooth" });
      else el.scrollBy({ left: cardW, behavior: "smooth" });
    }, 3000);
    const testiInt = setInterval(() => {
      if (!isMobile() || !testiRef.current) return;
      const el = testiRef.current;
      const cardW = Math.min(window.innerWidth * 0.85, 400) + 20;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 10) el.scrollTo({ left: 0, behavior: "smooth" });
      else el.scrollBy({ left: cardW, behavior: "smooth" });
    }, 3500);
    return () => { clearInterval(stepsInt); clearInterval(testiInt); };
  }, []);

  // Constellation canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    type Point = { x: number; y: number; vx: number; vy: number; r: number; opacity: number };
    let points: Point[] = [];

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      points = Array.from({ length: 90 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 140) {
            ctx.strokeStyle = `rgba(100,70,180,${points[i].opacity * (1 - d / 140)})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
          }
        }
      }
      for (const p of points) {
        ctx.fillStyle = `rgba(140,100,220,${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      }
      rafRef.current = requestAnimationFrame(draw);
    };

    init();
    draw();

    const onResize = () => init();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // unused but kept per spec
  void AnimatedCounter;

  return (
    <>
      <style>{PAGE_CSS}</style>

      {/* Canvas constellation */}
      <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: scrolled ? "13px 36px" : "18px 36px",
        background: scrolled ? "rgba(238,242,251,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(24px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(123,79,158,0.12)" : "1px solid transparent",
        transition: "all 0.3s ease",
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-cor-unica.png" alt="SignoPet" style={{ height: 40, width: "auto" }} />
        </Link>
        <a
          href="/cadastro"
          style={{ background: "#1A1035", color: "#fff", borderRadius: 50, padding: "10px 24px", fontSize: 14, fontWeight: 700, textDecoration: "none", transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.background = "#7B4F9E"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#1A1035"; }}
          onClick={() => { fetch('/api/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pet_id: null, event_type: 'cadastro_iniciado' }) }).catch(() => {}) }}
        >
          Criar card grátis 🐾
        </a>
      </nav>

      {/* ── HERO ── */}
      <section id="hero" style={{ padding: "130px 24px 60px", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", position: "relative", zIndex: 2 }}>

        {/* Badge */}
        <div className="reveal" style={{ marginBottom: 18 }}>
          <span style={{ background: "rgba(123,79,158,0.09)", border: "1px solid rgba(123,79,158,0.22)", color: "#7B4F9E", fontSize: 13, fontWeight: 600, padding: "6px 18px", borderRadius: 99 }}>✨ Grátis · Rápido · Compartilhável</span>
        </div>

        {/* H1 */}
        <h1 className="reveal reveal-d1" style={{ fontSize: "clamp(30px,5.5vw,60px)", fontWeight: 800, lineHeight: 1.12, color: "#1A1035", margin: "0 auto 22px", maxWidth: 800 }}>
          Descubra por que seu pet é{" "}
          <span className={wordAnim} style={{ color: "#7B4F9E", display: "inline-block", position: "relative" }}>
            {WORDS[wordIndex]}
            <span style={{ position: "absolute", bottom: -3, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,#7B4F9E,#E8749A)", borderRadius: 2 }} />
          </span>
        </h1>

        {/* Sub */}
        <p className="reveal reveal-d2" style={{ color: "#4A3B6B", fontSize: "clamp(15px,2vw,18px)", maxWidth: 460, lineHeight: 1.65, marginBottom: 36 }}>
          Card astrológico grátis em 1 minuto. Laudo astral completo por R$37,90.
        </p>

        {/* CTAs */}
        <div className="hero-btns reveal reveal-d3" style={{ marginBottom: 14 }}>
          <a href="/cadastro?tipo=cachorro" className="btn btn-solid" onClick={() => { fetch('/api/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pet_id: null, event_type: 'cadastro_iniciado' }) }).catch(() => {}) }}>🐶 É um cachorro</a>
          <a href="/cadastro?tipo=gato" className="btn btn-solid" onClick={() => { fetch('/api/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pet_id: null, event_type: 'cadastro_iniciado' }) }).catch(() => {}) }}>🐱 É um gato</a>
        </div>

        {/* Fine print */}
        <p className="reveal reveal-d4" style={{ color: "rgba(74,59,107,0.6)", fontSize: 13, marginBottom: 48 }}>Sem cadastro · Sem assinatura · Sempre grátis</p>

        {/* Hero card */}
        <div className="reveal" style={{ position: "relative" }}>
          {/* Spotlight — depth cinematográfico atrás do card */}
          <div style={{ position: "absolute", inset: -64, background: "radial-gradient(ellipse at 50% 45%, rgba(212,197,238,0.92) 0%, rgba(212,197,238,0.48) 34%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />
          <div style={{ width: 260, borderRadius: 24, overflow: "hidden", background: "#FAFAFA", border: "1px solid #E8E0F0", boxShadow: "0 8px 32px rgba(0,0,0,0.09), 0 2px 8px rgba(0,0,0,0.05)", transform: "perspective(900px) rotateY(-3deg)", position: "relative", zIndex: 1 }}>
            {/* Micro estrelas cósmicas — estáticas, opacidade baixíssima */}
            <svg style={{ position: "absolute", top: 13, right: 15, opacity: 0.2, pointerEvents: "none" }} width="5" height="5" viewBox="0 0 5 5" fill="none"><circle cx="2.5" cy="2.5" r="2" fill="#7B4F9E"/></svg>
            <svg style={{ position: "absolute", top: 96, left: 9, opacity: 0.14, pointerEvents: "none" }} width="4" height="4" viewBox="0 0 4 4" fill="none"><circle cx="2" cy="2" r="1.5" fill="#7B4F9E"/></svg>
            <svg style={{ position: "absolute", bottom: 92, right: 11, opacity: 0.17, pointerEvents: "none" }} width="5" height="5" viewBox="0 0 5 5" fill="none"><circle cx="2.5" cy="2.5" r="1.8" fill="#C4547A"/></svg>
            {/* Header */}
            <div style={{ padding: "16px 16px 14px", borderBottom: "1px solid #F0EBF8", position: "relative", zIndex: 1 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#EDE5F8", borderRadius: 99, padding: "3px 10px", marginBottom: 9 }}>
                <span style={{ fontSize: 8, color: "#9B8AB4", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: 1 }}>RARIDADE</span>
                <span style={{ fontSize: 8, color: "#7B4F9E", fontWeight: 800 }}>· Épico ✦</span>
              </div>
              <div style={{ color: "#1a1a1a", fontSize: 22, fontWeight: 800, lineHeight: 1, marginBottom: 4 }}>Alfredo</div>
              <div style={{ color: "#6B5B8A", fontSize: 10 }}>SRD · Escorpião · Água</div>
              <div style={{ color: "#9B8AB4", fontSize: 9, marginTop: 2, fontStyle: "italic" }}>Manipulador Emocional</div>
            </div>
            {/* Avatar — cutout sem moldura, vaza levemente sobre a borda do header */}
            <div style={{ background: "#F5F0FF", display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: 10, paddingTop: 4, position: "relative", zIndex: 2, marginTop: -8 }}>
              {/* Arco orbital — linha fina incompleta, muito sutil */}
              <svg style={{ position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)", opacity: 0.10, pointerEvents: "none" }} width="130" height="58" viewBox="0 0 130 58" fill="none">
                <path d="M6 52 Q65 4 124 52" stroke="#7B4F9E" strokeWidth="0.9" strokeDasharray="3 6" fill="none"/>
              </svg>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/mascote-perto.png" alt="mascote" style={{ height: 96, width: "auto", objectFit: "contain", display: "block", position: "relative", zIndex: 1, filter: "drop-shadow(0 6px 16px rgba(123,79,158,0.12))" }} />
              <div style={{ fontSize: 9, color: "#B8A0D4", fontStyle: "italic", marginTop: 5 }}>← seu pet aqui</div>
            </div>
            {/* Super Poder — bloco tipográfico, sem borda/badge */}
            <div style={{ margin: "13px 16px 9px", textAlign: "center" }}>
              <div style={{ color: "#9B8AB4", fontSize: 8, textTransform: "uppercase" as const, letterSpacing: 1.8, marginBottom: 4, fontWeight: 700 }}>Super Poder</div>
              <div style={{ color: "#1a1a1a", fontSize: 12, fontWeight: 700, fontStyle: "italic" }}>✨ Leitura emocional implacável</div>
            </div>
            {/* Divisor */}
            <div style={{ height: 1, background: "#F0EBF8", margin: "0 14px 11px" }} />
            {/* Atributos + Elemento */}
            <div style={{ margin: "0 14px 11px", display: "flex", gap: 8 }}>
              <div style={{ flex: 1 }}>
                {[
                  { label: "Drama", value: 38, icon: <svg key="d" width="10" height="10" viewBox="0 0 12 12" fill="none"><circle cx="3.5" cy="5.5" r="2.5" stroke="#7B4F9E" strokeWidth="1.2"/><path d="M2.2 7C2.8 7.8 4.2 7.8 4.8 7" stroke="#7B4F9E" strokeWidth="1" strokeLinecap="round"/><circle cx="8.5" cy="5.5" r="2.5" stroke="#7B4F9E" strokeWidth="1.2"/><path d="M7.5 7.5C8 6.8 9 6.8 9.5 7.5" stroke="#7B4F9E" strokeWidth="1" strokeLinecap="round"/></svg> },
                  { label: "Carência", value: 18, icon: <svg key="c" width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M6 10C6 10 1.5 6.5 1.5 4C1.5 2.6 2.6 1.5 4 1.5C5 1.5 5.7 2.2 6 2.7C6.3 2.2 7 1.5 8 1.5C9.4 1.5 10.5 2.6 10.5 4C10.5 6.5 6 10 6 10Z" stroke="#7B4F9E" strokeWidth="1.2" strokeLinejoin="round"/></svg> },
                  { label: "Fome", value: 72, icon: <svg key="f" width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M3 1V4C3 4.8 3.5 5.5 4 5.5V11" stroke="#7B4F9E" strokeWidth="1.1" strokeLinecap="round"/><path d="M2 1V5.5M5 1V5.5" stroke="#7B4F9E" strokeWidth="1.1" strokeLinecap="round"/><path d="M9 1C9 1 10 3 10 4.2C10 5 9.5 5.5 9 5.5V11" stroke="#7B4F9E" strokeWidth="1.1" strokeLinecap="round"/></svg> },
                  { label: "Caos", value: 67, icon: <svg key="ca" width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M7 1L4 6.5H7.5L5 11" stroke="#7B4F9E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
                  { label: "Manipulação", value: 93, icon: <svg key="m" width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M3 2H9M6 2V4M4 4H8M4 4V7M8 4V7" stroke="#7B4F9E" strokeWidth="1.1" strokeLinecap="round"/><circle cx="6" cy="9.5" r="1.8" stroke="#7B4F9E" strokeWidth="1.1"/></svg> },
                ].map(attr => (
                  <div key={attr.label} style={{ marginBottom: 5 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                      <span style={{ fontSize: 8, color: "#6B5B8A", fontWeight: 600, display: "flex", alignItems: "center", gap: 3 }}>{attr.icon}{attr.label}</span>
                      <span style={{ fontSize: 8, color: "#7B4F9E", fontWeight: 700 }}>{attr.value}/100</span>
                    </div>
                    <div style={{ height: 3, background: "#E8E0F0", borderRadius: 99 }}>
                      <div style={{ width: `${attr.value}%`, height: "100%", background: "#7B4F9E", borderRadius: 99 }} />
                    </div>
                  </div>
                ))}
              </div>
              {/* Elemento — borda mais leve */}
              <div style={{ width: 50, background: "#F3EEF9", borderRadius: 12, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "8px 4px", gap: 3 }}>
                <div style={{ fontSize: 18 }}>🌊</div>
                <div style={{ fontSize: 7, color: "#9B8AB4", textTransform: "uppercase" as const, letterSpacing: 0.5, textAlign: "center", fontWeight: 700 }}>ELEMENTO</div>
                <div style={{ fontSize: 9, color: "#2d2d2d", fontWeight: 700, textAlign: "center" }}>Água</div>
              </div>
            </div>
            {/* Compatibilidade — % grande, estrelas flanqueando, label acima */}
            <div style={{ margin: "0 14px 14px", textAlign: "center" }}>
              <div style={{ color: "#9B8AB4", fontSize: 8, marginBottom: 3, letterSpacing: 0.5 }}>compatibilidade com você:</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
                <span style={{ color: "#C9B8E8", fontSize: 13, lineHeight: 1 }}>✦</span>
                <span style={{ color: "#7B4F9E", fontSize: 33, fontWeight: 800, lineHeight: 1 }}>87%</span>
                <span style={{ color: "#C9B8E8", fontSize: 13, lineHeight: 1 }}>✦</span>
              </div>
              <div style={{ color: "#6B5B8A", fontSize: 10, marginTop: 5, fontStyle: "italic" }}>Finge indiferença. Sente tudo.</div>
            </div>
            {/* Footer */}
            <div style={{ padding: 8, textAlign: "center", borderTop: "1px solid #F0EBF8", color: "#B8A0D4", fontSize: 9, letterSpacing: 1 }}>🐾 gratuito em @signopet</div>
          </div>
        </div>

        {/* Race strip */}
        <div className="race-strip reveal" style={{ display: "flex", gap: 16, justifyContent: "center", alignItems: "flex-end", marginTop: 32, minHeight: 80 }}>
          {[-1, 0, 1].map(offset => {
            const idx = (raceIndex + offset + RACE_STRIP.length) % RACE_STRIP.length;
            const item = RACE_STRIP[idx];
            const isCenter = offset === 0;
            return (
              <div key={idx} className="race-pill" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, transition: "all 0.5s ease", opacity: isCenter ? 1 : 0.5, minWidth: 56, height: 80 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/avatars/${item.file}`}
                  alt={item.name}
                  loading="lazy"
                  style={{ width: isCenter ? 56 : 40, height: isCenter ? 56 : 40, borderRadius: "50%", border: isCenter ? "2.5px solid rgba(123,79,158,0.5)" : "2px solid rgba(123,79,158,0.2)", objectFit: "cover", objectPosition: "center top", display: "block", transition: "all 0.5s ease", flexShrink: 0 }}
                  onError={e => { e.currentTarget.style.display = "none"; }}
                />
                {isCenter && <span className="race-pill-name">{item.name}</span>}
                {isCenter && <span className="race-pill-sign">{item.sign}</span>}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── PROOF BAR ── */}
      <div style={{ background: "rgba(255,255,255,0.55)", backdropFilter: "blur(16px)", borderTop: "1px solid rgba(123,79,158,0.1)", borderBottom: "1px solid rgba(123,79,158,0.1)", padding: "18px 24px", textAlign: "center", position: "relative", zIndex: 2 }}>
        <p style={{ margin: 0, fontSize: 15, color: "#4A3B6B" }}>
          Mais de{" "}
          <span style={{ fontWeight: 800, fontSize: 30, color: "#C4547A", textShadow: "0 0 20px rgba(196,84,122,0.3)" }}>3.000</span>
          {" "}tutores já descobriram o signo do pet
        </p>
      </div>

      {/* ── MARQUEE ── */}
      <div className="marquee-wrapper" style={{ background: "rgba(255,255,255,0.4)", backdropFilter: "blur(8px)", borderBottom: "1px solid rgba(123,79,158,0.08)", padding: "12px 0", position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", width: "max-content", animation: "marqueeScroll 38s linear infinite" }}>
          {[0, 1].map(copy => (
            <div key={copy} style={{ display: "flex", whiteSpace: "nowrap" }}>
              {MARQUEE_ITEMS.map((item, j) => (
                <span key={j} style={{ color: item.pink ? "#C4547A" : "#6B5B8A", fontSize: 13, padding: "0 28px", fontWeight: item.pink ? 600 : 400 }}>{item.text}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── O QUE VOCÊ RECEBE ── */}
      <section style={{ background: "rgba(255,255,255,0.55)", backdropFilter: "blur(16px)", padding: "72px 24px", position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ display: "inline-block", background: "rgba(15,110,86,0.08)", border: "1px solid rgba(15,110,86,0.25)", color: "#0F6E56", fontSize: 12, fontWeight: 700, padding: "5px 14px", borderRadius: 99, letterSpacing: 1, textTransform: "uppercase" as const, marginBottom: 16 }}>TUDO ISSO É GRÁTIS</div>
            <h2 style={{ color: "#1A1035", fontSize: "clamp(28px,4.5vw,44px)", fontWeight: 800, letterSpacing: -0.8, marginBottom: 12 }}>O que você recebe — de graça</h2>
            <p style={{ color: "#4A3B6B", fontSize: 17 }}>Parece uma carta colecionável. Funciona como um espelho.</p>
          </div>
          <div className="features-layout" style={{ display: "flex", alignItems: "center", gap: 60, justifyContent: "center" }}>
            {/* Card mockup — Elemento Fogo */}
            <div className="reveal reveal-d1" style={{ transform: "rotate(-3deg)", flexShrink: 0, position: "relative" }}>
              <div style={{ width: 255, borderRadius: 24, overflow: "hidden", background: "#FFF8F3", border: "1px solid #F5DDD5", boxShadow: "0 8px 32px rgba(0,0,0,0.09), 0 2px 8px rgba(0,0,0,0.05)" }}>
                {/* Micro dots âmbar/rosa */}
                <svg style={{ position: "absolute", top: 13, right: 15, opacity: 0.22, pointerEvents: "none" }} width="5" height="5" viewBox="0 0 5 5" fill="none"><circle cx="2.5" cy="2.5" r="2" fill="#C4547A"/></svg>
                <svg style={{ position: "absolute", top: 94, left: 9, opacity: 0.15, pointerEvents: "none" }} width="4" height="4" viewBox="0 0 4 4" fill="none"><circle cx="2" cy="2" r="1.5" fill="#F59E0B"/></svg>
                <svg style={{ position: "absolute", bottom: 88, right: 11, opacity: 0.18, pointerEvents: "none" }} width="5" height="5" viewBox="0 0 5 5" fill="none"><circle cx="2.5" cy="2.5" r="1.8" fill="#C4547A"/></svg>
                {/* Header */}
                <div style={{ padding: "16px 16px 14px", borderBottom: "1px solid #F5DDD5", position: "relative", zIndex: 1 }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#FDECEA", borderRadius: 99, padding: "3px 10px", marginBottom: 9 }}>
                    <span style={{ fontSize: 8, color: "#C4547A", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: 1 }}>RARIDADE</span>
                    <span style={{ fontSize: 8, color: "#C4547A", fontWeight: 800 }}>· Lendário ✦</span>
                  </div>
                  <div style={{ color: "#1a1a1a", fontSize: 22, fontWeight: 800, lineHeight: 1, marginBottom: 4 }}>Brasa</div>
                  <div style={{ color: "#7A5540", fontSize: 10 }}>Golden Retriever · Touro · Fogo</div>
                  <div style={{ color: "#C4547A", fontSize: 9, marginTop: 2, fontStyle: "italic" }}>Caçador Instintivo</div>
                </div>
                {/* Avatar — cutout, vaza sobre borda do header */}
                <div style={{ background: "#FFF0E8", display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: 10, paddingTop: 4, position: "relative", zIndex: 2, marginTop: -8 }}>
                  <svg style={{ position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)", opacity: 0.10, pointerEvents: "none" }} width="130" height="58" viewBox="0 0 130 58" fill="none">
                    <path d="M6 52 Q65 4 124 52" stroke="#C4547A" strokeWidth="0.9" strokeDasharray="3 6" fill="none"/>
                  </svg>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/avatars/Juquinha.png" alt="Juquinha" style={{ height: 96, width: "auto", objectFit: "contain", display: "block", position: "relative", zIndex: 1, filter: "drop-shadow(0 6px 16px rgba(196,84,122,0.12))" }} />
                  <div style={{ fontSize: 9, color: "#E8A0A0", fontStyle: "italic", marginTop: 5 }}>← seu pet aqui</div>
                </div>
                {/* Super Poder — bloco tipográfico */}
                <div style={{ margin: "13px 16px 9px", textAlign: "center" }}>
                  <div style={{ color: "#C4547A", fontSize: 8, textTransform: "uppercase" as const, letterSpacing: 1.8, marginBottom: 4, fontWeight: 700 }}>Super Poder</div>
                  <div style={{ color: "#1a1a1a", fontSize: 12, fontWeight: 700, fontStyle: "italic" }}>🔥 Energia que contagia o ambiente todo</div>
                </div>
                {/* Divisor */}
                <div style={{ height: 1, background: "#F5DDD5", margin: "0 14px 11px" }} />
                {/* Atributos + Elemento */}
                <div style={{ margin: "0 14px 11px", display: "flex", gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    {[
                      { label: "Caos", value: 88, icon: <svg key="ca" width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M7 1L4 6.5H7.5L5 11" stroke="#C4547A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
                      { label: "Drama", value: 72, icon: <svg key="d" width="10" height="10" viewBox="0 0 12 12" fill="none"><circle cx="3.5" cy="5.5" r="2.5" stroke="#C4547A" strokeWidth="1.2"/><path d="M2.2 7C2.8 7.8 4.2 7.8 4.8 7" stroke="#C4547A" strokeWidth="1" strokeLinecap="round"/><circle cx="8.5" cy="5.5" r="2.5" stroke="#C4547A" strokeWidth="1.2"/><path d="M7.5 7.5C8 6.8 9 6.8 9.5 7.5" stroke="#C4547A" strokeWidth="1" strokeLinecap="round"/></svg> },
                      { label: "Impulsividade", value: 65, icon: <svg key="i" width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M6 1L7.5 4.5H11L8.5 6.8L9.5 10.5L6 8.5L2.5 10.5L3.5 6.8L1 4.5H4.5L6 1Z" stroke="#C4547A" strokeWidth="1.1" strokeLinejoin="round"/></svg> },
                      { label: "Energia", value: 91, icon: <svg key="e" width="10" height="10" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="4" stroke="#C4547A" strokeWidth="1.1"/><circle cx="6" cy="6" r="1.5" fill="#C4547A"/></svg> },
                      { label: "Teimosia", value: 79, icon: <svg key="t" width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6H10M7 3L10 6L7 9" stroke="#C4547A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
                    ].map(attr => (
                      <div key={attr.label} style={{ marginBottom: 5 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                          <span style={{ fontSize: 8, color: "#7A5540", fontWeight: 600, display: "flex", alignItems: "center", gap: 3 }}>{attr.icon}{attr.label}</span>
                          <span style={{ fontSize: 8, color: "#C4547A", fontWeight: 700 }}>{attr.value}/100</span>
                        </div>
                        <div style={{ height: 3, background: "#F5DDD5", borderRadius: 99 }}>
                          <div style={{ width: `${attr.value}%`, height: "100%", background: "#C4547A", borderRadius: 99 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Elemento Fogo */}
                  <div style={{ width: 50, background: "#FDECEA", borderRadius: 12, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "8px 4px", gap: 4 }}>
                    <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
                      <path d="M8 17C11.3 17 14 14.4 14 11C14 8.4 12.4 6.3 10 5C10.3 6.3 10 7.7 8.8 8.5C9 6.5 7.8 4.3 6 2.5C6.3 4.7 5.4 6.4 4 7.5C2.8 8.5 2 10 2 11C2 14.4 4.7 17 8 17Z" stroke="#C4547A" strokeWidth="1.2" fill="none" strokeLinejoin="round"/>
                    </svg>
                    <div style={{ fontSize: 7, color: "#C4547A", textTransform: "uppercase" as const, letterSpacing: 0.5, textAlign: "center", fontWeight: 700 }}>ELEMENTO</div>
                    <div style={{ fontSize: 9, color: "#1a1a1a", fontWeight: 700, textAlign: "center" }}>Fogo</div>
                  </div>
                </div>
                {/* Compatibilidade */}
                <div style={{ margin: "0 14px 14px", textAlign: "center" }}>
                  <div style={{ color: "#C4547A", fontSize: 8, marginBottom: 3, letterSpacing: 0.5, opacity: 0.7 }}>compatibilidade com você:</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
                    <span style={{ color: "#F5A0A0", fontSize: 13, lineHeight: 1 }}>✦</span>
                    <span style={{ color: "#C4547A", fontSize: 33, fontWeight: 800, lineHeight: 1 }}>73%</span>
                    <span style={{ color: "#F5A0A0", fontSize: 13, lineHeight: 1 }}>✦</span>
                  </div>
                  <div style={{ color: "#7A5540", fontSize: 10, marginTop: 5, fontStyle: "italic" }}>Parece gentil. É uma força da natureza.</div>
                </div>
                {/* Footer */}
                <div style={{ padding: 8, textAlign: "center", borderTop: "1px solid #F5DDD5", color: "#E8A0A0", fontSize: 9, letterSpacing: 1 }}>🐾 gratuito em @signopet</div>
              </div>
            </div>
            {/* Features list */}
            <div className="reveal reveal-d2" style={{ maxWidth: 400 }}>
              {[
                { emoji: "✨", title: "Signo e elemento", desc: "Sol, Lua e os astros do seu pet baseados na data de nascimento." },
                { emoji: "⚡", title: "Super Poder único", desc: "Gerado pela combinação signo × raça — 84 combinações possíveis." },
                { emoji: "💜", title: "Compatibilidade com tutor", desc: "Percentual + frase personalizada sobre a relação de vocês." },
                { emoji: "📲", title: "Um clique pra compartilhar", desc: "A gente prepara o texto. Você só aperta enviar." },
              ].map(({ emoji, title, desc }) => (
                <div key={title} style={{ display: "flex", gap: 14, marginBottom: 16, background: "rgba(255,255,255,0.8)", border: "1px solid rgba(123,79,158,0.12)", borderRadius: 16, padding: "14px 16px", alignItems: "flex-start" }}>
                  <div style={{ width: 40, height: 40, flexShrink: 0, background: "rgba(123,79,158,0.08)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{emoji}</div>
                  <div>
                    <div style={{ color: "#1A1035", fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{title}</div>
                    <div style={{ color: "#4A3B6B", fontSize: 13, lineHeight: 1.5 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ── */}
      <section style={{ padding: "72px 24px", position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ color: "#1A1035", fontSize: "clamp(28px,4.5vw,44px)", fontWeight: 800, letterSpacing: -0.8, marginBottom: 12 }}>Pronto em menos de 1 minuto</h2>
            <p style={{ color: "#4A3B6B", fontSize: 17 }}>4 passos simples.</p>
          </div>
          <div ref={stepsRef} className="steps-row">
            {[
              { num: 1, emoji: "🐾", title: "Crie seu pet", desc: "Nome, raça, data de nascimento e foto", badge: null, optional: false },
              { num: 2, emoji: "✨", title: "SignoPet calcula", desc: "Signo, elemento, raça e pelagem — tudo cruzado", badge: null, optional: false },
              { num: 3, emoji: "📲", title: "Card pronto pra compartilhar", desc: "Manda no grupo, salva nos Stories", badge: "✅ GRÁTIS", optional: false },
              { num: 4, emoji: "🔮", title: "Laudo astral completo", desc: "9 capítulos sobre o comportamento real do seu pet", badge: "OPCIONAL · R$37,90", optional: true },
            ].map(({ num, emoji, title, desc, badge, optional }, i) => (
              <div key={i} className={`step-card reveal reveal-d${i + 1}`} style={{ flex: 1, minWidth: 220, maxWidth: 240, background: optional ? "rgba(196,84,122,0.04)" : "rgba(255,255,255,0.72)", backdropFilter: "blur(12px)", border: optional ? "1.5px dashed rgba(196,84,122,0.3)" : "1px solid rgba(123,79,158,0.12)", borderRadius: 24, padding: "22px 20px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, background: "radial-gradient(circle, rgba(123,79,158,0.08), transparent)", borderRadius: "50%", pointerEvents: "none" }} />
                <div style={{ width: 36, height: 36, background: optional ? "rgba(196,84,122,0.1)" : "rgba(123,79,158,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: optional ? "#C4547A" : "#7B4F9E", marginBottom: 12 }}>{num}</div>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{emoji}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: optional ? "#C4547A" : "#1A1035", marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: 13, color: "#4A3B6B", lineHeight: 1.55, marginBottom: badge ? 12 : 0 }}>{desc}</div>
                {badge && (
                  <span style={{ display: "inline-block", background: optional ? "rgba(196,84,122,0.08)" : "rgba(15,110,86,0.08)", border: optional ? "1px dashed rgba(196,84,122,0.4)" : "1px solid rgba(15,110,86,0.3)", color: optional ? "#C4547A" : "#0F6E56", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99 }}>{badge}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LAUDO ASTRAL ── */}
      <section style={{ background: "rgba(15,10,35,0.88)", backdropFilter: "blur(8px)", padding: "72px 24px", position: "relative", zIndex: 2, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "10%", left: "-10%", width: 500, height: 400, background: "radial-gradient(circle, rgba(123,79,158,0.18), transparent)", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "-5%", width: 400, height: 350, background: "radial-gradient(circle, rgba(196,84,122,0.14), transparent)", borderRadius: "50%", filter: "blur(70px)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ display: "inline-block", background: "rgba(196,84,122,0.15)", border: "1px solid rgba(196,84,122,0.3)", color: "#E8749A", fontSize: 12, fontWeight: 700, padding: "5px 14px", borderRadius: 99, letterSpacing: 1, textTransform: "uppercase" as const, marginBottom: 16 }}>LAUDO ASTRAL COMPLETO</div>
            <h2 style={{ color: "#F5F0FF", fontSize: "clamp(28px,4.5vw,44px)", fontWeight: 800, letterSpacing: -0.8, marginBottom: 12, lineHeight: 1.2 }}>
              O card revela o signo.<br />
              O laudo revela o <em style={{ fontStyle: "italic", color: "#E8749A" }}>animal</em>.
            </h2>
            <p style={{ color: "#B8A0D4", fontSize: 17, marginBottom: 24 }}>9 capítulos escritos para o seu pet — não para todo mundo.</p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 99, padding: "8px 16px" }}>
              <span style={{ fontSize: 18 }}>🐾</span>
              <span style={{ fontSize: 13, color: "#B8A0D4" }}>Mais de <strong style={{ color: "#F5F0FF" }}>500 laudos</strong> gerados</span>
            </div>
          </div>
          <div className="laudo-layout" style={{ display: "flex", gap: 32, alignItems: "flex-start", maxWidth: 860, margin: "0 auto", justifyContent: "center" }}>
            {/* Chapters */}
            <div className="reveal reveal-d1" style={{ flex: "none", width: 520 }}>
              {CHAPTERS.map((ch, i) => (
                <div key={i} className={`ch-item${activeChapter === i ? " active" : ""}`}>
                  <div className="ch-accent" />
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{ch.emoji}</span>
                  <span style={{ fontSize: 14, color: activeChapter === i ? "#F5F0FF" : "#B8A0D4", fontWeight: activeChapter === i ? 600 : 400, transition: "all 0.3s ease" }}>{ch.text}</span>
                </div>
              ))}
            </div>
            {/* Price card */}
            <div className="reveal reveal-d2 price-sticky" style={{ flexShrink: 0, width: 280, position: "sticky", top: 24, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(16px)", border: "1px solid rgba(123,79,158,0.2)", borderRadius: 24, padding: 28, boxShadow: "0 8px 40px rgba(0,0,0,0.12)" }}>
              <div style={{ color: "#C4547A", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>🏷️ Preço de lançamento</div>
              <div style={{ color: "#9B8AB4", textDecoration: "line-through", fontSize: 15, marginBottom: 2 }}>R$89,90</div>
              <div style={{ color: "#1A1035", fontSize: 40, fontWeight: 800, marginBottom: 4, lineHeight: 1 }}>R$37,90</div>
              <div style={{ color: "#0C8A5A", fontSize: 12, marginBottom: 20 }}>Você economiza R$52,00</div>
              <div style={{ marginBottom: 20 }}>
                {["9 capítulos personalizados","Entrega imediata por e-mail","Acesso via link permanente","Baseado em signo × raça × pelagem"].map(item => (
                  <div key={item} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8, fontSize: 13, color: "#1A1035" }}>
                    <span style={{ color: "#0C8A5A", fontWeight: 700, flexShrink: 0 }}>✓</span>
                    {item}
                  </div>
                ))}
              </div>
              <Link href="/cadastro" style={{ background: "linear-gradient(135deg,#C4547A,#7B4F9E)", color: "#fff", borderRadius: 50, padding: "16px", display: "block", textAlign: "center", fontSize: 16, fontWeight: 700, textDecoration: "none", marginBottom: 10 }}>
                Quero o laudo astral →
              </Link>
              <p style={{ color: "#9B8AB4", fontSize: 12, textAlign: "center", margin: 0 }}>Pagamento via Pix · Seguro · Rápido</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── DEPOIMENTOS ── */}
      <section style={{ background: "rgba(255,255,255,0.55)", backdropFilter: "blur(16px)", padding: "72px 24px", position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ color: "#1A1035", fontSize: "clamp(28px,4.5vw,44px)", fontWeight: 800, letterSpacing: -0.8 }}>O que tutores estão dizendo</h2>
          </div>
          <div ref={testiRef} className="testi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, maxWidth: 960, margin: "0 auto" }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className={`testi-card reveal reveal-d${(i % 3) + 1}`} style={{ flex: 1, minWidth: 260, background: "rgba(15,10,35,0.84)", border: "1px solid rgba(123,79,158,0.2)", borderRadius: 20, padding: 24 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={t.img}
                    alt={t.name}
                    style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                    onError={ev => {
                      ev.currentTarget.style.display = "none";
                      const sib = ev.currentTarget.nextSibling as HTMLElement | null;
                      if (sib) sib.style.display = "flex";
                    }}
                  />
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: t.fallback ? t.fallback.bg : "#7B4F9E", color: "#fff", fontSize: t.fallback ? 22 : 18, fontWeight: 700, display: "none", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{t.fallback ? t.fallback.emoji : t.initial}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#E8749A" }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: "rgba(184,160,212,0.6)" }}>{t.handle}</div>
                  </div>
                </div>
                <div style={{ color: "#E8749A", fontSize: 14, marginBottom: 8 }}>★★★★★</div>
                <p style={{ fontSize: 14, color: "rgba(245,240,255,0.85)", lineHeight: 1.6, margin: 0 }}>&ldquo;{t.quote}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ padding: "72px 24px", position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <h2 className="reveal" style={{ color: "#1A1035", fontSize: "clamp(28px,4.5vw,44px)", fontWeight: 800, letterSpacing: -0.8, marginBottom: 32, textAlign: "center" }}>Perguntas frequentes</h2>
          <div className="reveal reveal-d1">
            {FAQ_ITEMS.map((item, i) => (
              <FAQItem
                key={i}
                q={item.q}
                a={item.a}
                isOpen={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{ background: "rgba(15,10,35,0.9)", backdropFilter: "blur(12px)", padding: "80px 24px", textAlign: "center", position: "relative", zIndex: 2, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 400, background: "radial-gradient(ellipse, rgba(196,84,122,0.16) 0%, rgba(123,79,158,0.10) 40%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative" }}>
          <h2 className="reveal" style={{ color: "#F5F0FF", fontSize: "clamp(28px,5vw,52px)", fontWeight: 800, letterSpacing: -1, marginBottom: 16 }}>Descubra o seu pet agora</h2>
          <p className="reveal reveal-d1" style={{ color: "#B8A0D4", fontSize: 17, marginBottom: 36 }}>Card grátis. Pronto em 1 minuto.</p>
          <div className="final-btns reveal reveal-d2" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 16 }}>
            <a href="/cadastro?tipo=cachorro" className="btn btn-solid" onClick={() => { fetch('/api/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pet_id: null, event_type: 'cadastro_iniciado' }) }).catch(() => {}) }}>🐶 É um cachorro</a>
            <a href="/cadastro?tipo=gato" className="btn btn-solid" onClick={() => { fetch('/api/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pet_id: null, event_type: 'cadastro_iniciado' }) }).catch(() => {}) }}>🐱 É um gato</a>
          </div>
          <p className="reveal reveal-d3" style={{ color: "rgba(184,160,212,0.5)", fontSize: 13 }}>Sem cadastro · Sem assinatura · Sempre grátis</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)", borderTop: "1px solid rgba(123,79,158,0.08)", padding: "24px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 2 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-cor-unica.png" alt="SignoPet" style={{ height: 32, width: "auto" }} />
        </Link>
        <span style={{ color: "#9B8AB4", fontSize: 13 }}>© 2026 SignoPet · signopet@gmail.com</span>
      </footer>
    </>
  );
}
