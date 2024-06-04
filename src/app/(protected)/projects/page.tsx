import ProjectsGrid from "@/components/ProjectsGrid";
import { validateRequest } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const { user } = await validateRequest();

  if (!user) return redirect("/");

  return <ProjectsGrid isManager={user.role === "manager"} />;
}
