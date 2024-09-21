import React from "react";
import dynamic from "next/dynamic";
import { Id, Doc } from "@/convex/_generated/dataModel";
import { format, isToday, isYesterday } from "date-fns";
import Hint from "./hint";
import { Avatar } from "./ui/avatar";
import WorkspaceAvatar from "./workspace-avater";
const Renderer = dynamic(() => import("./renderer"), { ssr: false });

interface MessageProps {
  id: Id<"messages">;
  memeberId: Id<"members">;
  authorImage?: string;
  authorName?: string;
  isAuthor: boolean;
  reaction: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number;
      memberIds: Array<Id<"members">>;
    }
  >;
  body: Doc<"messages">["body"];
  image?: string | null | undefined;
  isEditing: boolean;
  setEditingId: (id: Id<"messages">) => void;
  threadCount?: number;
  threadImage?: string | null | undefined;
  threadTimeStamp?: number;
  channelCreatedAt?: string | undefined;
  variant?: "channel" | "thread" | "conversation";
  isCompact: boolean;
  updatedAt: Doc<"messages">["updatedAt"];
  createdAt: Doc<"messages">["_creationTime"];
}
const Message = ({
  id,
  memeberId,
  authorImage,
  authorName = "Member",
  isAuthor,
  reaction,
  body,
  image,
  updatedAt,
  createdAt,
  isEditing,
  setEditingId,
  threadCount,
  threadImage,
  threadTimeStamp,
  channelCreatedAt,
  variant,
}: MessageProps) => {
  const formatFullTime = (date: Date) => {
    return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d, yyyy")}`;
  };
  return (
    <div className="flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative cursor-pointer">
      <div className="flex items-start gap-4">
        <WorkspaceAvatar img={authorImage} name={authorName} />
        <div className="flex flex-col gap-[2px]">
          <div className="flex items-center gap-2">
            <h2 className="text-md font-bold">{authorName}</h2>
            <Hint label={formatFullTime(new Date(createdAt))}>
              <button className="text-[10px] text-muted-foreground  w-fit text-center pt-[4px]">
                {format(new Date(createdAt), "hh:mm a")}
              </button>
            </Hint>
          </div>
          <Renderer value={body} />
        </div>
      </div>
    </div>
  );
};

export default Message;
