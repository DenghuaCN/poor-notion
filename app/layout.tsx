import type { Metadata } from 'next'

import { Toaster } from "sonner";

import { Inter } from 'next/font/google'

import { ThemeProvider } from "@/components/providers/theme-provider";
import { ConvexClientProvider } from '@/components/providers/convex-provider';
import { ModalProvider } from '@/components/providers/modal-provider';

import { EdgeStoreProvider } from '@/lib/edgestore';

import './globals.css'

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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>

        {/* 数据管理与身份验证 */}
        <ConvexClientProvider>
          {/* Edge存储桶服务 */}
          <EdgeStoreProvider>
            {/* 切换黑白模式 */}
            <ThemeProvider
              attribute='class'
              defaultTheme='system'
              enableSystem
              disableTransitionOnChange
              storageKey='notion-theme-2'
            >
              {/* Toast */}
              <Toaster position='bottom-center' />
              {/* Dialog */}
              <ModalProvider />

              {children}

            </ThemeProvider>
          </EdgeStoreProvider>
        </ConvexClientProvider>

      </body>
    </html>
  )
}
