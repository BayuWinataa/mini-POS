import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Mini POS - Kasir & Manajemen Penjualan Ritel',
  description: 'Aplikasi Point of Sale (POS) ritel modern, responsif, dan aman dengan manajemen stok & kalkulasi server-side.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-dark-bg text-dark-text font-sans"
      >
        {children}
        <Toaster position="top-right" richColors theme="dark" />
      </body>
    </html>
  )
}
