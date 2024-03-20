import { Calendar, LayoutDashboard, ListChecks, Shapes } from "lucide-react";

export const menu = [
  { icon: LayoutDashboard, label: "Overview", link: "/" },
  { icon: ListChecks, label: "Task List", link: "/tasks" },
  { icon: Shapes, label: "Projects Overview", link: "/projects" },
  { icon: Calendar, label: "Calendar", link: "/calendar" },
] as const;

export type Page = (typeof menu)[number]["label"];
