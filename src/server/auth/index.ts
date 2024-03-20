import { Lucia } from "lucia";
import { GitHub, Discord } from "arctic";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "../db";
import { sessions, users } from "../db/schema";
import type { InferSelectModel } from "drizzle-orm";
import { env } from "@/env";
import type { Session, User } from "lucia";
import { cache } from "react";
import { cookies } from "next/headers";

// IMPORTANT!
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: Omit<InferSelectModel<typeof users>, "id">;
  }
}

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: env.NODE_ENV === "production",
    },
  },
  getUserAttributes: userAttributes => {
    return {
      username: userAttributes.name,
      userRole: userAttributes.role,
    };
  },
});

export const validateRequest = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    // TODO: remove after done
    return {
      user: { id: "1", username: "user", userRole: "tester" },
      session: {
        id: "2",
        expiresAt: new Date(),
        fresh: true,
        userId: "1",
      },
    };

    // const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    // if (!sessionId) {
    //   return {
    //     user: null,
    //     session: null,
    //   };
    // }
    //
    // const result = await lucia.validateSession(sessionId);
    // // next.js throws when you attempt to set cookie when rendering page
    // try {
    //   if (result.session && result.session.fresh) {
    //     const sessionCookie = lucia.createSessionCookie(result.session.id);
    //     cookies().set(
    //       sessionCookie.name,
    //       sessionCookie.value,
    //       sessionCookie.attributes,
    //     );
    //   }
    //   if (!result.session) {
    //     const sessionCookie = lucia.createBlankSessionCookie();
    //     cookies().set(
    //       sessionCookie.name,
    //       sessionCookie.value,
    //       sessionCookie.attributes,
    //     );
    //   }
    // } catch { }
    // return result;
  },
);

export const github = new GitHub(
  env.GITHUB_CLIENT_ID,
  env.GITHUB_CLIENT_SECRET,
);

export const discord = new Discord(
  env.DISCORD_CLIENT_ID,
  env.DISCORD_CLIENT_SECRET,
  env.DISCORD_REDIRECT_URI,
);
