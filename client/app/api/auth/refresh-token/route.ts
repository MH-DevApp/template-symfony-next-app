import {cookies} from "next/headers";

import {NextResponse} from "next/server";
import {TokenType} from "@/symfauth/session/SessionContext";
import {fetchServerApi} from "@/utils/fetchUtil";
import {COOKIE_JWT_NAME, COOKIE_JWT_TTL, REFRESH_TOKEN_TICK} from "@/utils/defaultValues";

export async function POST() {
    try {
        const token = cookies().get(COOKIE_JWT_NAME)?.value.split(".")[1];

        if (!token) {
            return Response.json({
                success: false,
                message: "No token found"
            });
        }


        const decodedToken: TokenType = JSON.parse(atob(token));

        if (decodedToken.iat + REFRESH_TOKEN_TICK < Date.now() / 1000) {
            const response: {success: boolean; message: string; data: {tokenRefreshed?: string;}} = await fetchServerApi("auth/refresh-token", {
                method: "POST",
                cache: "no-cache"
            });

            if (response.success && response.data.tokenRefreshed) {
                const { exp: tokenRefreshedExp }: TokenType = JSON.parse(atob(response.data.tokenRefreshed.split(".")[1]));

                cookies().set(COOKIE_JWT_NAME, response.data.tokenRefreshed, {
                    expires: tokenRefreshedExp ? tokenRefreshedExp * 1000 : new Date(Date.now() + COOKIE_JWT_TTL),
                    sameSite: "lax"
                });
            }

            return Response.json({
                success: response.success,
                message: response.message
            });
        }

        return Response.json({
            success: true,
            message: "Token has not need to be refreshed"
        });


    } catch (e) {
        return new NextResponse("Erreur", { status: 500 })
    }
}