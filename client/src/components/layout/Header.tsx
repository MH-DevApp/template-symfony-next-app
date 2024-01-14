import Link from "next/link";
import Image from "next/image";

const ActionsHeader = ({session}: {session: object|null}) => {
    if (!session) {
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

const Header = () => {
    // TODO SESSION PROVIDER
    const session = null;

    return (
        <div className="flex justify-between px-3 py-3 shadow-sm shadow-gray-900 bg-gray-800 text-white">
            <Link href={"/"} className="flex flex-row gap-1 bg-orange-400 rounded p-2 text-2xl font-bold hover:bg-orange-400/80">
                <Image src="/images/logos/symfony.svg" alt="Logo Symfony" width={30} height={30} />
                <Image src="/images/logos/next-js.svg" alt="Logo Next" width={30} height={30} />
                APP
            </Link>
            <ActionsHeader session={session} />
        </div>
    );
};

export default Header;
