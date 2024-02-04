"use client";

import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {PropsWithChildren} from "react";
import SessionProvider from "@/symfauth/session/SessionProvider";
import {UserType} from "@/models/User";

export const Providers = ({children, currentSession}: PropsWithChildren<{currentSession: { user: UserType|null; tokenValue: string|null }|null}>) => {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <SessionProvider currentSession={currentSession}>
                {children}
            </SessionProvider>
        </QueryClientProvider>
    )
}