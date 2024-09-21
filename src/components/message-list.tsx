import React from "react";
import { format, isToday, isYesterday } from "date-fns";
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
    <div className="flex flex-1 flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
      {messages &&
        Object.entries(groupedMessages).map(([date, messages]) => (
          <div key={date}>
            <div className="text-center my-2 relative ">
              <hr className="absolute  left-0 right-0 border-t border-gray-300" />
              <span className="relative -top-3 inline-block px-4 py-1 z-10 bg-white text-xs border border-gray-300 shadow-sm rounded-md">
                {formatDateLabel(date)}
              </span>
              {messages.map((message: typeof messages) => (
                <div key={message?._id}>{JSON.stringify(message)}</div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default MessageList;
