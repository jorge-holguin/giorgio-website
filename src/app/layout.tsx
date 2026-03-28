import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/Providers'

export const metadata: Metadata = {
  title: 'Jorge Holguin | Desarrollador Full Stack & Creador Tech',
  description: 'Desarrollador Full Stack especializado en Node.js, TypeScript, Java, Spring Boot y microservicios. Creador de El Hub de Giorgio.',
  keywords: ['Desarrollador Full Stack', 'Backend Developer', 'Node.js', 'TypeScript', 'Java', 'Spring Boot', 'React', 'El Hub de Giorgio', 'Jorge Holguin'],
  authors: [{ name: 'Jorge Holguin' }],
  openGraph: {
    title: 'Jorge Holguin | Desarrollador Full Stack & Creador Tech',
    description: 'Desarrollador Full Stack y creador de contenido tech - El Hub de Giorgio',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="scroll-smooth dark" suppressHydrationWarning>
      <body className="min-h-screen transition-colors duration-300">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
