import Link from "next/link";
import {Ban} from "lucide-react";

const notFound = () => {
    return (
        <div className="flex flex-col flex-1 justify-center items-center">
            <Ban size={80} color="red" className="mb-10" />
            <h1 className="">This page could not be found.</h1>
            <p>
                <span>You can go back to the</span>
                <Link href="/" className="ml-1 text-blue-800 hover:underline">home page</Link>.
            </p>
        </div>
    );
};

export default notFound;