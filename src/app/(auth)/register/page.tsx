import RegisterForm from "@/components/forms/RegisterForm";
import ProviderLogin from "@/components/utils/ProviderButton";
import { Discord, Github } from "@/components/utils/icons";
import Link from "next/link";

export default async function Page() {
  return (
    <div className="relative h-[100svh] w-full bg-gray-900">
      <div className="absolute left-1/2 top-1/2 w-full max-w-[460px] -translate-x-1/2 -translate-y-1/2 space-y-6 rounded-lg border border-gray-500 bg-background p-6">
        <h1 className="text-center text-2xl underline">REGISTER</h1>
        <RegisterForm />
        <Link
          href="/login"
          className="ml-auto block w-fit italic underline opacity-80 transition-opacity hover:opacity-100"
        >
          Already have an account?
        </Link>
        <div className="flex flex-row items-center justify-center gap-5 p-4">
          <div className="h-[2px] flex-1 rounded-full bg-white" />
          <p>OR</p>
          <div className="h-[2px] flex-1 rounded-full bg-white" />
        </div>
        <div className="flex flex-col gap-4">
          <ProviderLogin
            redirect="/api/auth/github"
            text="Register with GitHub"
            icon={<Github />}
            colors="bg-gray-200 text-black hover:bg-gray-400"
          />
          <ProviderLogin
            redirect="/api/auth/discord"
            text="Register with Discord"
            icon={<Discord />}
            colors="bg-indigo-700 hover:bg-indigo-900"
          />
        </div>
      </div>
    </div>
  );
}
