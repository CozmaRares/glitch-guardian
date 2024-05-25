export const pages = Object.freeze([
  "Dashboard",
  "Tasks",
  "Projects",
  "Manage Projects",
] as const);
export type Page = (typeof pages)[number];

export const priorityColors = Object.freeze({
  low: "#22c55e",
  medium: "#fb923c",
  high: "#b91c1c",
} as const);

export const mockData = {
  projects: 45,
  ongoingProjects: 29,
  projectsInvolvedIn: 80,
  tasksCompleted: 10,
  tasks: 420,
  incompleteTasks: 69,
  upcomingTasks: [
    {
      id: "x",
      name: new Array(Math.floor(Math.random() * 5) + 4).fill("a"),
      project: "P1",
      due: "26-05-24",
      priority: "low",
    },
    {
      id: "x",
      name: new Array(Math.floor(Math.random() * 5) + 4).fill("a"),
      project: "P1",
      due: "26-05-24",
      priority: "low",
    },
    {
      id: "x",
      name: new Array(Math.floor(Math.random() * 5) + 4).fill("a"),
      project: "P1",
      due: "26-05-24",
      priority: "medium",
    },
    {
      id: "x",
      name: new Array(Math.floor(Math.random() * 5) + 4).fill("a"),
      project: "P2",
      due: "26-05-24",
      priority: "high",
    },
    {
      id: "x",
      name: new Array(Math.floor(Math.random() * 5) + 4).fill("a"),
      project: "P2",
      due: "26-05-24",
      priority: "low",
    },
    {
      id: "x",
      name: new Array(Math.floor(Math.random() * 5) + 4).fill("a"),
      project: "P3",
      due: "26-05-24",
      priority: "high",
    },
    {
      id: "x",
      name: new Array(Math.floor(Math.random() * 5) + 4).fill("a"),
      project: "P3",
      due: "26-05-24",
      priority: "medium",
    },
  ] as const,
  chartData: [
    {
      name: "P1",
      low: Math.floor(Math.random() * 20),
      medium: Math.floor(Math.random() * 20),
      high: Math.floor(Math.random() * 20),
    },
    {
      name: "P2",
      low: Math.floor(Math.random() * 20),
      medium: Math.floor(Math.random() * 20),
      high: Math.floor(Math.random() * 20),
    },
    {
      name: "P3",
      low: Math.floor(Math.random() * 20),
      medium: Math.floor(Math.random() * 20),
      high: Math.floor(Math.random() * 20),
    },
    {
      name: "P4",
      low: Math.floor(Math.random() * 20),
      medium: Math.floor(Math.random() * 20),
      high: Math.floor(Math.random() * 20),
    },
    {
      name: "P5",
      low: Math.floor(Math.random() * 20),
      medium: Math.floor(Math.random() * 20),
      high: Math.floor(Math.random() * 20),
    },
    {
      name: "P6",
      low: Math.floor(Math.random() * 20),
      medium: Math.floor(Math.random() * 20),
      high: Math.floor(Math.random() * 20),
    },
    {
      name: "P7",
      low: Math.floor(Math.random() * 20),
      medium: Math.floor(Math.random() * 20),
      high: Math.floor(Math.random() * 20),
    },
    {
      name: "P8",
      low: Math.floor(Math.random() * 20),
      medium: Math.floor(Math.random() * 20),
      high: Math.floor(Math.random() * 20),
    },
    {
      name: "P9",
      low: Math.floor(Math.random() * 20),
      medium: Math.floor(Math.random() * 20),
      high: Math.floor(Math.random() * 20),
    },
    {
      name: "P10",
      low: Math.floor(Math.random() * 20),
      medium: Math.floor(Math.random() * 20),
      high: Math.floor(Math.random() * 20),
    },
  ],
  news: [
    {
      username: "aaa",
      imageURL: null,
      type: "task",
      name: "hardest",
      date: "26-05-24",
    },
    {
      username: "aaa",
      imageURL: null,
      type: "task",
      name: "hardest",
      date: "26-05-24",
    },
    {
      username: "aaa",
      imageURL: null,
      type: "task",
      name: "hardest",
      date: "26-05-24",
    },
    {
      username: "aaa",
      imageURL: null,
      type: "task",
      name: "hardest",
      date: "26-05-24",
    },
    {
      username: "aaa",
      imageURL: null,
      type: "project",
      name: "lamenter",
      date: "27-05-24",
    },
    {
      username: "aaa",
      imageURL: null,
      type: "project",
      name: "lamenter",
      date: "27-05-24",
    },
    {
      username: "aaa",
      imageURL: null,
      type: "project",
      name: "lamenter",
      date: "27-05-24",
    },
  ] satisfies Array<{
    username: string;
    imageURL: string | null;
    type: "task" | "project";
    name: string;
    date: string;
  }>,
};
