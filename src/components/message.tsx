import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { format, isToday, isYesterday } from "date-fns";

import Hint from "./hint";
import WorkspaceAvatar from "./workspace-avater";
import Thumbnail from "./thumbnail";
import MessageToolbar from "./message-toolbar";
import { useDeleteMessage } from "@/features/workspaces/api/messages/use-delete-message";
import { useEditMessage } from "@/features/workspaces/api/messages/use-edit-message";
import { MessageProps } from "@/features/workspaces/types";
import { cn } from "@/lib/utils";
const Renderer = dynamic(() => import("./renderer"), { ssr: false });

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
  isCompact,
}: MessageProps) => {
  useEffect(() => {
    console.log(isEditing, "this is isEditing");
  }, [isEditing]);

  const {
    mutate: deleteMessage,
    isPending: isDeletePending,
    data: deleteData,
  } = useDeleteMessage();
  const {
    mutate: editMessage,
    isPending: isEditPending,
    data: editData,
  } = useEditMessage();
  const handleDelete = () => {
    deleteMessage({ messageId: id });
  };

  const handleEdit = () => {
    editMessage({ messageId: id, body });
    setEditingId(null);
  };

  const formatFullTime = (date: Date) => {
    return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d, yyyy")} at ${format(new Date(createdAt), "hh:mm a")}`;
  };
  if (isCompact) {
    return (
      <div
        className={cn(
          "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative cursor-pointer w-full",
          isEditing && "bg-[#f2c74433] hover:bg-[f2c74433]"
        )}
      >
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-start gap-4">
            <Hint label={formatFullTime(new Date(createdAt))}>
              <button className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 w-fit text-center pt-[4px]">
                {format(new Date(createdAt), "hh:mm a")}
              </button>
            </Hint>
            <div className="flex flex-col gap-1">
              <Renderer value={body} />
              {image && <Thumbnail url={image} />}
              {updatedAt ? (
                <p className="text-xs text-muted-foreground">(edited)</p>
              ) : null}
            </div>
          </div>
          {!isEditing && (
            <MessageToolbar
              isAuthor={isAuthor}
              isPending={false}
              handleEdit={() => setEditingId(id)}
              handleDelete={handleDelete}
              handleThread={() => {}}
              hideThreadButton={false}
              handleReaction={() => {}}
            />
          )}
        </div>
      </div>
    );
  }
  return (
    <div
      className={cn(
        "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative cursor-pointer",
        isEditing && "bg-[#f2c74433] hover:bg-[f2c74433]"
      )}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex items-start gap-4 ">
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
            {updatedAt ? (
              <p className="text-xs text-muted-foreground">(edited)</p>
            ) : null}
            {image && <Thumbnail url={image} />}
          </div>
        </div>
        {!isEditing && (
          <MessageToolbar
            isAuthor={isAuthor}
            isPending={false}
            handleEdit={() => setEditingId(id)}
            handleDelete={handleDelete}
            handleThread={() => {}}
            hideThreadButton={false}
            handleReaction={() => {}}
          />
        )}
      </div>
    </div>
  );
};

export default Message;
