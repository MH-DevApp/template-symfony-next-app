import {UserType} from "@/models/User";
import {createContext, useContext, useState} from "react";
import {useRouter} from "next/navigation";

export type SessionType = {
    currentUser: UserType|null;
    signIn: (user: UserType) => void;
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

    function signIn (user: UserType) {
        setCurrentUser(() => user);
        router.replace("/");
    }

    return {currentUser, signIn};
}