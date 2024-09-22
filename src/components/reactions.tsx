import { MdOutlineAddReaction } from "react-icons/md";
import { cn } from "@/lib/utils";

import Hint from "./hint";
import EmojiPopover from "./emoji-popover";
import { Button } from "./ui/button";
import { ReactionsProps } from "@/features/workspaces/types";
import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-Id";
import { useGetCurrentMember } from "@/features/workspaces/api/members/use-current-member";

export const Reactions = ({ data, onChange }: ReactionsProps) => {
  const { workspaceId } = useWorkspaceId();
  const currentMember: any = useGetCurrentMember({ workspaceId });
  if (data.length === 0 || !currentMember.data?.result?._id) return null;
  return (
    <div className="flex items-center gap-1 my-1">
      {data.map((reaction) => (
        <Hint
          key={reaction._id}
          label={`${reaction.count} ${reaction.count === 1 ? "person" : "people"} reacted with ${reaction.reaction}`}
        >
          <Button
            key={reaction._id}
            className={cn(
              "flex items-center gap-1 h-6 px-2 rounded-full bg-slate-200/70 border border-transparent text-slate-700 hover:bg-slate-200 text-muted-foreground",
              reaction.memberIds.includes(currentMember.data?.result?._id) &&
                "bg-blue-100/70 border-blue-500 text-blue"
            )}
            onClick={() => {
              onChange(reaction.reaction);
            }}
          >
            {reaction.reaction}
            <span className="text-xs font-semibold">{reaction.count}</span>
          </Button>
        </Hint>
      ))}
      <EmojiPopover
        hint="Add reaction"
        onEmojiSelect={(emoji: string) => {
          onChange(emoji);
        }}
      >
        <button className="h-7 px-3 rounded-full bg-slate-200/70 border border-transparent text-slate-700 hover:bg-slate-200 text-muted-foreground">
          <MdOutlineAddReaction className="size-4" />
        </button>
      </EmojiPopover>
    </div>
  );
};
