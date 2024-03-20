import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { passwordAccounts, users } from "@/server/db/schema";
import { userLoginValidator, userRegisterValidator } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { Argon2id } from "oslo/password";
import { lucia, validateRequest } from "@/server/auth";
import { cookies } from "next/headers";
import { TRPCError } from "@trpc/server";
import { generateId } from "lucia";

export const authRouter = createTRPCRouter({
  getUserSession: publicProcedure.query(validateRequest),

  passLogin: publicProcedure
    .input(userLoginValidator)
    .mutation(async ({ ctx, input }) => {
      const user = (
        await ctx.db
          .select({
            id: users.id,
            hashedPassword: passwordAccounts.hashedPassword,
          })
          .from(users)
          .innerJoin(passwordAccounts, eq(users.id, passwordAccounts.userID))
          .where(eq(users.name, input.username))
          .limit(1)
      )[0];

      if (!user)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid login credentials.",
        });

      const validPassword = await new Argon2id().verify(
        user.hashedPassword,
        input.password,
      );

      if (!validPassword)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid login credentials.",
        });

      const session = await lucia.createSession(user.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }),

  passRegister: publicProcedure
    .input(userRegisterValidator)
    .mutation(async ({ ctx, input }) => {
      const hashedPassword = await new Argon2id().hash(input.password);
      const userId = generateId(15);

      try {
        await ctx.db.insert(users).values({
          id: userId,
          name: input.username,
        });
      } catch {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Username already exists.",
        });
      }

      await ctx.db.insert(passwordAccounts).values({
        userID: userId,
        hashedPassword,
      });

      const session = await lucia.createSession(userId, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }),
});
