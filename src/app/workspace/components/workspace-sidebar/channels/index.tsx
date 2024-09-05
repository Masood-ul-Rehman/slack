import React, { useState } from "react";
import Link from "next/link";

import { Loader } from "lucide-react";
import { FaCaretDown } from "react-icons/fa";
import { Hash, Plus } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import SidebarItem from "../sidebar-item";
import ChannelDropdown from "./channel-dropdown";
import CreateChannelDialog from "./create-channel-dialog";
import { useGetChannelsByWorkspaceId } from "@/features/workspaces/api/channels/use-get-channels";
import UseGetWorkspaceId from "@/features/workspaces/hooks/use-workspace-Id";
const Channels = () => {
  let [activeChannel, setActiveChannel] = useState<string | null>(null);
  const [showChannels, setShowChannels] = useState(true);
  const [showAddChannel, setShowAddChannel] = useState(false);
  const { workspaceId } = UseGetWorkspaceId();
  const { data: channels, isLoading } = useGetChannelsByWorkspaceId({
    id: workspaceId,
  });

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
            key={channel._id}
            href={`/workspace/${workspaceId}/${channel._id}`}
            onClick={() => setActiveChannel(channel._id)}
          >
            <SidebarItem
              icon={<Hash size={16} />}
              label={channel.name}
              link={`/workspace/${workspaceId}/${channel._id}`}
              variant={activeChannel === channel._id ? "active" : "default"}
            />
          </Link>
        ))}

      <div
        className="flex items-center gap-3 px-3 py-1 cursor-pointer mt-1 hover:bg-accent/20 rounded-md"
        onClick={() => setShowAddChannel(true)}
      >
        <div className="flex items-center bg-accent/20 rounded-md p-1">
          <Plus size={12} />
        </div>
        <h4 className="text-sm  text-[#f9edffc] ">Add channels</h4>
      </div>

      {showAddChannel && (
        <CreateChannelDialog
          open={showAddChannel}
          onCancel={() => setShowAddChannel(false)}
        />
      )}
    </div>
  );
};

export default Channels;
