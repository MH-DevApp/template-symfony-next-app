import {UserType} from "@/models/User";
import {createContext, useContext, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {COOKIE_JWT_NAME} from "@/utils/defaultValues";

export type SessionType = {
    currentUser: UserType|null;
    signIn: (user: UserType) => void;
    signOut: () => void;
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

    return session;
}

export const useSessionProvider = (user: UserType|null): SessionType => {
    const [currentUser, setCurrentUser] = useState<UserType|null>(user);
    const router = useRouter();

    useEffect(() => {
        if (
            !user &&
            document.cookie.includes(COOKIE_JWT_NAME)
        ) {
            signOut().then();
        }
    }, [])

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

    return {currentUser, signIn, signOut};
}