import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Tropiqual - Cardápio Digital',
  description: 'Comida japonesa con alma Nikkei, carnes y pescados a la brasa, cócteles de autor',
  keywords: 'sushi, nikkei, fusion, cockteles, sevilla, tropiqual, restaurante',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
