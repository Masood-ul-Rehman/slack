"use client";

import React, { useState } from "react";
import { useGetChannelById } from "@/features/workspaces/api/channels/use-get-channel-by-id";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CaretDownIcon } from "@radix-ui/react-icons";
import ChannelDetailsModal from "./channel-details-modal";

const ChannelHeader = () => {
  const { id: workspaceId, channelId } = useParams();
  const { data, isLoading } = useGetChannelById(
    channelId as string,
    workspaceId as string
  );
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white border-b  px-6 py-4 ">
      <Button
        variant={"ghost"}
        className="text-lg font-semibold hover:bg-accent text-black flex items-center gap-1 p-2 hover:py-2"
        onClick={() => setOpen(true)}
      >
        {"#" + " " + data?.result?.name || "Your channel"}
        <CaretDownIcon className="w-5 h-5" />
      </Button>
      <ChannelDetailsModal open={open} setOpen={setOpen} />
    </div>
  );
};

export default ChannelHeader;
