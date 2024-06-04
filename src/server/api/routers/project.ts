import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { Project, projects, projectsToDevs, users } from "@/server/db/schema";
import { validateRequest } from "@/server/auth";
import { TRPCError } from "@trpc/server";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { projectStatuses } from "@/lib/data";

export const projectRouter = createTRPCRouter({
  getForUser: publicProcedure.query(
    async ({
      ctx,
    }): Promise<
      Array<
        Omit<Project, "managerID" | "createdAt" | "updatedAt"> & {
          managerName: string;
        }
      >
    > => {
      const { user } = await validateRequest();

      if (!user)
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });

      if (user.role == "manager")
        return ctx.db
          .select({
            id: projects.id,
            name: projects.name,
            description: projects.description,
            status: projects.status,
            managerName: users.name,
          })
          .from(projects)
          .innerJoin(users, eq(users.id, user.id))
          .where(eq(projects.managerID, user.id));

      const devsProjects = ctx.db
        .select({
          id: projects.id,
          name: projects.name,
          description: projects.description,
          status: projects.status,
          managerID: projects.managerID,
        })
        .from(projects)
        .innerJoin(
          projectsToDevs,
          and(
            eq(projectsToDevs.projectID, projects.id),
            eq(projectsToDevs.devID, user.id),
          ),
        )
        .as("devProjects");

      return ctx.db
        .select({
          id: devsProjects.id,
          name: devsProjects.name,
          description: devsProjects.description,
          status: devsProjects.status,
          managerName: users.name,
        })
        .from(devsProjects)
        .innerJoin(users, eq(users.id, devsProjects.managerID));
    },
  ),

  changeStatus: publicProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(projectStatuses),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = await validateRequest();
      if (user?.role != "manager")
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });

      await ctx.db
        .update(projects)
        .set({
          status: input.status,
        })
        .where(eq(projects.id, input.id));
    }),

  getProjectsAndDevs: publicProcedure.query(async ({ ctx }) => {
    const { user } = await validateRequest();
    if (user?.role != "manager")
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });

    return ctx.db.query.projects.findMany({
      where: eq(projects.managerID, user.id),
      with: {
        projectsToDevs: {
          with: {
            dev: true,
          },
        },
      },
    });
  }),

  addDev: publicProcedure
    .input(
      z.object({
        devID: z.string(),
        projectID: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = await validateRequest();
      if (user?.role != "manager")
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });

      await ctx.db.insert(projectsToDevs).values({
        ...input,
      });
    }),

  removeDev: publicProcedure
    .input(
      z.object({
        devID: z.string(),
        projectID: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = await validateRequest();
      if (user?.role != "manager")
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });

      await ctx.db
        .delete(projectsToDevs)
        .where(
          and(
            eq(projectsToDevs.projectID, input.projectID),
            eq(projectsToDevs.devID, input.devID),
          ),
        );
    }),
});
