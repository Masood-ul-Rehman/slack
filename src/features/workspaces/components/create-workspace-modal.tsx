import React, { useState } from "react";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import { Form, FormField, FormMessage } from "@/components/ui/form";
import { useCreateWorkspaceModal } from "../store/use-create-workspace-modal";
import { createWorkspaceSchema } from "../types";
import { useCreateWorkspace } from "../api/use-create-workspaces";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const CreateWorkSpaceModel = () => {
  const router = useRouter();
  const [open, setOpen] = useCreateWorkspaceModal();
  const [isLoading, setIsLoading] = useState(false);
  const {
    mutate,
    isPending,
    isError,
    isSuccess,
    data: workspace,
  } = useCreateWorkspace();
  const form = useForm<z.infer<typeof createWorkspaceSchema>>({
    resolver: zodResolver(createWorkspaceSchema),
  });

  const handleSubmit = (data: z.infer<typeof createWorkspaceSchema>) => {
    mutate(data);
    if (!isPending && isSuccess) {
      setOpen(false);
      form.reset();
      if (workspace?.result) {
        setOpen(false);
        toast.success("Workspace created successfully");
        localStorage.setItem("workspaceId", workspace.result.workspaceId);
        router.push(`/workspace/${workspace.result.workspaceId}`);
      }
    } else if (isError) {
      toast.error("Error creating workspace");
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">Create a new workspace</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="flex gap-4 flex-col"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              control={form.control}
              name="name"
              disabled={isPending}
              render={({ field }) => (
                <Input
                  placeholder="Workspace name e.g 'Work','Personal','Project'"
                  autoFocus
                  minLength={3}
                  {...field}
                />
              )}
            />
            <FormMessage />
            <Button
              type="submit"
              disabled={isPending}
              isLoading={isPending}
              className="bg-slack_dark_bg text-white"
            >
              Create workspace
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkSpaceModel;
