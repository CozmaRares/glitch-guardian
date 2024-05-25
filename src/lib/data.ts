export const pages = Object.freeze([
  "Dashboard",
  "Tasks",
  "Projects",
  "Manage Projects",
] as const);

export type Page = (typeof pages)[number];
