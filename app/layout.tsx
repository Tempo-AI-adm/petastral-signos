import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SignoPet — Mapa Astral do seu Pet',
  description: 'Descubra o signo do seu pet e a compatibilidade com você. Grátis!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-navy text-white min-h-screen`}>
        {children}
      </body>
    </html>
  )
}
