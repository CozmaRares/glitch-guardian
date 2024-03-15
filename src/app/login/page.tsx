import { validateRequest } from "@/server/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Page() {
  const { user } = await validateRequest();
  if (user) {
    return redirect("/");
  }
  return (
    <>
      <h1>Sign in</h1>
      <Link href="/api/auth/github">Sign in with GitHub</Link>
      <Link href="/api/auth/discord">Sign in with Discord</Link>
    </>
  );
}
