import {cookies} from "next/headers";
import {DEFAULT_SERVER_API_TOKEN_AUTH_NAME} from "@/utils/fetchUtil";

export async function GET() {
    cookies().delete(process.env.SERVER_API_TOKEN_AUTH_NAME ?? DEFAULT_SERVER_API_TOKEN_AUTH_NAME);
    return Response.json({
        success: true,
        message: "You have been logged out"
    });
}