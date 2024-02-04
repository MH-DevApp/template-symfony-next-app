import {cookies, headers} from "next/headers";
import {z} from "zod";
import {COOKIE_JWT_NAME, SERVER_API_KEY} from "@/utils/defaultValues";

export type ErrorFieldType = { field: string; message: string; };

const defaultHeaders = {
    "Content-Type": "application/json",
    "Accept": "application/json",
}

export const fetchServerApi = async (url: string, init?: RequestInit) => {
    if (!process.env.SERVER_API_URL) {
        throw new Error("Must be define SERVER_API_URL in .env file");
    }
    const tokenApi = cookies().get(COOKIE_JWT_NAME);
    const ip = headers().get('x-forwarded-for');
    const userAgent = headers().get('user-agent');

    let headersInit: HeadersInit = {
        ...defaultHeaders,
        "x-agent-ip": ip ?? "",
        "x-user-agent": userAgent ?? "",
        ...init?.headers ?? {},
    };

    if (tokenApi) {
        headersInit = {
            ...headersInit,
            "x-session-id": tokenApi.value,
        }
    }

    if (SERVER_API_KEY) {
        headersInit = {
            ...headersInit,
            "x-api-server-key": SERVER_API_KEY,
        }

    }

    const response = await fetch(`${process.env.SERVER_API_URL}${url}`, {
        method: init?.method ?? "GET",
        body: init?.body,
        headers: headersInit,
        cache: init?.cache ?? "default"
    });

    const responseJson = await response.json();

    if (!response.ok) {
        if (response.status === 500) {
            throw new Error("An error occurred, please try again later.");
        }
    }

    return responseJson;
}

export const responseServerApiSchema = ({ fieldsError, dataSchema }: {
    fieldsError: readonly [string, ...string[]];
    dataSchema?: z.ZodSchema;
}) => {
    return z.object({
        success: z.boolean(),
        message: z.string(),
        codeError: z.string().optional(),
        errors: z.array(
            z.object({
                field: z.enum(fieldsError),
                message: z.string()
            })
        ).optional(),
        data: dataSchema ?? z.object({}).optional(),
    });
}
