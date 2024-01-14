import {cookies} from "next/headers";
import {z} from "zod";

export const DEFAULT_SERVER_API_TOKEN_AUTH_NAME = "symf-next_token_auth";

export type ErrorFieldType = { field: string; message: string; };

const defaultHeaders = {
    "Content-Type": "application/json",
    "Accept": "application/json",
}

export const fetchServerApi = async (url: string, init?: RequestInit) => {
    if (!process.env.SERVER_API_URL) {
        throw new Error("Must be define SERVER_API_URL in .env file");
    }
    const tokenApi = cookies().get(process.env.SERVER_API_TOKEN_AUTH_NAME ?? DEFAULT_SERVER_API_TOKEN_AUTH_NAME);

    let headers: HeadersInit = {
        ...defaultHeaders,
        ...init?.headers ?? {},
    };

    if (tokenApi) {
        headers = {
            ...headers,
            "Authorization": `Bearer ${tokenApi.value}`,
        }
    }

    const response = await fetch(`${process.env.SERVER_API_URL}${url}`, {
        method: init?.method ?? "GET",
        body: init?.body,
        headers: headers,
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
