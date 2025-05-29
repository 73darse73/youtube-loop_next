import './globals.css'
import { Inter } from 'next/font/google'
import DefaultHeader from '@/shared/components/layout/header/DefaultHeader'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'YouTube Loop',
  description: 'Loop your favorite YouTube videos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={`${inter.className} bg-gray-50`}>
        <DefaultHeader />
        {children}
      </body>
    </html>
  )
} 