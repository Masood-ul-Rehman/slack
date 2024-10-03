import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { Loader } from "lucide-react";
import { FaCaretDown } from "react-icons/fa";
import { Hash, Plus } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SidebarItem from "../sidebar-item";
import ChannelDropdown from "./channel-dropdown";
import { useGetChannelsByWorkspaceId } from "@/features/workspaces/api/channels/use-get-channels";
import UseGetWorkspaceId from "@/features/workspaces/hooks/use-workspace-Id";
import { useOpenCreateChannelModal } from "@/features/workspaces/store/use-open-crete-channel-modal";
import { useGetUserNotifications } from "@/features/notifications/api/get-user-notifications";
import { useCurrentUser } from "@/features/auth/api/use-current-user";
import { useGetCurrentMember } from "@/features/workspaces/api/members/use-current-member";
import { Id } from "@/convex/_generated/dataModel";

const Channels = () => {
  const { id, channelId } = useParams();
  const { data: user } = useGetCurrentMember({ workspaceId: id as string });
  const [showChannels, setShowChannels] = useState(true);
  const [_openCreateChannelModal, setOpenCreateChannelModal] =
    useOpenCreateChannelModal();
  const { workspaceId } = UseGetWorkspaceId();
  const { data: channels, isLoading } = useGetChannelsByWorkspaceId({
    id: workspaceId,
  });

  const { data: notifications } = useGetUserNotifications({
    workspaceId,
    memberId: (user?.result as any)?._id as Id<"members">,
  });
  const channelNotifications = (id: string) => {
    return notifications?.filter(
      (notification) => notification.channelId === id
    );
  };
  if (isLoading)
    return (
      <div className="flex justify-center items-center gap-4 h-24">
        <Loader className="w-4 h-4 animate-spin" />
        <p className="text-sm text-white font-medium">Loading channels...</p>
      </div>
    );

  return (
    <div className="flex flex-col gap-2 mt-4">
      <div className="flex items-center gap-1 px-3">
        <Button
          variant={"transparent"}
          className=" px-1 py-1 hover:py-1 h-fit text-[#f9edffc] shrink-0 text-sm "
          onClick={() => setShowChannels(!showChannels)}
        >
          <FaCaretDown
            size={16}
            className={`transition-transform duration-300 ${
              showChannels ? "" : "-rotate-90"
            }`}
          />
        </Button>

        <ChannelDropdown />
      </div>
      {showChannels &&
        channels?.result?.map((channel) => (
          <Link
            key={channel.channelId}
            href={`/workspace/${workspaceId}/${channel.channelId}`}
            className="flex items-center gap-2"
          >
            <SidebarItem
              icon={<Hash size={16} />}
              label={channel.name}
              link={`/workspace/${workspaceId}/${channel.channelId}`}
              variant={channelId === channel.channelId ? "active" : "default"}
              channelNotifications={
                channelNotifications(channel.channelId) as any
              }
            />
          </Link>
        ))}

      <div
        className="flex items-center gap-3 px-3 py-1 cursor-pointer mt-1 hover:bg-accent/20 rounded-md"
        onClick={() => setOpenCreateChannelModal(true)}
      >
        <div className="flex items-center bg-accent/20 rounded-md p-1">
          <Plus size={12} />
        </div>
        <h4 className="text-sm  text-[#f9edffc] ">Add channels</h4>
      </div>
    </div>
  );
};

export default Channels;
