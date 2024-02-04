import {cookies} from "next/headers";

import {NextResponse} from "next/server";
import {TokenType} from "@/symfauth/session/SessionContext";
import {fetchServerApi} from "@/utils/fetchUtil";
import {COOKIE_JWT_NAME, COOKIE_JWT_TTL, REFRESH_TOKEN_TICK} from "@/utils/defaultValues";

export async function POST() {
    try {
        const token = cookies().get(COOKIE_JWT_NAME)?.value;

        if (!token) {
            return Response.json({
                success: false,
                message: "No token found"
            });
        }

        const response: {success: boolean; message: string; data: {token?: string, tokenValue?: string;}} = await fetchServerApi("auth/refresh-token", {
            method: "POST",
            cache: "no-cache"
        });

        if (response.success && response.data.token && response.data.tokenValue) {
            const { exp: tokenRefreshedExp }: TokenType = JSON.parse(atob(response.data.tokenValue));

            cookies().set(COOKIE_JWT_NAME, response.data.token, {
                expires: tokenRefreshedExp ? tokenRefreshedExp * 1000 : new Date(Date.now() + COOKIE_JWT_TTL),
                sameSite: "lax"
            });
        }

        return Response.json(response);

    } catch (e) {
        return new NextResponse("Erreur", { status: 500 })
    }
}