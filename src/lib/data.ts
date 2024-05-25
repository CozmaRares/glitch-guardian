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
  high: "#ef4444",
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
};
