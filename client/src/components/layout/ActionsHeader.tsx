"use client";

import {useSession} from "@/symfauth/session/SessionContext";
import Link from "next/link";

const AuthenticatedHeader = ({signOut}: {signOut: () => void;}) => {
    return (
        <div className="flex items-end gap-3">
            <Link href={"/"} onClick={() => signOut()} className="hover:underline">Sign out</Link>
        </div>
    )
}

const UnauthenticatedHeader = () => {
    return (
        <div className="flex items-end gap-3">
            <Link href={"/auth/signin"} className="hover:underline">Sign in</Link>
            <span className="text-gray-500">|</span>
            <Link href={"/auth/signup"} className="hover:underline">Sign up</Link>
        </div>
    )
}

const ActionsHeader = () => {
    const {currentUser, signOut} = useSession();

    if (currentUser !== null) {
        return <AuthenticatedHeader signOut={signOut} />
    }

    return <UnauthenticatedHeader />
}

export default ActionsHeader;