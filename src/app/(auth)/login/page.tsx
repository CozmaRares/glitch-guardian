import LoginForm from "@/components/LoginForm";
import ProviderLogin from "@/components/ProviderButton";
import { Discord, Github } from "@/components/icons";
import Link from "next/link";

export default async function Page() {
    return (
        <div className="relative h-[100svh] w-full bg-gray-900">
            <div className="absolute left-1/2 top-1/2 w-full max-w-[460px] -translate-x-1/2 -translate-y-1/2 space-y-6 rounded-lg border border-gray-500 bg-background p-6">
                <h1 className="text-center text-2xl underline">LOGIN</h1>
                <LoginForm />
                <div className="flex flex-row items-center justify-between">
                    <Link
                        href="/register"
                        className="italic underline opacity-80 transition-opacity hover:opacity-100"
                    >
                        Don&apos;t have an account?
                    </Link>
                    <Link
                        href="/reset-password"
                        className="italic underline opacity-80 transition-opacity hover:opacity-100"
                    >
                        Forgot password?
                    </Link>
                </div>
                <div className="flex flex-row items-center justify-center gap-5 p-4">
                    <div className="h-[2px] flex-1 rounded-full bg-white" />
                    <p>OR</p>
                    <div className="h-[2px] flex-1 rounded-full bg-white" />
                </div>
                <div className="flex flex-col gap-4">
                    <ProviderLogin
                        redirect="/api/auth/github"
                        text="Login with GitHub"
                        icon={<Github />}
                        colors="bg-gray-200 text-black hover:bg-gray-400"
                    />
                    <ProviderLogin
                        redirect="/api/auth/discord"
                        text="Login with Discord"
                        icon={<Discord />}
                        colors="bg-indigo-700 hover:bg-indigo-900"
                    />
                </div>
            </div>
        </div>
    );
}