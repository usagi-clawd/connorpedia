import type { Metadata } from 'next'
import './globals.css'

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
          <header className="mw-header">
            <div className="mw-header-container">
              <a href="/" className="mw-logo">Connorpedia</a>
            </div>
          </header>
          {children}
        </div>
      </body>
    </html>
  )
}
