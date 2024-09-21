import React from "react";
import Hint from "./hint";
import { Button } from "./ui/button";
import ThreadsIcon from "./icons/threads";
import ForwardIcon from "./icons/forward";
import { MoreVertical, Smile } from "lucide-react";
import LaterNormal from "./icons/later-normal";
import More from "./icons/more";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import EmojiPopover from "./emoji-popover";
interface MessageToolbarProps {
  isAuthor: boolean;
  isPending: boolean;
  handleEdit: () => void;
  handleDelete: () => void;
  handleThread: () => void;
  hideThreadButton: boolean;
  handleReaction: (emoji: any) => void;
}
const MessageToolbar = ({
  isAuthor,
  isPending,
  handleEdit,
  handleDelete,
  handleThread,
  hideThreadButton,
  handleReaction,
}: MessageToolbarProps) => {
  const MoreAction = () => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mr-6">
          <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDelete}
            className="text-red-500 hover:bg-red-500 hover:text-white "
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };
  return (
    <>
      <div className="opacity-0 group-hover:opacity-100 relative bg-white rounded-md p-1 bottom-6 border border-gray-200 max-w-[400px]  flex items-center justify-between gap-2">
        <EmojiPopover
          hint="Add reaction"
          onEmojiSelect={(emoji: any) => {
            handleReaction(emoji.native);
          }}
        >
          <Button variant="ghost" size="iconSm" disabled={isPending}>
            <Smile className="size-4" />
          </Button>
        </EmojiPopover>
        {!hideThreadButton && (
          <Hint label="Thread">
            <Button
              variant="ghost"
              size="iconSm"
              disabled={isPending}
              onClick={handleThread}
            >
              <div className="cursor-pointer w-4 h-4">
                <ThreadsIcon />
              </div>
            </Button>
          </Hint>
        )}
        <Hint label="Forward">
          <Button variant="ghost" size="iconSm" disabled={isPending}>
            <div className="cursor-pointer w-4 h-4">
              <ForwardIcon />
            </div>
          </Button>
        </Hint>
        <Hint label="Save">
          <Button variant="ghost" size="iconSm" disabled={isPending}>
            <div className="cursor-pointer w-4 h-4">
              <LaterNormal />
            </div>
          </Button>
        </Hint>
        {isAuthor && (
          <Hint label="More actions">
            <Button variant="ghost" size="iconSm" disabled={isPending}>
              <MoreAction />
            </Button>
          </Hint>
        )}
      </div>
    </>
  );
};

export default MessageToolbar;
