import type {Metadata} from 'next'
import {Inter} from 'next/font/google'
import './globals.scss'
import {ReactNode} from "react";
import Header from "@/components/layout/Header";
import {TailwindIndicator} from "@/utils/TailwindIndicator";
import {Providers} from "@/Providers";
import {getServerSideSession} from "@/symfauth/SymfAuth";
import {UserType} from "@/models/User";

const inter = Inter({subsets: ['latin']})

export const metadata: Metadata = {
    title: 'Template Symfony Next App',
    description: 'Starting project for Symfony and Next.js with authentication',
}

export default async function RootLayout(
    {children}: Readonly<{ children: ReactNode }>
) {
    const currentSession: { user: UserType|null; tokenValue: string|null } | null = await getServerSideSession();

    return (
        <html lang="en">
        <body className={`${inter.className} flex flex-col min-h-[100vh]`}>
        <Providers currentSession={currentSession}>
            <Header/>
            <div className="flex flex-1 h-full px-4 py-2">{children}</div>
            <TailwindIndicator/>
        </Providers>
        </body>
        </html>
    )
}
