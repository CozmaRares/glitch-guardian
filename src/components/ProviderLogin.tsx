import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  provider: string;
  icon: ReactNode;
  colors: string;
  iconColor?: string;
};

export default function ProviderLogin({
  provider,
  icon,
  colors,
  iconColor,
}: Props) {
  return (
    <Link
      className={cn(
        "group flex flex-row items-center justify-center gap-4 rounded-md px-4 py-2",
        colors,
      )}
      href={`/api/auth/${provider.toLowerCase()}`}
    >
      <span
        className={cn(
          "transition-transform duration-300 group-hover:scale-125 group-hover:group-odd:rotate-[360deg] group-hover:group-even:rotate-[-360deg]",
          iconColor,
        )}
      >
        {icon}
      </span>
      Continue with {provider}
    </Link>
  );
}
