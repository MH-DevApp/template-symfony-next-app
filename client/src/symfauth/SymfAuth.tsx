"use server";

import SignUpForm from "@/symfauth/components/forms/SignUpForm";
import {notFound} from "next/navigation";
import {
    fetchServerApi,
    responseServerApiSchema
} from "@/utils/fetchUtil";
import {cookies} from "next/headers";
import {z} from "zod";
import {UserModel} from "@/models/User";
import SignInForm from "@/symfauth/components/forms/SignInForm";
import {TokenType} from "@/symfauth/session/SessionContext";
import {COOKIE_JWT_NAME} from "@/utils/defaultValues";

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

export const getServerSideCurrentUser = async () => {
    if (!cookies().get(COOKIE_JWT_NAME)
    ) {
        return null;
    }

    try {
        const dataSchema = z.object({
            user: UserModel.nullable()
        });

        const response = await fetchServerApi("auth/current-user", {
            method: "GET",
            cache: "no-cache",
        });

        if (!response.success) {
            return null;
        }

        return dataSchema.parse(response.data).user;
    } catch (e) {
        return null;
    }
}

export const signUp = async (values: SignUpFormProps) => {
    const response = await fetchServerApi("auth/signup", {
        method: "POST",
        body: JSON.stringify(values),
        cache: "no-cache",
    });
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
            const { exp: tokenExp }: TokenType = JSON.parse(atob(token.split(".")[1]));

            cookies().set(COOKIE_JWT_NAME, token, {
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