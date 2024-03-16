import { validateRequest } from "@/server/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { signup, login } from "@/server/actions/auth";

export default async function Page() {
  const { user } = await validateRequest();
  if (user) return redirect("/");

  return (
    <div className="flex flex-col">
      <h1>Sign up</h1>
      <form action={signup}>
        <label htmlFor="username">Username</label>
        <input
          name="username"
          id="username"
        />
        <br />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
        />
        <br />
        <button>Sign up</button>
      </form>

      <div className="m-20 h-1 w-full bg-black" />

      <h1>Sign in</h1>
      <form action={login}>
        <label htmlFor="username">Username</label>
        <input
          name="username"
          id="username"
        />
        <br />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
        />
        <br />
        <button>Continue</button>
      </form>

      <div className="m-20 h-1 w-full bg-black" />

      <Link href="/api/auth/github">Continue with GitHub</Link>
      <Link href="/api/auth/discord">Continue with Discord</Link>
    </div>
  );
}
