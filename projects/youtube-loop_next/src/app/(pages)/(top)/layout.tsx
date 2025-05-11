import DefaultHeader from "_components/layout/header/DefaultHeader"

import '@/_styles/globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <DefaultHeader />
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}