import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Workspace } from "@/features/workspaces/types";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormMessage } from "@/components/ui/form";
import { createWorkspaceItemsSchema } from "@/features/workspaces/types";
import { useUpdateWorkspace } from "@/features/workspaces/api/use-update-workspace";
import { toast } from "sonner";
interface EditNameModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onCancel: () => void;
  workspace: Workspace;
}

const EditNameModal: React.FC<EditNameModalProps> = ({
  open,
  onCancel,
  workspace,
}) => {
  const form = useForm<z.infer<typeof createWorkspaceItemsSchema>>({
    resolver: zodResolver(createWorkspaceItemsSchema),
    defaultValues: {
      name: workspace.name,
    },
  });
  const { mutate, isPending, data } = useUpdateWorkspace();

  const handleSave = (formData: z.infer<typeof createWorkspaceItemsSchema>) => {
    mutate({ id: workspace.workspaceId, name: formData.name });
    if (!isPending && data?.success == false)
      toast.error(data?.error || "Unknown error occured");
    else {
      onCancel();
      toast.success("Workspace name updated");
    }
  };
  return (
    <Dialog open={open} onOpenChange={() => onCancel()}>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Workspace Name</DialogTitle>
          <DialogDescription>
            Make changes to your workspace name here. Click save when
            you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSave)}
              className="w-full flex items-end justify-between gap-2"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <div className="flex flex-col gap-2 w-full">
                    <FormMessage />
                    <Label className="font-semibold">Workspace name</Label>
                    <Input {...field} disabled={isPending} />
                  </div>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onCancel()}
            disabled={isPending}
          >
            Close
          </Button>
          <Button onClick={form.handleSubmit(handleSave)} disabled={isPending}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditNameModal;
