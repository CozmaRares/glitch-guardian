import { type User } from "@/server/db/schema";
import {
  Activity,
  Calendar,
  LayoutDashboard,
  ListChecks,
  Shapes,
} from "lucide-react";
import { createElement, type ReactNode } from "react";

type SideBarMenuEntry = {
  icon: ReactNode;
  label: string;
  link: string;
};

export const mainMenu = Object.freeze([
  { icon: createElement(LayoutDashboard), label: "Dashboard", link: "/" },
  { icon: createElement(ListChecks), label: "Task List", link: "/tasks" },
  {
    icon: createElement(Shapes),
    label: "Projects Overview",
    link: "/projects",
  },
  { icon: createElement(Calendar), label: "Calendar", link: "/calendar" },
] as const satisfies SideBarMenuEntry[]);

export const actionMenus = Object.freeze({
  tester: [],
  developer: [
    { icon: createElement(Activity), label: "Activity", link: "/activity" },
  ],
  manager: [],
  admin: [],
} as const satisfies Record<User["role"], SideBarMenuEntry[]>);

type Label<T> = T extends SideBarMenuEntry[] | Readonly<SideBarMenuEntry[]>
  ? T[number]["label"]
  : never;

export type Page =
  | Label<typeof mainMenu>
  | Label<(typeof actionMenus)[keyof typeof actionMenus]>;

export type SideBarMenu = typeof mainMenu;
