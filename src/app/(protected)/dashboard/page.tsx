import { validateRequest } from "@/server/auth";
import { logout } from "@/server/actions/auth";

export default async function Page() {
  const { user } = await validateRequest();
  return (
    <>
      <h1>Hi, {user!.username}!</h1>;
      <form action={logout}>
        <button>Sign out</button>
      </form>
    </>
  );
}
