import { generateState } from "arctic";
import { discord } from "@/server/auth";
import { cookies } from "next/headers";
import { env } from "@/env";

export async function GET(): Promise<Response> {
  const state = generateState();
  const url = await discord.createAuthorizationURL(state, {
    scopes: ["identify"],
  });

  cookies().set(env.DISCORD_COOKIE, state, {
    path: "/",
    secure: env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  return Response.redirect(url);
}
