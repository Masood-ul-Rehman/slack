import React from "react";
import dynamic from "next/dynamic";
import { format, isToday, isYesterday } from "date-fns";

import { cn } from "@/lib/utils";
import Hint from "./hint";
import WorkspaceAvatar from "./workspace-avater";
import Thumbnail from "./thumbnail";
import MessageToolbar from "./message-toolbar";
import { Reactions } from "./reactions";
import ThreadBar from "./thread-bar";
import { useDeleteMessage } from "@/features/workspaces/api/messages/use-delete-message";
import { useEditMessage } from "@/features/workspaces/api/messages/use-edit-message";
import { useCreateReaction } from "@/features/workspaces/api/messages/use-create-reaction";
import { MessageProps } from "@/features/workspaces/types";
import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-Id";
import { useGetCurrentMember } from "@/features/workspaces/api/members/use-current-member";
import { usePanel } from "@/features/workspaces/hooks/use-panel";
const Renderer = dynamic(() => import("./renderer"), { ssr: false });
const Editor = dynamic(() => import("./editor"), { ssr: false });

const Message = ({
  id,
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
  variant,
  isCompact,
}: MessageProps) => {
  const { workspaceId } = useWorkspaceId();
  const { onOpenMessage, onCloseMessage, parentMessageId } = usePanel();
  const { data: currentMember }: any = useGetCurrentMember({ workspaceId });
  const { mutate: deleteMessage } = useDeleteMessage();
  const { mutate: editMessage, isPending: isEditPending } = useEditMessage();
  const { mutate: createReaction, isPending: isReactionPending } =
    useCreateReaction();
  const handleDelete = () => {
    deleteMessage({ messageId: id });
    if (parentMessageId === id) {
      onCloseMessage();
    }
  };

  const handleUpdate = (body: string) => {
    editMessage({ messageId: id, body });
    setEditingId(null);
  };

  const handleReaction = (emoji: string) => {
    if (!currentMember?.result?._id || isReactionPending) return;
    createReaction({
      messageId: id,
      memberId: currentMember?.result?._id,
      reaction: emoji,
    });
  };
  const formatFullTime = (date: Date) => {
    return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d, yyyy")} at ${format(new Date(createdAt), "hh:mm a")}`;
  };
  if (isCompact) {
    return (
      <div
        className={cn(
          "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative cursor-pointer w-full ",
          isEditing && "bg-[#f2c74433] hover:bg-[f2c74433]"
        )}
      >
        <div className="flex  items-start gap-4">
          {isEditing ? (
            <div className="w-full h-full">
              <Editor
                onSubmit={(data) => handleUpdate(data.body)}
                disabled={isEditPending}
                defaultValue={JSON.parse(body)}
                variant="edit"
                onCancel={() => setEditingId(null)}
              />
            </div>
          ) : (
            <div className="flex items-start gap-4 w-full">
              <Hint label={formatFullTime(new Date(createdAt))}>
                <button className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 w-fit text-center pt-[4px]">
                  {format(new Date(createdAt), "hh:mm a")}
                </button>
              </Hint>
              <div className="flex flex-col gap-1">
                <Renderer value={body} variant={variant} />
                {image && <Thumbnail url={image} />}
                {updatedAt ? (
                  <p className="text-xs text-muted-foreground">(edited)</p>
                ) : null}
                <Reactions data={reaction} onChange={handleReaction} />
                <ThreadBar
                  count={threadCount!}
                  image={threadImage!}
                  timeStamp={threadTimeStamp as any}
                  onClick={() => onOpenMessage(id)}
                />
              </div>
            </div>
          )}
          {!isEditing && (
            <MessageToolbar
              isAuthor={isAuthor}
              isPending={false}
              handleEdit={() => setEditingId(id)}
              handleDelete={handleDelete}
              handleThread={() => onOpenMessage(id)}
              hideThreadButton={variant === "thread"}
              handleReaction={handleReaction}
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
      <>
        <div className="flex items-start gap-4 w-full">
          <WorkspaceAvatar img={authorImage} name={authorName} />
          {isEditing ? (
            <div className="w-full h-full">
              <Editor
                onSubmit={(data) => handleUpdate(data.body)}
                disabled={isEditPending}
                defaultValue={JSON.parse(body)}
                variant="edit"
                onCancel={() => setEditingId(null)}
              />
            </div>
          ) : (
            <div className="flex flex-col gap-[2px] w-full">
              <div className="flex items-center gap-2">
                <h2 className="text-md font-bold">{authorName}</h2>
                <Hint label={formatFullTime(new Date(createdAt))}>
                  <button className="text-[10px] text-muted-foreground  w-fit text-center pt-[4px]">
                    {format(new Date(createdAt), "hh:mm a")}
                  </button>
                </Hint>
              </div>
              <Renderer value={body} variant={variant} />
              {updatedAt ? (
                <p className="text-xs text-muted-foreground">(edited)</p>
              ) : null}
              {image && <Thumbnail url={image} />}
              <Reactions data={reaction} onChange={handleReaction} />
              <ThreadBar
                count={threadCount!}
                image={threadImage!}
                timeStamp={threadTimeStamp as any}
                onClick={() => onOpenMessage(id)}
              />
            </div>
          )}
        </div>
        {!isEditing && (
          <MessageToolbar
            isAuthor={isAuthor}
            isPending={false}
            handleEdit={() => setEditingId(id)}
            handleDelete={handleDelete}
            handleThread={() => onOpenMessage(id)}
            hideThreadButton={variant === "thread"}
            handleReaction={handleReaction}
          />
        )}
      </>
    </div>
  );
};

export default Message;
