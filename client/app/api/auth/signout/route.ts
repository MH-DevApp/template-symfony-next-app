import {cookies} from "next/headers";
import {fetchServerApi} from "@/utils/fetchUtil";
import {COOKIE_JWT_NAME} from "@/utils/defaultValues";

export async function POST() {
    await fetchServerApi("auth/signout", {
        method: "POST",
        cache: "no-cache"
    });

    cookies().delete(COOKIE_JWT_NAME);

    return Response.json({
        success: true,
        message: "You have been logged out"
    });
}