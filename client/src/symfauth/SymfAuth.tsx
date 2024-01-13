import {notFound} from "next/navigation";

export const SymfAuthRouter = ({params}: {params: { SymfAuth: string[] }|undefined}) => {
    switch (params?.SymfAuth.join("/")) {
        case "signin":
            return <h1>Signin</h1>
        case "signup":
            return <h1>Signup</h1>
        default:
            return notFound();
    }
}