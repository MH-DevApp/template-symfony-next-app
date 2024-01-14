"use server";

import SignUpForm from "@/symfauth/components/forms/SignUpForm";
import {notFound} from "next/navigation";
import {DEFAULT_SERVER_API_TOKEN_AUTH_NAME, fetchServerApi, responseServerApiSchema} from "@/utils/fetchUtil";
import {cookies} from "next/headers";
import {z} from "zod";
import {UserModel} from "@/models/User";
import SignInForm from "@/symfauth/components/forms/SignInForm";

export type SignUpFormProps = {
    email: string;
    password: string;
}

export type SignInFormProps = {
    email: string;
    password: string;
}

export const SymfAuthRouter = async ({params}: {params: { SymfAuth: string[] }|undefined}) => {
    switch (params?.SymfAuth.join("/")) {
        case "signin":
            return <SignInForm />
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
    return responseServerApiSchema({ fieldsError: ["email", "password"] }).parse(response);
};

export const signIn = async (values: SignInFormProps) => {
    let dataSchema: z.ZodSchema|undefined = undefined;

    const { token, ...response } = await fetchServerApi("auth/signin_check", {
        method: "POST",
        body: JSON.stringify({
            username: values.email,
            password: values.password
        }),
        cache: "no-cache",
    });


    if (response.success) {
        if (token) {
            const { exp: tokenExp }: { exp: number|undefined; } = JSON.parse(atob(token.split(".")[1]));

            cookies().set(process.env.SERVER_API_TOKEN_AUTH_NAME ?? DEFAULT_SERVER_API_TOKEN_AUTH_NAME, token, {
                expires: tokenExp ? tokenExp * 1000 : new Date(Date.now() + 1000 * 60 * 60),
                sameSite: "lax"
            });
        }
        dataSchema = z.object({
            user: UserModel
        });
    }

    return responseServerApiSchema({
        fieldsError: ["email", "password", "root"],
        dataSchema
    }).parse(response);
}