"use client";

import { projectStatuses, taskPriorities, taskStatuses } from "@/lib/data";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Grid from "./utils/Grid";
import { api } from "@/trpc/react";
import { useForm } from "react-hook-form";
import {
  ProjectSchema,
  TaskSchema,
  projectValidator,
  taskValidator,
} from "@/lib/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, mutationOptionsFactory } from "@/lib/utils";

type Props = {
  isManager: boolean;
};

export default function ProjectsGrid({ isManager }: Props) {
  const query = api.project.getForUser.useQuery();

  const utils = api.useUtils();
  const changeStatus = api.project.changeStatus.useMutation(
    mutationOptionsFactory(() => utils.project.getForUser.invalidate()),
  );

  const statusOnChange = (id: string, value: string): void => {
    changeStatus.mutate({
      id,
      status: value as (typeof projectStatuses)[number],
    });
  };

  return (
    <main className="space-y-8 p-8">
      <h1 className="text-3xl underline">Projects</h1>

      <Grid
        query={query}
        header={
          <>
            <div>Name</div>
            <div>Manager</div>
            <div>Description</div>
            <div>Status</div>
          </>
        }
        row={({ id, name, description, status, managerName }, idx) => (
          <div
            key={`project-${id}`}
            className="contents"
            id={`project-${id}`}
          >
            <div className={cn(idx % 2 == 0 && "bg-slate-900")}>{name}</div>
            <div className={cn(idx % 2 == 0 && "bg-slate-900")}>
              {managerName}
            </div>
            <div className={cn(idx % 2 == 0 && "bg-slate-900")}>
              {description}
            </div>
            <div className={cn("pr-4", idx % 2 == 0 && "bg-slate-900")}>
              {isManager ? (
                <StatusSelect
                  value={status}
                  id={id}
                  onChange={statusOnChange}
                />
              ) : (
                status
              )}
            </div>
          </div>
        )}
        className="grid-cols-4 gap-y-2 rounded-md border border-input p-2"
      />
      {isManager ? <CreateProject /> : <CreateTask projects={query.data} />}
    </main>
  );
}

function CreateProject() {
  const router = useRouter();
  const utils = api.useUtils();
  const createProject = api.user.createProject.useMutation(
    mutationOptionsFactory(() => {
      utils.project.getForUser.invalidate();
      router.refresh();
    }),
  );

  const form = useForm<ProjectSchema>({
    resolver: zodResolver(projectValidator),
  });

  const onSubmit = (data: ProjectSchema) => {
    createProject.mutate(data);
  };

  return (
    <div>
      <h2 className="my-4 text-xl underline">Create Project</h2>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="A few words can't hurt"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a project status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {projectStatuses.map(status => (
                      <SelectItem
                        key={`create-project-${status}`}
                        value={status}
                      >
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Create</Button>
        </form>
      </Form>
    </div>
  );
}

function StatusSelect({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (id: string, v: string) => void;
}) {
  const onValueChange = (value: string) => onChange(id, value);
  return (
    <Select
      defaultValue={value}
      onValueChange={onValueChange}
    >
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {projectStatuses.map(status => (
          <SelectItem
            key={`${id}-select-project-status-${status}`}
            value={status}
          >
            {status}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function CreateTask({
  projects,
}: {
  projects?: Array<{ name: string; id: string }>;
}) {
  const router = useRouter();
  const utils = api.useUtils();
  const createTask = api.user.createTask.useMutation(
    mutationOptionsFactory(() => {
      utils.project.getForUser.invalidate();
      router.refresh();
    }),
  );

  const form = useForm<TaskSchema>({
    resolver: zodResolver(taskValidator),
  });

  if (projects == undefined)
    return (
      <div>
        <h2 className="my-4 text-xl underline">Create Task</h2>
        Loading...
      </div>
    );

  const onSubmit = (data: TaskSchema) => {
    createTask.mutate(data);
  };

  return (
    <div>
      <h2 className="my-4 text-xl underline">Create Task</h2>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="projectID"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a project" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {projects.map(({ name, id }) => (
                      <SelectItem
                        key={`select-project-${id}`}
                        value={id}
                      >
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="A few words can't hurt"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a task status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {taskStatuses.map(status => (
                      <SelectItem
                        key={`create-task-${status}`}
                        value={status}
                      >
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a task priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {taskPriorities.map(status => (
                      <SelectItem
                        key={`create-task-${status}`}
                        value={status}
                      >
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Create</Button>
        </form>
      </Form>
    </div>
  );
}
