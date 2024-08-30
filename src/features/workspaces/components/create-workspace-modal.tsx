import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

const CreateWorkSpaceModel = () => {
  const [open, setOpen] = useCreateWorkspaceModal();
  const { mutate, isPending, isError, isSuccess } = useCreateWorkspace();
  const form = useForm<z.infer<typeof createWorkspaceSchema>>({
    resolver: zodResolver(createWorkspaceSchema),
  });
  const handleSubmit = (data: z.infer<typeof createWorkspaceSchema>) => {
    mutate(data);
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
            <Button type="submit" disabled={isPending}>
              Create workspace
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkSpaceModel;
