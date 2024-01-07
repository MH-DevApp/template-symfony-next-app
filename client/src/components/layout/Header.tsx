import Link from "next/link";
import Image from "next/image";

const ActionsHeader = ({session}: {session: object|null}) => {
    if (!session) {
        return (
            <div className="flex items-end gap-3">
                <Link href={"/auth/signin"} className="hover:underline">Sign in</Link>
                <span className="text-gray-500">|</span>
                <Link href={"/auth/register"} className="hover:underline">Register</Link>
            </div>
        )
    }

    return (
        <div className="flex items-end gap-3">
            <Link href={"/auth/signout"} className="hover:underline">Sign out</Link>
        </div>
    )
}

const Header = () => {
    // TODO SESSION PROVIDER
    const session = null;

    return (
        <div className="flex justify-between px-3 py-3 shadow-sm shadow-gray-400">
            <div>
                <Link href={"/"} className="text-2xl font-bold hover:underline">
                    <Image src="/next.svg" alt="Logo Next" width={394/3} height={80/2} />
                </Link>
            </div>
            <ActionsHeader session={session} />
        </div>
    );
};

export default Header;
