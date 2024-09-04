import React, { useState } from "react";
import Link from "next/link";
import { useGetChannelsByWorkspaceId } from "@/features/workspaces/api/channels/use-get-channels";
import UseGetWorkspaceId from "@/features/workspaces/hooks/use-workspace-Id";
import { Loader } from "lucide-react";
import SidebarItem from "../sidebar-item";
import { Hash } from "@phosphor-icons/react";
const Channels = () => {
  let [activeChannel, setActiveChannel] = useState<string | null>(null);
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
      {channels?.result?.map((channel) => (
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
    </div>
  );
};

export default Channels;
