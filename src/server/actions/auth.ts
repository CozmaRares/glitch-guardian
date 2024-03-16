"use server";

import { cookies } from "next/headers";
import { lucia, validateRequest } from "../auth";
import { redirect } from "next/navigation";
import { Argon2id } from "oslo/password";
import { generateId } from "lucia";
import { db } from "../db";
import { passwordAccounts, users } from "../db/schema";
import { eq } from "drizzle-orm";
import { type UserLoginSchema, userLoginValidator } from "@/lib/utils";

type ActionResult = {
  message: string;
  errors?: Record<string, string[] | undefined>;
} | null;

export async function signup(formData: FormData): Promise<ActionResult> {
  const username = formData.get("username");
  // username must be between 4 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
  // keep in mind some database (e.g. mysql) are case insensitive
  if (
    typeof username !== "string" ||
    username.length < 3 ||
    username.length > 31 ||
    !/^[a-z0-9_-]+$/.test(username)
  ) {
    return {
      message: "Invalid username",
    };
  }
  const password = formData.get("password");
  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    return {
      message: "Invalid password",
    };
  }

  const hashedPassword = await new Argon2id().hash(password);
  const userId = generateId(15);

  await db.insert(users).values({
    id: userId,
    name: username.toLowerCase(),
  });

  await db.insert(passwordAccounts).values({
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
  return redirect("/");
}

export async function login(data: UserLoginSchema): Promise<ActionResult> {
  const parsedData = userLoginValidator.safeParse(data);

  if (!parsedData.success)
    return {
      message: "Invalid login credentials.",
      errors: parsedData.error.flatten().fieldErrors,
    };

  const user = (
    await db
      .select({ id: users.id, hashedPassword: passwordAccounts.hashedPassword })
      .from(users)
      .innerJoin(passwordAccounts, eq(users.id, passwordAccounts.userID))
      .where(eq(users.name, parsedData.data.username))
      .limit(1)
  )[0];

  if (!user) {
    // NOTE:
    // Returning immediately allows malicious actors to figure out valid usernames from response times,
    // allowing them to only focus on guessing passwords in brute-force attacks.
    // As a preventive measure, you may want to hash passwords even for invalid usernames.
    // However, valid usernames can be already be revealed with the signup page among other methods.
    // It will also be much more resource intensive.
    // Since protecting against this is none-trivial,
    // it is crucial your implementation is protected against brute-force attacks with login throttling etc.
    // If usernames are public, you may outright tell the user that the username is invalid.
    return {
      message: "Invalid login credentials.",
    };
  }

  const validPassword = await new Argon2id().verify(
    user.hashedPassword,
    parsedData.data.password,
  );
  if (!validPassword) return { message: "Invalid login credentials." };

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect("/");
}
