"use client";
import React from "react";
import { useParams } from "next/navigation";

import ChatInput from "./components/chat-input";
import { useGetChannelById } from "@/features/workspaces/api/channels/use-get-channel-by-id";
const ChannelPage = () => {
  const { id, channelId } = useParams();
  const { data: channel } = useGetChannelById(
    id as string,
    channelId as string
  );
  return (
    <div className="h-[calc(100vh-8rem)]  flex flex-col">
      <div className="flex-1 " />
      <ChatInput placeholder={channel?.result?.name ?? "Channel"} />
    </div>
  );
};

export default ChannelPage;
