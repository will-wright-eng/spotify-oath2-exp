import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from '@/components/layout/header'
import { Providers } from '@/components/providers'

const inter = Inter({ subsets: ['latin'] })

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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
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
        </ThemeProvider>
      </body>
    </html>
  )
}
