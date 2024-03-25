"use client";

import { type SideBarMenu } from "@/lib/data";
import Collapsible from "./utils/Collapsible";
import { useActivePage } from "@/context/active-page";
import { cn } from "@/lib/utils";
import Link from "next/link";

// TODO: fix tab navigation outlines, make them look like the ones shadcn has
type Props = {
  label: string;
  entries: SideBarMenu;
};

export default function Menu({ label, entries }: Props) {
  const { activePage, setActivePage } = useActivePage();

  return (
    <Collapsible
      key="menu-collapsible-menu"
      label={label}
    >
      <ul className="space-y-3 p-4 text-lg">
        {entries.map(({ icon, label, link }) => (
          <li
            key={`menu-collapisble-menu-entry-${label}`}
            className={cn(
              "rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
              {
                "bg-accent text-accent-foreground": label === activePage,
              },
            )}
          >
            <Link
              href={link}
              className="flex w-full items-center gap-2 p-4"
              onClick={() => setActivePage(label)}
            >
              {icon}
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </Collapsible>
  );
}
