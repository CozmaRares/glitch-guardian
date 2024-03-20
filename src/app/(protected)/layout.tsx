import AsideMenu from "@/components/AsideMenu";
import { validateRequest } from "@/server/auth";
// import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();

  if (!user) return redirect("/login");

  return (
    <div className="grid grid-cols-[370px,minmax(0,1fr)]">
      <AsideMenu />
      {children}
    </div>
  );
}

// <Link href="/api/auth/logout">Logout</Link>
