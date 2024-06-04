import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { Task, projects, tasks, users } from "@/server/db/schema";
import { validateRequest } from "@/server/auth";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { taskPriorities, taskStatuses } from "@/lib/data";

export const taskRouter = createTRPCRouter({
  getForUser: publicProcedure.query(
    async ({
      ctx,
    }): Promise<
      Array<
        Omit<Task, "devID" | "projectID" | "createdAt" | "updatedAt"> & {
          projectName: string;
        }
      >
    > => {
      const { user } = await validateRequest();
      if (user?.role != "dev")
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });

      return ctx.db
        .select({
          id: tasks.id,
          name: tasks.name,
          description: tasks.description,
          status: tasks.status,
          projectName: projects.name,
          priority: tasks.priority,
        })
        .from(tasks)
        .innerJoin(projects, eq(tasks.projectID, projects.id))
        .innerJoin(users, eq(users.id, user.id))
        .where(eq(tasks.devID, user.id));
    },
  ),
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(taskStatuses).optional(),
        priority: z.enum(taskPriorities).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = await validateRequest();
      if (user?.role != "dev")
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });

      await ctx.db
        .update(tasks)
        .set({
          status: input.status,
          priority: input.priority,
        })
        .where(eq(tasks.id, input.id));
    }),
});
