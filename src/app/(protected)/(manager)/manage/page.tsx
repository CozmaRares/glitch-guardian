"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { mutationOptionsFactory } from "@/lib/utils";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Page() {
  const router = useRouter();

  const utils = api.useUtils();
  const {
    isLoading: isLoadingUsers,
    isFetching: isFetchingUsers,
    isError: isErrorUsers,
    error: errorUsers,
    data: devs,
  } = api.user.getDevs.useQuery();

  const {
    isLoading: isLoadingProjects,
    isFetching: isFetchingProjects,
    isError: isErrorProjects,
    error: errorProjects,
    data: projects,
  } = api.project.getProjectsAndDevs.useQuery();
  const addDevMutation = api.project.addDev.useMutation(
    mutationOptionsFactory(() => {
      utils.project.getProjectsAndDevs.invalidate();
      router.refresh();
    }),
  );
  const removeDevMutation = api.project.removeDev.useMutation(
    mutationOptionsFactory(() => {
      utils.project.getProjectsAndDevs.invalidate();
      router.refresh();
    }),
  );
  const [selectedProject, setSelectedProject] = useState<string>();
  const [selectedDev, setSelectedDev] = useState<string>();

  if (
    isLoadingUsers ||
    isFetchingUsers ||
    isLoadingProjects ||
    isFetchingProjects
  )
    return <div>Loading...</div>;

  if (isErrorUsers)
    return (
      <div>
        <h1>Error</h1>
        {errorUsers?.message}
      </div>
    );

  if (isErrorProjects)
    return (
      <div>
        <h1>Error</h1>
        {errorProjects?.message}
      </div>
    );

  return (
    <Dialog>
      <Accordion
        type="multiple"
        className="w-full"
      >
        {projects?.map(project => (
          <AccordionItem
            key={project.id}
            value={project.id}
          >
            <AccordionTrigger>{project.name}</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <DialogTrigger asChild>
                <Button
                  type="button"
                  onClick={() => setSelectedProject(project.id)}
                >
                  Manage Dev
                </Button>
              </DialogTrigger>

              {project.projectsToDevs.length == 0 ? (
                <div>No devs assigned</div>
              ) : (
                <div>
                  Assigned devs:
                  {project.projectsToDevs.map(({ dev }) => (
                    <div>{dev.name}</div>
                  ))}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Dev</DialogTitle>
          <DialogDescription>
            <Select onValueChange={id => setSelectedDev(id)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Dev..." />
              </SelectTrigger>
              <SelectContent>
                {devs?.map(dev => (
                  <SelectItem
                    key={`${dev.id}-select-dev`}
                    value={dev.id}
                  >
                    {dev.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              onClick={() =>
                addDevMutation.mutate({
                  projectID: selectedProject!,
                  devID: selectedDev!,
                })
              }
            >
              Add
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="button"
              variant="destructive"
              onClick={() =>
                removeDevMutation.mutate({
                  projectID: selectedProject!,
                  devID: selectedDev!,
                })
              }
            >
              Remove
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
