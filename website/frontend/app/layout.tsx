'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/layout/header"

const inter = Inter({ subsets: ["latin"] })

const queryClient = new QueryClient()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <html lang="en">
        <body className={inter.className}>
          <Header />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </body>
      </html>
    </QueryClientProvider>
  )
}
