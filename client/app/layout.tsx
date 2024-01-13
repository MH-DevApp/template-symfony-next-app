import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.scss'
import {ReactNode} from "react";
import Header from "@/components/layout/Header";
import {TailwindIndicator} from "@/utils/TailwindIndicator";

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
      <body className={`${inter.className} flex flex-col min-h-[100vh]`}>
        <Header />
        <div className="flex flex-1 h-full px-4 py-2">{children}</div>
        <TailwindIndicator />
      </body>
    </html>
  )
}
