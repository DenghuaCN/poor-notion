import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Poor Notion',
  description: 'a simple notion clone app',
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme:light)",
        url: "/next.svg",
        href: "/next.svg",
      },
      {
        media: "(prefers-color-scheme:dark)",
        url: "/notion-dark.svg",
        href: "/notion-dark.svg",
      }
    ]
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
