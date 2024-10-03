import React from "react";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";

import MessageList from "@/components/message-list";
import ChatInput from "@/components/chat-input";

import { useGetMessages } from "@/features/workspaces/api/messages/use-get-messages";

const Conversation = ({
  conversationId,
}: {
  conversationId: Id<"conversations">;
}) => {
  const { memberId } = useParams();

  const {
    results: messages,
    status,
    loadMore,
  } = useGetMessages({
    conversationId: conversationId,
  });

  return (
    <div className="p-4 flex flex-col gap-4 h-[calc(100vh-6rem)]">
      <MessageList
        memberId={memberId as Id<"members">}
        variant="conversation"
        messages={messages}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingFirstPage" ? true : false}
        canLoadMore={status === "CanLoadMore" ? true : false}
      />
      <ChatInput
        variant="create"
        conversationId={conversationId}
        receiverId={memberId as Id<"members">}
      />
    </div>
  );
};

export default Conversation;
