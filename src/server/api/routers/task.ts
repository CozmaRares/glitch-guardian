import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { Task, projects, tasks, users } from "@/server/db/schema";
import { validateRequest } from "@/server/auth";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

export const taskRouter = createTRPCRouter({
  getForUser: publicProcedure.query(async ({ ctx }): Promise<Array<Omit<Task, "devID" | "projectID" | "createdAt" | "updatedAt"> & { devName: string, projectName: string }>> => {
    const { user } = await validateRequest();

    if (!user)
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });

    if (user.role == "dev")
      return ctx.db
        .select({
          id: tasks.id,
          name: tasks.name,
          description: tasks.description,
          status: tasks.status,
          projectName: projects.name,
          devName: users.name,
          priority: tasks.priority,
        })
        .from(tasks)
        .innerJoin(projects, eq(tasks.projectID, projects.id))
        .innerJoin(users, eq(users.id, user.id))
        .where(eq(tasks.devID, user.id));

    return ctx.db
      .select({
        id: tasks.id,
        name: tasks.name,
        description: tasks.description,
        status: tasks.status,
        projectName: projects.name,
        devName: users.name,
        priority: tasks.priority,
      })
      .from(tasks)
      .innerJoin(projects, eq(tasks.projectID, projects.id))
      .innerJoin(users, eq(tasks.devID, users.id))
      .where(eq(projects.managerID, user.id));
  }),
});
