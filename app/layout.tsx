import type { Metadata, Viewport } from 'next'
import { Inter, DM_Sans, Caveat } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', weight: ['400','500','600','700','800'] })
const caveat = Caveat({ subsets: ['latin'], variable: '--font-caveat', weight: ['600'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'SignoPet — Descubra por que seu pet é assim',
  description: 'Laudos comportamentais personalizados com raça, personalidade e perfil astral do seu pet. Card grátis em 30 segundos. 🐾',
  openGraph: {
    title: 'SignoPet — Descubra por que seu pet é assim',
    description: 'Laudos comportamentais personalizados com raça, personalidade e perfil astral do seu pet. Card grátis em 30 segundos. 🐾',
    images: [{ url: '/perfil-ig.png', width: 1200, height: 630, alt: 'SignoPet' }],
    type: 'website',
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SignoPet — Descubra por que seu pet é assim',
    description: 'Laudos comportamentais personalizados com raça, personalidade e perfil astral do seu pet. Card grátis em 30 segundos. 🐾',
    images: ['/perfil-ig.png'],
  },
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
