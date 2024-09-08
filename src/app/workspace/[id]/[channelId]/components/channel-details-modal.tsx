import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EditChannelName from "./edit-channel-name";
import { Trash } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useGetChannelById } from "@/features/workspaces/api/channels/use-get-channel-by-id";
import { Id } from "@/convex/_generated/dataModel";
import { useDeleteChannel } from "@/features/workspaces/api/channels/use-delete-channel";
import UseGetWorkspaceId from "@/features/workspaces/hooks/use-workspace-Id";
import { useGetChannelsByWorkspaceId } from "@/features/workspaces/api/channels/use-get-channels";
import { useOpenCreateChannelModal } from "@/features/workspaces/store/use-open-crete-channel-modal";

const ChannelDetailsModal = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const router = useRouter();
  const { workspaceId } = UseGetWorkspaceId();
  const { channelId } = useParams();
  const { data: channel } = useGetChannelById(channelId as string, workspaceId);
  const { data: channels } = useGetChannelsByWorkspaceId({
    id: workspaceId,
  });
  console.log(channels?.result, "channels");
  const currentIndex = channels?.result?.findIndex(
    (channel) => channel.channelId === channelId
  );
  const [showCreateChannelModal, setShowCreateChannelModal] =
    useOpenCreateChannelModal();
  const {
    mutate: deleteChannel,
    isPending: isDeleting,
    data: deleteData,
  } = useDeleteChannel();
  const [isEditing, setIsEditing] = useState(false);

  const handleDeleteChannel = async () => {
    deleteChannel({ workspaceId, channelId: channelId as string });
    if (!isDeleting && deleteData?.success == false)
      toast.error(deleteData?.error || "Unknown error occured");
    else {
      toast.success("Channel deleted");
      setOpen(false);
    }
  };
  useEffect(() => {
    if (deleteData?.success == true) {
      if (channels?.result?.length! > currentIndex!) {
        const nextChannel = channels?.result?.[currentIndex! + 1];
        return router.replace(
          `/workspace/${workspaceId}/${nextChannel?.channelId}`
        );
      } else if (channels?.result?.length! > 1) {
        return router.replace(
          `/workspace/${workspaceId}/${channels?.result?.[0].channelId}`
        );
      } else {
        setShowCreateChannelModal(true);
        return router.replace(`/workspace/${workspaceId}/dms`);
      }
    }
  }, [
    deleteData,
    router,
    workspaceId,
    setOpen,
    currentIndex,
    setShowCreateChannelModal,
    channels,
  ]);
  return (
    <Dialog open={open} onOpenChange={() => setOpen(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Channel Details</DialogTitle>
        </DialogHeader>
        <>
          <div className="border-gray-100 border rounded-md p-4 flex items-center justify-between">
            {!isEditing ? (
              <>
                <div>
                  <h2 className="text-sm font-bold">Channel name</h2>
                  <h3 className="text-sm">{channel?.result?.name}</h3>
                </div>
                {channel?.result?.isOwner && (
                  <Button
                    variant={"transparent"}
                    size={"icon"}
                    className="text-blue-500 font-bold hover:text-blue-600"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </Button>
                )}
              </>
            ) : (
              <EditChannelName
                open={isEditing}
                setOpen={setIsEditing}
                onCancel={() => setIsEditing(false)}
                channel={channel?.result as any}
              />
            )}
          </div>
          {channel?.result?.isOwner && (
            <div
              className="border-gray-100 border rounded-md p-4 flex items-center gap-4 cursor-pointer"
              onClick={() => {
                handleDeleteChannel();
              }}
            >
              <Trash size={24} className="text-red-500" />
              <h2 className="text-sm font-bold text-red-500">Delete Channel</h2>
            </div>
          )}
        </>
      </DialogContent>
    </Dialog>
  );
};

export default ChannelDetailsModal;
