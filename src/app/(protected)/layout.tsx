import { validateRequest } from "@/server/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();

  if (!user) return redirect("/auth/login");

  return (
    <>
      <div>protected</div>
      <Link href="/api/auth/logout">Logout</Link>
      {children}
    </>
  );
}
