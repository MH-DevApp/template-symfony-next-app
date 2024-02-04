import {NextRequest, NextResponse} from "next/server";
import {fetchServerApi} from "@/utils/fetchUtil";

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const json = await fetchServerApi("auth/current-user", {
            method: "GET",
            cache: "no-cache"
        });
        return Response.json(json);
    }
    catch (e) {
        return Response.json({ success: false, data: { user: null } });
    }
}