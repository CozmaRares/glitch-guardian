import { discord, lucia } from "@/server/auth";
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
  const storedState = cookies().get(env.DISCORD_COOKIE)?.value ?? null;

  if (!code || !state || !storedState || state !== storedState)
    return new Response(null, {
      status: 400,
    });

  try {
    const tokens = await discord.validateAuthorizationCode(code);
    const discordUserResponse = await fetch(
      "https://discord.com/api/users/@me",
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      },
    );

    const discordUser = (await discordUserResponse.json()) as DiscordUser;

    const existingUser = await db.query.oauthAccounts.findFirst({
      where: and(
        eq(oauthAccounts.providerType, "discord"),
        eq(oauthAccounts.providerUserID, String(discordUser.id)),
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
      name: discordUser.username,
    });

    await db.insert(oauthAccounts).values({
      providerType: "discord",
      providerUserID: String(discordUser.id),
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

interface DiscordUser {
  id: string;
  username: string;
}
