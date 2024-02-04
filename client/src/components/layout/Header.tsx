import Link from "next/link";
import Image from "next/image";
import ActionsHeader from "@/components/layout/ActionsHeader";

const Header = () => {
    return (
        <div className="flex justify-between px-3 py-3 shadow-sm shadow-gray-900 bg-gray-800 text-white">
            <Link href={"/"} className="flex flex-row gap-1 bg-orange-400 rounded p-2 text-2xl font-bold hover:bg-orange-400/80">
                <Image src="/images/logos/symfony.svg" alt="Logo Symfony" width={30} height={30} />
                <Image src="/images/logos/next-js.svg" alt="Logo Next" width={30} height={30} />
                APP
            </Link>
            <ActionsHeader />
        </div>
    );
};

export default Header;
