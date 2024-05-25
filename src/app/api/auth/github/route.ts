import { generateState } from "arctic";
import { github } from "@/server/auth";
import { cookies } from "next/headers";
import { env } from "@/env";

export async function GET(): Promise<Response> {
    const state = generateState();
    const url = await github.createAuthorizationURL(state);

    cookies().set(env.GITHUB_COOKIE, state, {
        path: "/",
        secure: env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: "lax",
    });

    return Response.redirect(url);
}
