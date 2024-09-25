import React from "react";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";

import ChatInput from "@/components/chat-input";
import MessageList from "@/components/message-list";
import Message from "@/components/message";
import { useGetMemberById } from "@/features/workspaces/api/members/use-get-member-by-id";
import { useGetMessages } from "@/features/workspaces/api/messages/use-get-messages";

const Conversation = ({
  conversationId,
}: {
  conversationId: Id<"conversations">;
}) => {
  const { memberId } = useParams();

  const { data: memberData, isLoading: isMemberLoading } = useGetMemberById({
    memberId: memberId as Id<"members">,
  });
  const {
    results: messages,
    status,
    loadMore,
  } = useGetMessages({
    conversationId: conversationId as Id<"conversations">,
  });
  // if (conversationId === undefined) {
  //   return null;
  // }
  console.log(messages);
  return (
    <div className="flex flex-col gap-4 h-full p-4">
      <MessageList
        Name={
          memberData?.result && "user" in memberData.result
            ? memberData.result.user?.name
            : undefined
        }
        CreatedAt={
          memberData?.result && "user" in memberData.result
            ? new Date(memberData.result.user?._creationTime)
            : undefined
        }
        variant="conversation"
        messages={messages}
        loadMore={loadMore}
        isLoadingMore={false}
        canLoadMore={false}
      />
      <ChatInput variant="create" />
    </div>
  );
};

export default Conversation;
