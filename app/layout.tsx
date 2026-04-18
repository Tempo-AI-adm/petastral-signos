import type { Metadata } from 'next'
import { Inter, DM_Sans, Caveat } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', weight: ['400','500','600','700','800'] })
const caveat = Caveat({ subsets: ['latin'], variable: '--font-caveat', weight: ['600'] })

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
      <body className={`${inter.className} ${dmSans.variable} ${caveat.variable}`}>
        {children}
      </body>
    </html>
  )
}
