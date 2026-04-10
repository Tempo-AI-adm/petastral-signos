import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-4">

      <div className="mb-6 text-center">
        <Image
          src="/logo.png"
          alt="SignoPet"
          width={160}
          height={160}
          className="mx-auto"
        />
      </div>

      <div className="text-center max-w-xl mb-10">
        <h2 className="text-3xl font-bold leading-tight" style={{color: '#1a1a2e'}}>
          Descubra o signo do seu pet e a compatibilidade com você — grátis
        </h2>
        <p className="mt-4 text-lg" style={{color: '#6b7280'}}>
          Descubra em 30 segundos e compartilhe 🐾
        </p>
      </div>

      <Link
        href="/cadastro"
        className="px-10 py-4 rounded-full text-white font-bold text-xl hover:opacity-90 transition-all"
        style={{background: 'linear-gradient(135deg, #a855f7, #ec4899)'}}
      >
        Descobrir agora 🔮
      </Link>

      <p className="mt-8 text-sm" style={{color: '#d1d5db'}}>
        🐶 Cães e 🐱 Gatos · Resultado instantâneo · 100% grátis
      </p>

    </main>
  )
}
