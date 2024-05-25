import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  redirect: string;
  text: string;
  icon: ReactNode;
  colors: string;
  iconColor?: string;
};

export default function ProviderLogin({
  redirect,
  text,
  icon,
  colors,
  iconColor,
}: Props) {
  return (
    <Link
      className={cn(
        "group flex flex-row items-center justify-center gap-4 rounded-md px-4 py-2 transition-colors",
        colors,
      )}
      href={redirect}
    >
      <span
        className={cn(
          "transition-transform duration-300 group-hover:scale-125 group-hover:group-odd:rotate-[360deg] group-hover:group-even:rotate-[-360deg]",
          iconColor,
        )}
      >
        {icon}
      </span>
      {text}
    </Link>
  );
}
