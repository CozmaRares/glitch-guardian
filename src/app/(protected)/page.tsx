import DashboardChart from "@/components/DashboardChart";
import Avatar from "@/components/utils/Avatar";
import { priorityColors, mockData } from "@/lib/data";
import { validateRequest } from "@/server/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const { user } = await validateRequest();
  if (!user) return redirect("/login");

  const news = {
    projecs: mockData.news.filter(n => n.type == "project"),
    tasks: mockData.news.filter(n => n.type == "task"),
  };

  return (
    <main className="space-y-12 p-8">
      <div className="flex flex-row justify-between">
        <div>
          <h1 className="mb-2 text-3xl">👋 Welcome, {user.name}! </h1>
          <p>Here is a summary of everything that is going on</p>
        </div>
        <div>
          <ul className="grid grid-cols-[minmax(0,1fr),auto,minmax(0,1fr)] rounded-2xl bg-accent p-3 text-center">
            <li>
              <div className="flex flex-col-reverse px-8">
                <h5>
                  <span className="text-sky-300">
                    {mockData.projectsInvolvedIn}
                  </span>{" "}
                  projects
                </h5>
                <p className="text-sm text-slate-300">Projects involved in</p>
              </div>
            </li>
            <div className="h-full w-[5px] rounded-full bg-slate-600" />
            <li>
              <div className="flex flex-col-reverse px-8">
                <h5>
                  <span className="text-sky-300">
                    {mockData.ongoingProjects}
                  </span>{" "}
                  tasks
                </h5>
                <p className="text-sm text-slate-300">Completed tasks</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <ul className="grid grid-cols-[minmax(0,1fr),auto,minmax(0,1fr),auto,minmax(0,1fr),auto,minmax(0,1fr)] rounded-2xl bg-accent p-6 text-center">
        <li>
          <div className="flex flex-col-reverse px-8">
            <h3 className="text-2xl">
              <span className="text-sky-300">{mockData.projects}</span> projects
            </h3>
            <p className="text-slate-300">All projects</p>
          </div>
        </li>
        <div className="h-full w-[5px] rounded-full bg-slate-600" />
        <li>
          <div className="flex flex-col-reverse px-8">
            <h3 className="text-2xl">
              <span className="text-sky-300">{mockData.ongoingProjects}</span>{" "}
              projects
            </h3>
            <p className="text-slate-300">Ongoing projects</p>
          </div>
        </li>
        <div className="h-full w-[5px] rounded-full bg-slate-600" />
        <li>
          <div className="flex flex-col-reverse px-8">
            <h3 className="text-2xl">
              <span className="text-sky-300">{mockData.tasks}</span> tasks
            </h3>
            <p>All tasks</p>
          </div>
        </li>
        <div className="h-full w-[5px] rounded-full bg-slate-600" />
        <li>
          <div className="flex flex-col-reverse px-8">
            <h3 className="text-2xl">
              <span className="text-sky-300">{mockData.incompleteTasks}</span>{" "}
              tasks
            </h3>
            <p>Incomplete tasks</p>
          </div>
        </li>
      </ul>
      <div className="grid h-[600px] max-h-[550px] w-full grid-cols-[minmax(0,1fr),250px] grid-rows-[auto,minmax(0,1fr)] gap-3">
        <div className="mx-[20px] flex flex-row">
          <h3 className="w-fit border-b border-white px-2 text-2xl font-bold">
            Tasks status
          </h3>
          <div className="ml-auto flex w-fit flex-row">
            <p className="rounded-l-lg border-2 border-white/70 p-2">
              <span className="text-sky-300">{mockData.chartData.length}</span>{" "}
              projects
            </p>
            <p className="rounded-r-lg border-y-2 border-r-2 border-white/70 p-2">
              <span className="text-sky-300">{getNumTasks()}</span> tasks
            </p>
          </div>
        </div>
        <div className="h-full w-full">
          <DashboardChart data={mockData.chartData} />
        </div>
        <div className="col-start-2 row-span-full h-full max-h-full overflow-scroll rounded-2xl bg-accent">
          <h3 className="p-6 text-2xl underline">Upcoming Tasks</h3>
          <ul className="space-y-4 px-3 pb-6">
            {mockData.upcomingTasks.map(
              ({ id, name, project, due, priority }) => (
                <li>
                  <Link
                    className="flex justify-between rounded-md p-3 transition-colors hover:bg-black/60"
                    href={`/tasks/#task-${id}`}
                  >
                    <div>
                      <h4 className="text-xl">{name}</h4>
                      <p>{project}</p>
                    </div>
                    <div className="text-right text-lg">
                      <p>{due}</p>
                      <p style={{ color: priorityColors[priority] }}>
                        {priority}
                      </p>
                    </div>
                  </Link>
                </li>
              ),
            )}
          </ul>
        </div>
      </div>
      <div className="space-y-8 rounded-2xl bg-accent p-6">
        <h4 className="mb-6 text-xl underline">New Tasks</h4>
        <ul className="space-y-4">
          {news.tasks.map(({ username, imageURL, name, date }) => (
            <li className="flex flex-row items-center justify-between rounded-md bg-black/50 px-4 py-2">
              <div className="flex flex-row items-center gap-3">
                <Avatar
                  size={35}
                  username={username}
                  imageURL={imageURL}
                  fallbackColor="bg-slate-600"
                />
                <span>{username}</span>
              </div>
              <span>{name}</span>
              <span>{date}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="space-y-8 rounded-2xl bg-accent p-6">
        <h4 className="mb-6 text-xl underline">New Projects</h4>
        <ul className="space-y-4">
          {news.projecs.map(({ username, imageURL, name, date }) => (
            <li className="flex flex-row items-center justify-between rounded-md bg-black/50 px-4 py-2">
              <div className="flex flex-row items-center gap-3">
                <Avatar
                  size={35}
                  username={username}
                  imageURL={imageURL}
                  fallbackColor="bg-slate-600"
                />
                <span>{username}</span>
              </div>
              <span>{name}</span>
              <span>{date}</span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
function getNumTasks() {
  let s = 0;

  mockData.chartData.forEach(
    ({ low, medium, high }) => (s += low + medium + high),
  );

  return s;
}
