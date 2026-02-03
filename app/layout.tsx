import type { Metadata } from 'next'
import './globals.css'
import WikiHeader from './components/WikiHeader'

export const metadata: Metadata = {
  title: 'Connorpedia',
  description: 'Personal knowledge base in Wikipedia style',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="mw-page-container">
          <WikiHeader />
          {children}
        </div>
      </body>
    </html>
  )
}
