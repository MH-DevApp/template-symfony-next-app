import {UserType} from "@/models/User";
import {createContext, useContext, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {COOKIE_JWT_NAME, REFRESH_TOKEN_TICK} from "@/utils/defaultValues";
import {useQuery} from "@tanstack/react-query";

export type SessionType = {
    currentUser: UserType|null;
    signIn: (user: UserType) => void;
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

export const useSessionProvider = (user: UserType|null): SessionType => {
    const [currentUser, setCurrentUser] = useState<UserType|null>(user);
    const router = useRouter();

    const signIn = (user: UserType) => {
        setCurrentUser(() => user);
        router.replace("/");
    }

    const signOut = async () => {
        const response = await fetch("/api/auth/signout", { method: "POST", cache: "no-cache"});
        const responseJson = await response.json();

        if (responseJson.success) {
            setCurrentUser(() => null);
            router.replace("/");
        }
    }

    const refreshSession = async (): Promise<boolean> => {
        const token = document.cookie
            .split(";")
            .find((c) => c.trim().startsWith(COOKIE_JWT_NAME))
            ?.split("=")[1]
            ?.split(".")[1];

        if (!token) {
            if (currentUser) {
                setCurrentUser(() => null);
            }
            return false;
        }

        const decodedToken: TokenType = JSON.parse(atob(token));

        if (decodedToken.iat + REFRESH_TOKEN_TICK < Date.now() / 1000) {
            const response = await fetch("/api/auth/refresh-token", { method: "POST", cache: "no-cache"});
            const responseJson = await response.json();

            if (!responseJson.success) {
                await signOut();
            }

            return responseJson.success;
        }

        return false;
    }

    return {currentUser, signIn, signOut, refreshSession};
}