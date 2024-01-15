import {PropsWithChildren} from "react";
import {SessionContext, SessionType, useSessionProvider} from "@/symfauth/session/SessionContext";

const SessionProvider = ({ children }: PropsWithChildren) => {
    const session: SessionType = useSessionProvider();

    return (
        <SessionContext.Provider value={session}>
            {children}
        </SessionContext.Provider>
    )
}

export default SessionProvider;