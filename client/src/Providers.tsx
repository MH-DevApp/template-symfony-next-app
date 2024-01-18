"use client";

import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {PropsWithChildren} from "react";
import SessionProvider from "@/symfauth/session/SessionProvider";
import {UserType} from "@/models/User";

export const Providers = ({children, currentUser}: PropsWithChildren<{currentUser: UserType|null}>) => {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <SessionProvider currentUser={currentUser}>
                {children}
            </SessionProvider>
        </QueryClientProvider>
    )
}