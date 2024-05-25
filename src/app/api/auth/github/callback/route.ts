import { github, lucia } from "@/server/auth";
import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";
import { generateId } from "lucia";
import { db } from "@/server/db";
import { oauthAccounts, users } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import { env } from "@/env";

export async function GET(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const storedState = cookies().get(env.GITHUB_COOKIE)?.value ?? null;

    if (!code || !state || !storedState || state !== storedState)
        return new Response(null, {
            status: 400,
        });

    try {
        const tokens = await github.validateAuthorizationCode(code);
        const githubUserResponse = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${tokens.accessToken}`,
            },
        });
        const githubUser = (await githubUserResponse.json()) as GitHubUser;

        const existingUser = await db.query.oauthAccounts.findFirst({
            where: and(
                eq(oauthAccounts.providerType, "github"),
                eq(oauthAccounts.providerUserID, String(githubUser.id)),
            ),
            with: { user: true },
        });

        if (existingUser) {
            const session = await lucia.createSession(existingUser.userID, {});
            const sessionCookie = lucia.createSessionCookie(session.id);
            cookies().set(
                sessionCookie.name,
                sessionCookie.value,
                sessionCookie.attributes,
            );
            return new Response(null, {
                status: 302,
                headers: {
                    Location: "/",
                },
            });
        }

        const userId = generateId(15);

        await db.insert(users).values({
            id: userId,
            name: githubUser.login,
        });

        await db.insert(oauthAccounts).values({
            providerType: "github",
            providerUserID: String(githubUser.id),
            userID: userId,
        });

        const session = await lucia.createSession(userId, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies().set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes,
        );
        return new Response(null, {
            status: 302,
            headers: {
                Location: "/",
            },
        });
    } catch (e) {
        console.log(e);

        if (e instanceof OAuth2RequestError) {
            return new Response(null, {
                status: 400,
            });
        }
        return new Response(null, {
            status: 500,
        });
    }
}

interface GitHubUser {
    id: number;
    login: string;
}
