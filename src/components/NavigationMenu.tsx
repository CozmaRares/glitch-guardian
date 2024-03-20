"use client";

import { menu } from "@/lib/data";
import Collapsible from "./utils/Collapsible";
import { useActivePage } from "@/context/active-page";
import { cn } from "@/lib/utils";
import Link from "next/link";

// TODO: fix tab navigation outlines, make the look like the ones shadcn has

export default function NavigationMenu() {
  const { activePage, setActivePage } = useActivePage();

  return (
    <nav>
      <Collapsible
        key="menu-collapsible-menu"
        label="menu"
      >
        <ul className="space-y-3 p-4 text-lg">
          {menu.map(({ icon: Icon, label, link }) => (
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
                <Icon />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </Collapsible>
    </nav>
  );
}
