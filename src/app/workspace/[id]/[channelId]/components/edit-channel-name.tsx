import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

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
import { useUpdateChannel } from "@/features/workspaces/api/channels/use-update-channel";
import { Channel } from "@/features/workspaces/types";

interface EditChannelNameProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onCancel: () => void;
  channel: Channel;
}
const EditChannelName = ({ open, onCancel, channel }: EditChannelNameProps) => {
  const form = useForm<z.infer<typeof createWorkspaceItemsSchema>>({
    resolver: zodResolver(createWorkspaceItemsSchema),
    defaultValues: {
      name: channel?.name,
    },
  });
  const { mutate, isPending, data } = useUpdateChannel();

  const handleSave = (formData: z.infer<typeof createWorkspaceItemsSchema>) => {
    mutate({
      channelId: channel.channelId,
      workspaceId: channel.workspaceId,
      name: formData.name,
    });
    if (!isPending && data?.success == false)
      toast.error(data?.error || "Unknown error occured");
    else {
      onCancel();
      toast.success("Channel name updated");
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

export default EditChannelName;
