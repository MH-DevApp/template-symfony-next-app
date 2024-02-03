import {PropsWithChildren} from "react";
import {SessionContext, SessionType, useSessionProvider} from "@/symfauth/session/SessionContext";
import {UserType} from "@/models/User";

const SessionProvider = ({ children, currentSession }: PropsWithChildren<{currentSession: { user: UserType|null; tokenValue: string|null } | null}>) => {
    const session: SessionType = useSessionProvider(currentSession);

    return (
        <SessionContext.Provider value={session}>
            {children}
        </SessionContext.Provider>
    )
}

export default SessionProvider;