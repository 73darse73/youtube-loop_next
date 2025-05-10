import DefaultHeader from "@/components/layout/header/DefaultHeader"

import '@/styles/globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <DefaultHeader />
        <main className="px-4 md:px-8 py-4">
          {children}
        </main>
      </body>
    </html>
  )
}