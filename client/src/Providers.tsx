"use client";

import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {PropsWithChildren} from "react";
import SessionProvider from "@/symfauth/session/SessionProvider";

export const Providers = ({children}: PropsWithChildren) => {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <SessionProvider>
                {children}
            </SessionProvider>
        </QueryClientProvider>
    )
}