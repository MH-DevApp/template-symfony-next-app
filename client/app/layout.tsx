import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.scss'
import {ReactNode} from "react";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Template Symfony Next App',
  description: 'Starting project for Symfony and Next.js with authentication',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-[100vh]`}>{children}</body>
    </html>
  )
}
