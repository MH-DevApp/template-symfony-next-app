export const COOKIE_JWT_NAME = process.env.NEXT_PUBLIC_COOKIE_JWT_NAME ?? "symf-next_token_auth";
export const COOKIE_JWT_TTL =
    process.env.NEXT_PUBLIC_COOKIE_JWT_TTL ?
    parseInt(process.env.NEXT_PUBLIC_COOKIE_JWT_TTL) :
    (1000 * 60 * 60 * 24);
export const REFRESH_TOKEN_TICK =
    process.env.NEXT_PUBLIC_REFRESH_TOKEN_TICK ?
    parseInt(process.env.NEXT_PUBLIC_REFRESH_TOKEN_TICK) :
    900;
