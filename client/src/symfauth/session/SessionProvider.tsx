import {PropsWithChildren} from "react";
import {SessionContext, SessionType, useSessionProvider} from "@/symfauth/session/SessionContext";
import {UserType} from "@/models/User";

const SessionProvider = ({ children, currentUser }: PropsWithChildren<{currentUser: UserType|null}>) => {
    const session: SessionType = useSessionProvider(currentUser);

    return (
        <SessionContext.Provider value={session}>
            {children}
        </SessionContext.Provider>
    )
}

export default SessionProvider;