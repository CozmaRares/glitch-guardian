import { validateRequest } from "@/server/auth";
import { redirect } from "next/navigation";
import LoginForm from "@/components/LoginForm";
import ProviderLogin from "@/components/ProviderLogin";
import { Discord, Github } from "@/components/icons";

export default async function Page() {
  const { user } = await validateRequest();
  if (user) return redirect("/");

  return (
    <div className="relative h-[100svh] w-full bg-gray-900">
      <div className="absolute left-1/2 top-1/2 w-[460px] min-w-fit max-w-full -translate-x-1/2 -translate-y-1/2 space-y-6 rounded-lg border border-gray-500 bg-background p-6">
        <h1 className="text-center text-2xl underline">LOGIN</h1>
        <LoginForm />
        <div className="flex flex-row items-center justify-center gap-5 p-4">
          <div className="h-[2px] flex-1 rounded-full bg-white" />
          <p>OR</p>
          <div className="h-[2px] flex-1 rounded-full bg-white" />
        </div>
        <div className="flex flex-col gap-4">
          <ProviderLogin
            provider="GitHub"
            icon={<Github />}
            colors="bg-gray-200 text-black hover:bg-gray-400 transition-colors"
          />
          <ProviderLogin
            provider="Discord"
            icon={<Discord />}
            colors="bg-indigo-700 hover:bg-indigo-900 transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
