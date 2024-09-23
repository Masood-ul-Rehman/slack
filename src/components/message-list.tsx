import React, { useState } from "react";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import { Loader } from "lucide-react";

import Message from "./message";
import ChannelHero from "./channel-hero";
import { useGetSession } from "@/features/users/api/use-get-session";
import { MessageListProps } from "@/features/workspaces/types";

const TIME_THRESHOLD = 1;
const MessageList = ({
  channelName,
  channelCreatedAt,
  variant,
  messages,
  loadMore,
  isLoadingMore,
  canLoadMore,
}: MessageListProps) => {
  const [isEditing, setIsEditing] = useState<string | null>(null);
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
  const { data: session } = useGetSession();
  const userId = session?.result?.userId;

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
  const LoadMoreMessages = () => {
    return (
      <div
        className="h-1 "
        ref={(el) => {
          if (el) {
            const observer = new IntersectionObserver(
              ([entry]) => {
                if (entry.isIntersecting && canLoadMore) {
                  loadMore();
                }
              },
              { threshold: 1.0 }
            );
            observer.observe(el);
            return () => observer.disconnect();
          }
        }}
      />
    );
  };
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
            {messages.map((message: (typeof messages)[0]) => {
              const isUpdated =
                differenceInMinutes(
                  new Date(message.updatedAt),
                  new Date(message._creationTime)
                ) >= 1
                  ? message.updatedAt
                  : null;

              const previousMessage = messages[messages.indexOf(message) - 1];
              const isCompact =
                previousMessage &&
                previousMessage.user.id === message.user.id &&
                differenceInMinutes(
                  new Date(message._creationTime),
                  new Date(previousMessage._creationTime)
                ) < TIME_THRESHOLD;
              return (
                <Message
                  key={message._id}
                  id={message._id}
                  isAuthor={message.user._id === userId}
                  memeberId={message.memberId}
                  authorName={message.user.name}
                  authorImage={message.user.image}
                  reaction={message.reactions}
                  body={message.body}
                  image={message.image}
                  updatedAt={isUpdated}
                  createdAt={message._creationTime}
                  isEditing={isEditing === message._id}
                  setEditingId={(id) => setIsEditing(id)}
                  isCompact={isCompact}
                  threadCount={messages.threadCount}
                  threadImage={messages.threadImage}
                  threadTimeStamp={messages.threadTimeStamp}
                  channelCreatedAt={channelCreatedAt}
                  variant={variant}
                />
              );
            })}
          </div>
        ))}
      <LoadMoreMessages />
      {isLoadingMore && (
        <div className="text-center my-2 relative ">
          <hr className="absolute  left-0 right-0 border-t border-gray-300" />
          <span className="relative -top-3 inline-block px-4 py-1 z-10 bg-white text-xs border border-gray-300 shadow-sm rounded-md">
            <Loader className="size-4 animate-spin transition-all" />
          </span>
        </div>
      )}
      {variant === "channel" && (
        <ChannelHero
          channelName={channelName}
          channelCreatedAt={channelCreatedAt}
        />
      )}
    </div>
  );
};

export default MessageList;
