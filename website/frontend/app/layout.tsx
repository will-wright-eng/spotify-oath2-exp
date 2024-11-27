import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/header'
import { Providers } from '@/app/providers'

const inter = Inter({ subsets: ['latin'] })

// Add error boundary component
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="error-boundary">
      {children}
    </div>
  );
};

export const metadata: Metadata = {
  title: 'Spotify Dashboard',
  description: 'Your personal Spotify dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <Providers>
            <div className="relative min-h-screen flex flex-col">
              <Header />
            <main className="flex-1">
              <div className="container mx-auto py-4">
                {children}
              </div>
            </main>
            </div>
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  )
}
