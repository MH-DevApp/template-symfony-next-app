"use server";

import SignUpForm from "@/symfauth/components/forms/SignUpForm";
import {notFound} from "next/navigation";
import {fetchServerApi, responseServerApiSchema} from "@/utils/fetchUtil";

export type SignUpFormProps = {
    email: string;
    password: string;
}

export const SymfAuthRouter = async ({params}: {params: { SymfAuth: string[] }|undefined}) => {
    switch (params?.SymfAuth.join("/")) {
        case "signin":
            return <h1>Signin</h1>
        case "signup":
            return <SignUpForm />
        default:
            return notFound();
    }
}
export const signUp = async (values: SignUpFormProps) => {
    const response = await fetchServerApi("auth/signup", {
        method: "POST",
        body: JSON.stringify(values),
        cache: "no-cache",
    });
    console.log(response);
    return responseServerApiSchema(["email", "password"]).parse(response);
};