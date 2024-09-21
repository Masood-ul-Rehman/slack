import React, { use } from "react";
import { format, isToday, isYesterday } from "date-fns";
import Message from "./message";
import { GetMessagesReturnType } from "@/features/workspaces/api/messages/use-get-messages";

interface MessageListProps {
  memberName?: string;
  memberImage?: string;
  channelName?: string;
  channelCreatedAt?: string;
  variant?: "channel" | "thread" | "conversation";
  messages: GetMessagesReturnType | undefined;
  loadMore: () => void;
  isLoadingMore: boolean;
  canLoadMore: boolean;
}

const MessageList = ({
  memberName,
  memberImage,
  channelName,
  channelCreatedAt,
  variant,
  messages,
  loadMore,
  isLoadingMore,
  canLoadMore,
}: MessageListProps) => {
  const formatDateLabel = (date: string) => {
    const dateObj = new Date(date);
    if (isToday(dateObj)) {
      return "Today";
    } else if (isYesterday(dateObj)) {
      return "Yesterday";
    } else {
      return format(dateObj, "EEEE MMMM, M");
    }
  };

  const groupedMessages =
    messages !== undefined &&
    messages?.reduce(
      (acc, message) => {
        const date = new Date(message?._creationTime ?? 0);
        const dateKey = format(date, "yyyy-MM-dd");
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].unshift(message);
        return acc;
      },
      {} as Record<string, typeof messages>
    );
  return (
    <div className="flex h-full flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
      {messages &&
        Object.entries(groupedMessages).map(([date, messages]) => (
          <div key={date}>
            <div className="text-center my-2 relative ">
              <hr className="absolute  left-0 right-0 border-t border-gray-300" />
              <span className="relative -top-3 inline-block px-4 py-1 z-10 bg-white text-xs border border-gray-300 shadow-sm rounded-md">
                {formatDateLabel(date)}
              </span>
            </div>
            {messages.map((message: (typeof messages)[0]) => (
              <Message
                key={message._id}
                id={message._id}
                isAuthor={false}
                memeberId={message.memberId}
                authorName={message.user.name}
                authorImage={message.user.image}
                reaction={message.reactions}
                body={message.body}
                image={message.image}
                updatedAt={message._creationTime}
                createdAt={message._creationTime}
                isEditing={false}
                setEditingId={() => {}}
                isCompact={false}
                threadCount={messages.threadCount}
                threadImage={messages.threadImage}
                threadTimeStamp={messages.threadTimeStamp}
                channelCreatedAt={channelCreatedAt}
                variant={variant}
              />
            ))}
          </div>
        ))}
    </div>
  );
};

export default MessageList;
