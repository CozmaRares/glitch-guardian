"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Grid from "@/components/utils/Grid";
import { taskPriorities, taskStatuses } from "@/lib/data";
import { cn, mutationOptionsFactory } from "@/lib/utils";
import { tasks } from "@/server/db/schema";
import { api } from "@/trpc/react";

export default function Page() {
  const query = api.task.getForUser.useQuery();
  const utils = api.useUtils();
  const taskUpdate = api.task.update.useMutation(
    mutationOptionsFactory(() => utils.project.getForUser.invalidate()),
  );

  const statusOnChange = (id: string, value: string): void => {
    taskUpdate.mutate({
      id,
      status: value as (typeof taskStatuses)[number],
    });
  };

  const priorityOnChange = (id: string, value: string): void => {
    taskUpdate.mutate({
      id,
      priority: value as (typeof taskPriorities)[number],
    });
  };

  return (
    <main className="space-y-8 p-8">
      <h1 className="text-3xl underline">Tasks</h1>

      <Grid
        query={query}
        header={
          <>
            <div>Project</div>
            <div>Name</div>
            <div>Description</div>
            <div>Status</div>
            <div>Priority</div>
          </>
        }
        row={(
          { id, name, description, projectName, status, priority },
          idx,
        ) => (
          <div
            className="contents"
            id={`task-${id}`}
            key={`task-${id}`}
          >
            <div
              className={cn("p-3", idx % 2 == 0 && "bg-slate-900")}
            >
              {projectName}
            </div>
            <div
              className={cn("p-3", idx % 2 == 0 && "bg-slate-900")}
            >
              {name}
            </div>
            <div
              className={cn("p-3", idx % 2 == 0 && "bg-slate-900")}
            >
              {description}
            </div>
            <div
              className={cn(idx % 2 == 0 && "bg-slate-900")}
            >
              <Selectus
                id={id}
                initialValue={status}
                onChange={statusOnChange}
                values={taskStatuses}
              />
            </div>
            <div
              className={cn(idx % 2 == 0 && "bg-slate-900")}
            >
              <Selectus
                id={id}
                initialValue={priority}
                onChange={priorityOnChange}
                values={taskPriorities}
              />
            </div>
          </div>
        )}
        className="grid-cols-5 items-center gap-y-2 rounded-md border border-input p-2"
      />
    </main>
  );
}

function Selectus({
  id,
  initialValue,
  onChange,
  values,
}: {
  id: string;
  initialValue: string;
  onChange: (id: string, v: string) => void;
  values: readonly string[];
}) {
  const onValueChange = (value: string) => onChange(id, value);
  return (
    <Select
      defaultValue={initialValue}
      onValueChange={onValueChange}
    >
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {values.map(val => (
          <SelectItem
            key={`${id}-select-task-${val}`}
            value={val}
          >
            {val}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
