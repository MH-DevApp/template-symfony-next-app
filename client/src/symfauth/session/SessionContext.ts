import {UserType} from "@/models/User";
import {createContext, useContext, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {COOKIE_JWT_NAME, REFRESH_TOKEN_TICK} from "@/utils/defaultValues";
import {useQuery} from "@tanstack/react-query";

export type SessionType = {
    currentUser: UserType|null;
    signIn: (user: UserType, tokenValue: string) => void;
    signOut: () => void;
    refreshSession: () => Promise<boolean>;
}

export type TokenType = {
    iat: number;
    exp: number;
    roles: string[];
    username: string;
};

export const SessionContext = createContext<SessionType|null>(null);

export const useSession = (): SessionType => {
    const session = useContext(SessionContext);

    if (!session) {
        throw new Error('useSession must be used within a SessionProvider');
    }

    useQuery({
        queryKey: ['session_refresh-token'],
        queryFn: async () => {
            await session.refreshSession();
            return session.currentUser;
        },
        retry: false
    });

    return session;
}

export const useSessionProvider = (currentSession: {user: UserType|null; tokenValue: string|null} | null): SessionType => {
    const [currentUser, setCurrentUser] = useState<UserType|null>(currentSession?.user ?? null);
    const [tokenJWT, setTokenJWT] = useState<string|null>(currentSession?.tokenValue ?? null);
    const router = useRouter();

    const signIn = (user: UserType, tokenValue: string) => {
        setCurrentUser(() => user);
        setTokenJWT(() => tokenValue);
        router.replace("/");
    }

    const signOut = async () => {
        const response = await fetch("/api/auth/signout", { method: "POST", cache: "no-cache"});
        const responseJson = await response.json();

        if (responseJson.success) {
            setCurrentUser(() => null);
            setTokenJWT(() => null);
            router.replace("/");
        }
    }

    const refreshSession = async (): Promise<boolean> => {
        const token = document.cookie
            .split(";")
            .find((c) => c.trim().startsWith(COOKIE_JWT_NAME))
            ?.split("=")[1];

        if (!token) {
            if (currentUser || tokenJWT) {
                setCurrentUser(() => null);
                setTokenJWT(() => null);
            }
            return false;
        }

        if ((!currentUser || !tokenJWT) && token) {
            await signOut();
            return false;
        }

        const decodedToken: TokenType = JSON.parse(atob(tokenJWT as string));

        if (decodedToken.iat + REFRESH_TOKEN_TICK < Date.now() / 1000) {
            const response = await fetch("/api/auth/refresh-token", { method: "POST", cache: "no-cache"});
            const responseJson = await response.json();

            if (!responseJson.success) {
                await signOut();
                return false;
            }

            setTokenJWT(() => responseJson.data.tokenValue);

            return true;
        }

        return false;
    }

    return {currentUser, signIn, signOut, refreshSession};
}