import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { users } from "@/server/db/schema";
import { validateRequest } from "@/server/auth";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { usernameValidator } from "@/lib/zod";
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
});
