import type { Metadata } from 'next'
import { Lexend, Inter } from 'next/font/google' // Importa a fonte otimizada
import './globals.css'

// Configura a fonte Lexend e a associa a uma variável CSS
const lexend = Lexend({
  subsets: ['latin'],
  weight: ['400', '700', '800', '900'],
  variable: '--font-lexend', // Define a variável CSS
})
// 2. Configure 'Inter'
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})
export const metadata: Metadata = {
  title: 'Runalytics Multisport',
  description: 'Pare de Apenas Correr. Comece a Treinar.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // Aplicamos o 'dark' mode e a variável da fonte aqui
    <html lang="pt-br" className={`dark ${lexend.variable}`}>
      <head>
        {/* Link para os ícones (Material Symbols) */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
      </head>
      {/* Aplicamos a fonte principal no body */}
      <body className="bg-background-dark font-display text-white">
        {children}
      </body>
    </html>
  )
}