"use client";

import Grid from "@/components/utils/Grid";
import { api } from "@/trpc/react";

export default function Page() {
  const query = api.task.getForUser.useQuery();

  return (
    <main className="p-8">
      <h1 className="text-3xl underline">Tasks</h1>

      <Grid
        query={query}
        header={
          <>
            <div>Name</div>
            <div>Description</div>
            <div>Project</div>
            <div>Assigned To</div>
            <div>Status</div>
            <div>Priority</div>
          </>}
        row={({
          name,
          description,
          projectName,
          devName,
          status,
          priority,
        }) => <>
            <div>{name}</div>
            <div>{description}</div>
            <div>{projectName}</div>
            <div>{devName}</div>
            <div>{status}</div>
            <div>{priority}</div>
          </>
        }
        className="grid-cols-6"
      />
    </main>
  )
}


