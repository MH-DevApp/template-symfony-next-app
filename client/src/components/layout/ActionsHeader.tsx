"use client";

import {useSession} from "@/symfauth/session/SessionContext";
import Link from "next/link";

const ActionsHeader = () => {
    const {currentUser} = useSession();

    if (!currentUser) {
        return (
            <div className="flex items-end gap-3">
                <Link href={"/auth/signin"} className="hover:underline">Sign in</Link>
                <span className="text-gray-500">|</span>
                <Link href={"/auth/signup"} className="hover:underline">Sign up</Link>
            </div>
        )
    }

    return (
        <div className="flex items-end gap-3">
            <Link href={"/auth/signout"} className="hover:underline">Sign out</Link>
        </div>
    )
}

export default ActionsHeader;