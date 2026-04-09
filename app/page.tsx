import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-navy flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="mb-8 text-center">
        <span className="text-6xl">🐾</span>
        <h1 className="text-4xl font-bold mt-4 bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
          SignoPet
        </h1>
        <p className="text-gray-400 mt-2 text-lg">Mapa astral do seu melhor amigo</p>
      </div>

      {/* Headline */}
      <div className="text-center max-w-xl mb-10">
        <h2 className="text-3xl font-bold text-white leading-tight">
          Descubra o signo do seu pet e a compatibilidade com você
        </h2>
        <p className="text-gray-400 mt-4 text-lg">
          Grátis em 30 segundos. Compartilhe no Instagram. ✨
        </p>
      </div>

      {/* CTA */}
      <Link
        href="/cadastro"
        className="px-10 py-4 rounded-full text-white font-bold text-xl
                   bg-gradient-to-r from-orange-400 to-pink-500
                   hover:opacity-90 transition-all shadow-lg shadow-pink-500/30"
      >
        Descobrir agora 🔮
      </Link>

      {/* Social proof */}
      <p className="text-gray-500 mt-8 text-sm">
        🐶 Cães e 🐱 Gatos · Resultado instantâneo · 100% grátis
      </p>
    </main>
  )
}
