import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col">

      {/* ── 1. HERO ── */}
      <section id="hero" className="flex flex-col items-center justify-center px-4 pt-12 pb-14 text-center">
        <Image
          src="/logo.png"
          alt="SignoPet"
          width={120}
          height={120}
          className="mx-auto mb-6"
        />
        <h1 className="text-3xl sm:text-4xl font-bold leading-tight max-w-lg mb-3" style={{color:'#1a1a2e'}}>
          Descubra por que seu pet é assim — grátis
        </h1>
        <p className="text-lg mb-8" style={{color:'#6b7280'}}>
          Descubra em 30 segundos e compartilhe 🐾
        </p>

        <div className="flex gap-4 justify-center w-full max-w-xs">
          <Link
            href="/cadastro?tipo=cachorro"
            className="flex-1 flex flex-col items-center gap-2 py-5 px-4 rounded-2xl border border-gray-200 bg-white font-semibold text-gray-800 transition-all duration-200 hover:scale-105 hover:shadow-lg"
            style={{'--tw-shadow-color':'#a855f755'} as React.CSSProperties}
          >
            <span className="text-4xl">🐶</span>
            <span className="text-base font-bold" style={{color:'#1a1a2e'}}>Cachorro</span>
          </Link>
          <Link
            href="/cadastro?tipo=gato"
            className="flex-1 flex flex-col items-center gap-2 py-5 px-4 rounded-2xl border border-gray-200 bg-white font-semibold text-gray-800 transition-all duration-200 hover:scale-105 hover:shadow-lg"
            style={{'--tw-shadow-color':'#a855f755'} as React.CSSProperties}
          >
            <span className="text-4xl">🐱</span>
            <span className="text-base font-bold" style={{color:'#1a1a2e'}}>Gato</span>
          </Link>
        </div>

        <p className="mt-6 text-sm" style={{color:'#d1d5db'}}>
          🐶 Cães e 🐱 Gatos · Resultado instantâneo · 100% grátis
        </p>
      </section>

      {/* ── 2. O QUE VOCÊ RECEBE — GRÁTIS ── */}
      <section className="px-4 py-10" style={{background:'#f9fafb'}}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8" style={{color:'#1a1a2e'}}>
            O que você recebe — grátis
          </h2>
          <div className="flex gap-6 items-center">
            <div className="flex flex-col gap-4">
              {[
                { icon: '✨', title: 'Card astrológico', desc: 'O mapa do seu pet em um card colecionável' },
                { icon: '💜', title: 'Compatibilidade', desc: 'Descubra o % de compatibilidade entre vocês' },
                { icon: '⚡', title: 'Super Poder', desc: 'O poder especial do seu pet revelado' },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3">
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <h3 className="font-bold text-sm mb-0.5" style={{color:'#1a1a2e'}}>{title}</h3>
                    <p className="text-sm" style={{color:'#6b7280'}}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <img src="/card-ilustrado.jpeg" style={{height:240, borderRadius:16, objectFit:'contain', display:'block', flexShrink:0}}/>
          </div>
        </div>
      </section>

      {/* ── 3. DEPOIMENTOS ── */}
      <section className="px-4 py-12 bg-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8" style={{color:'#1a1a2e'}}>
            O que os tutores estão dizendo
          </h2>
          <div className="flex flex-col items-center sm:flex-row sm:items-stretch gap-4">
            {[
              {
                foto: '/depoimento_cisco.jpeg',
                pet: '🐶 Cisco (Pinscher · Sagitário)',
                texto: 'Quando chegou o segundo cachorro eu achei que o Cisco ia enlouquecer. Aí vi que Sagitário precisa de espaço e hierarquia clara. Mudei a rotina e melhorou na hora.',
                autor: '@bruna_franciscojasminemaya',
              },
              {
                foto: '/depoimento_gus.jpeg',
                pet: '🐶 Gus (Caramelo · Áries)',
                texto: 'Descobri que o Gus é ariano. Agora ele tem direitos. Se eu chegar atrasado com a ração, é desrespeito ao signo. 😂',
                autor: '@_gus.dog',
              },
              {
                foto: '/depoimento_maria.jpeg',
                pet: '🐶 Maria Guadalupe (Shih Tzu · Gêmeos)',
                texto: 'Comecei a explorar a curiosidade dela em vez de brigar. Gêmeos precisa de estímulo mental. Ensinei um truque novo por semana — ela mudou completamente.',
                autor: '@falcaomarina',
              },
            ].map(({ foto, pet, texto, autor }) => (
              <div key={autor} className="flex-1 w-full flex flex-col bg-white rounded-2xl p-4 border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <img src={foto} alt={pet} width={48} height={48} style={{borderRadius:'50%', objectFit:'cover', flexShrink:0}}/>
                  <p className="text-sm font-bold" style={{color:'#a855f7', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{pet}</p>
                </div>
                <p className="text-sm leading-relaxed flex-1" style={{color:'#374151'}}>"{texto}"</p>
                <p className="text-xs mt-3" style={{color:'#9ca3af'}}>{autor}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. SEÇÃO PAGO ── */}
      <section className="px-4 py-12" style={{background:'#1a1a2e'}}>
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            Quer entender tudo de verdade?
          </h2>
          <p className="text-sm mb-8" style={{color:'#9ca3af'}}>
            Laudo completo com 10 capítulos — de R$89,90 por R$37,90
          </p>
          <Link
            href="/cadastro"
            className="inline-block px-8 py-3 rounded-full font-semibold text-white text-sm transition-all hover:opacity-90"
            style={{background:'linear-gradient(135deg,#a855f7,#ec4899)'}}
          >
            Começar agora
          </Link>
        </div>
      </section>

      {/* ── 5. RODAPÉ ── */}
      <footer className="py-6 px-4 bg-white text-center">
        <p className="text-xs" style={{color:'#d1d5db'}}>
          signopet.com.br · feito com 💜 para tutores e seus pets
        </p>
      </footer>

    </main>
  )
}
