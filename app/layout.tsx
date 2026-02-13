import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'

import './globals.css'
import { AuthProvider } from '@/lib/context/auth-context'
import { ThemeProvider } from '@/lib/context/theme-context'

const _playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const _inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'HoteliaSEM - Plateforme Hoteliere de Luxe au Cameroun',
  description:
    'HoteliaSEM : Votre portail vers les plus beaux hotels du Cameroun. Reservez des experiences de luxe a Douala, Yaounde, Kribi avec IA et immersion 3D.',
  generator: 'HoteliaSEM',
  keywords: ['hotel', 'luxe', 'Cameroun', 'Douala', 'Yaounde', 'Kribi', 'reservation', 'HoteliaSEM'],
}

export const viewport: Viewport = {
  themeColor: '#001F3F',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${_playfair.variable} ${_inter.variable}`}>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
