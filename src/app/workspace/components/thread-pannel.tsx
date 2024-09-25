import React, { useState } from "react";
import dynamic from "next/dynamic";
import { XIcon, Loader, Triangle } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

import Message from "@/components/message";
import ChatInput from "@/components/chat-input";
import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-Id";
import { useGetMessageById } from "@/features/workspaces/api/messages/use-get-message-by-id";
import { useGetCurrentMember } from "@/features/workspaces/api/members/use-current-member";
import { useGetMessages } from "@/features/workspaces/api/messages/use-get-messages";
import MessageList from "@/components/message-list";

const ThreadPanel = ({
  messageId,
  onClose,
}: {
  messageId: Id<"messages">;
  onClose: () => void;
}) => {
  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);

  const { workspaceId } = useWorkspaceId();
  const { data: message, isLoading: messageLoading } =
    useGetMessageById(messageId);
  const { data: member } = useGetCurrentMember({ workspaceId });
  const {
    results: threadMessages,
    status: threadMessagesStatus,
    loadMore: loadMoreThreadMessages,
  } = useGetMessages({
    channelId: message?.channelId,
    parentMessageId: messageId,
  });
  const canLoadMore = threadMessagesStatus === "CanLoadMore";
  const isLoadingMore = threadMessagesStatus === "LoadingMore";

  return (
    <div className="flex flex-col border-l-2 h-full   border-gray-200">
      <div className="flex justify-between items-center border-b border-gray-200 pb-2 h-[74px] p-4">
        <h1 className="text-lg font-bold">Thread</h1>
        <XIcon
          className="size-6 cursor-pointer stroke-[1.5]"
          onClick={onClose}
        />
      </div>
      {!message && !messageLoading && (
        <div className="h-full flex flex-col gap-4 justify-center items-center">
          <Triangle className="size-6  text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            We are not able to find the message you are looking for.
          </p>
        </div>
      )}
      {messageLoading ? (
        <div className="h-full flex  flex-col-reverse gap-4 justify-center items-center">
          <Loader className="size-6 animate-spin text-black" />
        </div>
      ) : (
        <div className="mt-4">
          <Message
            variant="thread"
            memeberId={message?.memberId!}
            body={message?.body!}
            image={message?.image}
            reaction={message?.reactions as any}
            createdAt={message?._creationTime!}
            updatedAt={message?.updatedAt!}
            authorImage={message?.user?.image}
            authorName={message?.user?.name}
            isAuthor={(member?.result as any)?._id === message?.memberId}
            id={message?._id!}
            isEditing={editingId === message?._id}
            setEditingId={setEditingId}
            isCompact={false}
          />
        </div>
      )}
      <div className="w-full h-1 border-b border-gray-200 mb-6" />
      <MessageList
        variant="thread"
        messages={threadMessages}
        loadMore={loadMoreThreadMessages}
        canLoadMore={canLoadMore}
        isLoadingMore={isLoadingMore}
        Name={message?.channelId}
        CreatedAt={new Date(message?._creationTime!)}
      />
      <ChatInput variant="create" parentMessageId={messageId} />
    </div>
  );
};

export default ThreadPanel;
