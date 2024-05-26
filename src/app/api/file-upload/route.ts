import { env } from "@/env";
import { NextResponse, type NextRequest } from "next/server";
import { validateRequest } from "@/server/auth";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const { user } = await validateRequest();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.formData();

  const response = await fetch(env.FILE_UPLOAD_URL, {
    method: "POST",
    body: data,
    headers: {
      [env.FILE_UPLOAD_HEADER]: env.FILE_UPLOAD_KEY,
    },
  });

  if (!response.ok) {
    const body = response.body;

    if (response.status >= 500)
      console.log("Server error when uploading a file", {
        status: response.status,
        body: body,
      });

    return NextResponse.json(null, { status: response.status });
  }

  const json = (await response.json()) as { id: string };

  try {
    const dbData = await db.query.users.findFirst({
      where: eq(users.id, user.id),
      columns: { avatarImageID: true },
    });

    await db
      .update(users)
      .set({ avatarImageID: json.id })
      .where(eq(users.id, user.id));

    // delete current image only after the update
    if (dbData?.avatarImageID)
      await fetch(new URL(dbData.avatarImageID, env.FILE_UPLOAD_URL), {
        method: "DELETE",
        headers: {
          [env.FILE_UPLOAD_HEADER]: env.FILE_UPLOAD_KEY,
        },
      });
  } catch (e) {
    console.log(e);
    return NextResponse.json(null, { status: 500 });
  }

  revalidatePath("/");
  redirect("/settings");
}
