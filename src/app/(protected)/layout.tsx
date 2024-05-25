import { validateRequest } from "@/server/auth";
import { redirect } from "next/navigation";
import AsideMenu from "@/components/AsideMenu";
import { Page } from "@/lib/data";
import { LayoutDashboard, ListChecks, Monitor, Shapes } from "lucide-react";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();
  if (!user) return redirect("/login");

  const pages: Array<{ page: Page; link: string; icon: React.ReactNode }> = [
    { page: "Dashboard", link: "/", icon: <LayoutDashboard /> },
    { page: "Tasks", link: "/tasks", icon: <ListChecks /> },
    { page: "Projects", link: "/projects", icon: <Shapes /> },
  ];

  if (user.role == "manager")
    pages.push({ page: "Manage Projects", link: "/manage", icon: <Monitor /> });

  return (
    <div className="grid grid-cols-[370px,minmax(0,1fr)]">
      <AsideMenu
        username={user.name}
        imageURL={user.imageURL}
        pages={pages}
      />
      <div className="px-4 py-2">{children}</div>
    </div>
  );
}

// <Link href="/api/auth/logout">Logout</Link>
