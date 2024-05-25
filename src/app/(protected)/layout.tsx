import { validateRequest } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user } = await validateRequest();

    if (!user) return redirect("/login");

    return (
        <>{children}</>
    );
}

// <Link href="/api/auth/logout">Logout</Link>
