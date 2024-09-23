"use client";
import React from "react";
import { useParams } from "next/navigation";

import ChatInput from "../../../../components/chat-input";
import MessageList from "@/components/message-list";
import { useGetChannelById } from "@/features/workspaces/api/channels/use-get-channel-by-id";
import { useGetMessages } from "@/features/workspaces/api/messages/use-get-messages";
import { Loader } from "lucide-react";

const ChannelPage = () => {
  const { id, channelId } = useParams();
  const { data: channel, isLoading: isLoadingChannel } = useGetChannelById(
    channelId as string,
    id as string
  );
  const {
    results: messages,
    status,
    loadMore,
  } = useGetMessages({
    channelId: channelId as string,
  });
  if (isLoadingChannel || status === "LoadingFirstPage")
    return (
      <div className="flex-1 flex items-center justify-center flex-col gap-2">
        <Loader className="size-6 animate-spin text-muted-foreground" />
        <h4>Loading your messages...</h4>
      </div>
    );

  return (
    <div className="h-[calc(100vh-8rem)]  flex flex-col">
      <MessageList
        variant="channel"
        messages={messages}
        loadMore={loadMore}
        channelName={channel?.result?.name || "Channel"}
        channelCreatedAt={new Date(channel?.result?._creationTime ?? 0)}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={true}
      />
      <ChatInput variant="create" />
    </div>
  );
};

export default ChannelPage;
