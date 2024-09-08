import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormField, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createWorkspaceItemsSchema } from "@/features/workspaces/types";
import { useCreateChannel } from "@/features/workspaces/api/channels/use-create-channel";
import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-Id";
import { useOpenCreateChannelModal } from "@/features/workspaces/store/use-open-crete-channel-modal";

const CreateChannelDialog = () => {
  const router = useRouter();
  const { workspaceId } = useWorkspaceId();
  const [openCreateChannelModal, setOpenCreateChannelModal] =
    useOpenCreateChannelModal();

  const form = useForm<z.infer<typeof createWorkspaceItemsSchema>>({
    resolver: zodResolver(createWorkspaceItemsSchema),
    defaultValues: {
      name: "",
    },
  });
  const { mutate, isPending, data } = useCreateChannel();
  const onCancel = () => {
    setOpenCreateChannelModal(false);
    form.reset();
  };
  const onSave = async (
    formData: z.infer<typeof createWorkspaceItemsSchema>
  ) => {
    mutate({ name: formData.name, workspaceId, status: "public" });
    if (!isPending && data?.success == false)
      toast.error(data?.error || "Unknown error occured");
    else {
      onCancel();
      router.replace(`/workspace/${workspaceId}/${data?.result}`);
      toast.success("Channel created");
    }
  };
  useEffect(() => {
    if (data?.success == true) {
      router.replace(`/workspace/${workspaceId}/${data?.result}`);
      toast.success("Channel created");
    }
  }, [data, router, workspaceId]);

  return (
    <Dialog open={openCreateChannelModal} onOpenChange={() => onCancel()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Channel</DialogTitle>
          <DialogDescription>
            Create a new channel for your workspace.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSave)}
              className="w-full flex items-end justify-between gap-2"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <div className="flex flex-col gap-2 w-full">
                    <FormMessage />
                    <Label className="font-semibold">Channel name</Label>
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
            Cancel
          </Button>
          <Button onClick={form.handleSubmit(onSave)} disabled={isPending}>
            Create Channel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChannelDialog;
