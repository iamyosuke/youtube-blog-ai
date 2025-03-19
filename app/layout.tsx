import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import { Header } from './components/header'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'YouTube Blog AI',
  description: 'YouTubeの動画から簡単にブログ記事を生成',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="ja">
        <body className={inter.className}>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main>
              {children}
            </main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}
