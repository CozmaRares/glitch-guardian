"use client";

import Avatar from "./utils/Avatar";
import { LogOut, Settings } from "lucide-react";
import { Page } from "@/lib/data";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  username: string;
  imageURL: string | null;
  pages: Array<{ page: Page; link: string; icon: React.ReactNode }>;
};

export default function AsideMenu({ username, imageURL, pages }: Props) {
  const pathname = usePathname();

  return (
    <aside
      key={`aside-menu-path-${pathname}`}
      className="flex max-h-screen min-h-screen w-full max-w-full flex-col gap-16 overflow-y-scroll border-r p-4 pt-8"
    >
      <div>
        <h2 className="text-3xl">
          <span className="text-sky-400">Glitch</span>
          Guardian
        </h2>
        <p className="text-sm">Seamless bug tracking</p>
      </div>

      <nav className="flex-grow">
        <ul className="space-y-2">
          {pages.map(({ page, link, icon }) => (
            <li
              key={`aside-menu-${page}`}
              className={cn(
                "rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
                {
                  "bg-accent text-accent-foreground":
                    link == "/" ? pathname == "/" : pathname.startsWith(link),
                },
              )}
            >
              <Link
                href={link}
                className="flex w-full items-center gap-2 p-4"
              >
                {icon}
                {page}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex flex-row items-center gap-x-5 rounded-md border-2 p-3">
        <Avatar
          size={50}
          username={username}
          imageURL={imageURL}
          className="row-span-full"
        />
        <div className="flex-grow overflow-hidden overflow-ellipsis whitespace-nowrap text-xl text-primary">
          {username}
        </div>
        <div className="flex flex-row gap-2">
          <Link
            className="group aspect-square rounded-sm border p-1 transition-colors hover:border-primary"
            href="/api/auth/logout"
          >
            <LogOut className="transition-[rotate] duration-300 group-hover:[rotate:y_360deg]" />
          </Link>
          <Link
            className="group aspect-square rounded-sm border p-1 transition-colors hover:border-primary"
            href="/settings"
          >
            <Settings className="transition-transform duration-300 group-hover:rotate-[360deg]" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
