import { ReactionsProps } from "@/features/workspaces/types";
import { Id } from "@/convex/_generated/dataModel";
import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-Id";
import { useGetCurrentMember } from "@/features/workspaces/api/members/use-current-member";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
export const Reactions = ({ data, onChange }: ReactionsProps) => {
  const { workspaceId } = useWorkspaceId();
  const currentMember: any = useGetCurrentMember({ workspaceId });
  if (data.length === 0 || !currentMember.data?.result?._id) return null;
  return (
    <div className="flex items-center gap-1 my-1">
      {data.map((reaction) => (
        <Button
          key={reaction._id}
          className={cn(
            "flex items-center gap-1 h-6 px-2 rounded-full bg-slate-200/70 border border-transparent text-slate-700 hover:bg-slate-200",
            reaction.memberIds.includes(currentMember.data?.result?._id) &&
              "bg-blue-100/70 border-blue-500 text-blue"
          )}
          onClick={() => {
            onChange(reaction.reaction);
          }}
        >
          <span>{reaction.reaction}</span>
          <span>{reaction.count}</span>
        </Button>
      ))}
    </div>
  );
};
