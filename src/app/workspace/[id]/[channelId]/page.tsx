"use client";
import React from "react";
import { useParams } from "next/navigation";

import ChatInput from "./components/chat-input";
import MessageList from "@/components/message-list";
import { useGetChannelById } from "@/features/workspaces/api/channels/use-get-channel-by-id";
import { useGetMessages } from "@/features/workspaces/api/messages/use-get-messages";

const ChannelPage = () => {
  const { id, channelId } = useParams();
  const { data: channel, isLoading: isLoadingChannel } = useGetChannelById(
    id as string,
    channelId as string
  );
  const {
    results: messages,
    status,
    loadMore,
  } = useGetMessages({
    channelId: channelId as string,
  });
  if (isLoadingChannel || status === "LoadingFirstPage")
    return <div>Loading...</div>;

  return (
    <div className="h-[calc(100vh-8rem)]  flex flex-col">
      <MessageList
        messages={messages}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={true}
      />
      <ChatInput placeholder={channel?.result?.name ?? "Channel"} />
    </div>
  );
};

export default ChannelPage;
