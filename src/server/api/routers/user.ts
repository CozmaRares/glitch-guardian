import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { projects, tasks, users } from "@/server/db/schema";
import { validateRequest } from "@/server/auth";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { projectValidator, taskValidator, usernameValidator } from "@/lib/zod";
import { revalidatePath } from "next/cache";

export const userRouter = createTRPCRouter({
  changeName: publicProcedure
    .input(usernameValidator)
    .mutation(async ({ ctx, input }) => {
      const { user } = await validateRequest();
      if (!user)
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });

      await ctx.db
        .update(users)
        .set({ name: input.username })
        .where(eq(users.id, user.id));

      revalidatePath("/");
    }),
  createProject: publicProcedure
    .input(projectValidator)
    .mutation(async ({ ctx, input }) => {
      const { user } = await validateRequest();
      if (user?.role != "manager")
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });

      await ctx.db.insert(projects).values({
        ...input,
        managerID: user.id,
      });
    }),

  getDevs: publicProcedure.query(async ({ ctx }) => {
    const { user } = await validateRequest();
    if (user?.role != "manager")
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });

    return ctx.db.query.users.findMany({
      where: eq(users.role, "dev"),
    });
  }),
  createTask: publicProcedure
    .input(taskValidator)
    .mutation(async ({ ctx, input }) => {
      const { user } = await validateRequest();
      if (user?.role != "dev")
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });

      await ctx.db.insert(tasks).values({
        ...input,
        devID: user.id,
      });
    }),
});
