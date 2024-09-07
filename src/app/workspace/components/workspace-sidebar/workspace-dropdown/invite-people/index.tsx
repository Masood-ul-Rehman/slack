import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Copy, RefreshCw, Loader } from "lucide-react";
import { toast } from "sonner";
import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-Id";
import { useGetWorkspaceById } from "@/features/workspaces/api/use-get-workspace-by-id";
import { useUpdateWorkspace } from "@/features/workspaces/api/use-update-workspace";
import { generateJoinCode } from "@/lib/utils";
const InvitePeopleModal = ({
  open,
  onOpenChange,
}: {
  open: number;
  onOpenChange: (open: number) => void;
}) => {
  const { workspaceId } = useWorkspaceId();
  const { data, isLoading } = useGetWorkspaceById({ id: workspaceId });
  const [inviteCode, setInviteCode] = useState(data?.result?.joinCode!);
  const { mutate, isPending, data: updateData } = useUpdateWorkspace();
  const generateCode = () => {
    mutate({ id: workspaceId, joinCode: generateJoinCode() });
    if ((!isPending && updateData?.success) || isLoading) {
      setInviteCode(data?.result?.joinCode!);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/join/${workspaceId}/${inviteCode}`
      );
      toast.success("Copied!", {
        description: "Invite code copied to clipboard.",
      });
    } catch (err) {
      toast.error("Failed to copy", {
        description: "Please try again.",
      });
    }
  };

  return (
    <Dialog open={open === 2} onOpenChange={() => onOpenChange(0)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite to Workspace</DialogTitle>
          <DialogDescription>
            Share this code with people you want to invite to your workspace.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Input
              id="invite-code"
              value={inviteCode}
              readOnly
              className="text-center text-lg font-medium"
            />
          </div>
          <Button
            type="submit"
            size="sm"
            className="px-3"
            onClick={copyToClipboard}
          >
            <span className="sr-only">Copy</span>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <DialogFooter className="sm:justify-between">
          <Button
            type="button"
            className="w-[200px]"
            variant="secondary"
            onClick={generateCode}
          >
            {isPending ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin " />
                Regenerating Code
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerate Code
              </>
            )}
          </Button>

          <Button
            type="button"
            disabled={isPending}
            className="w-[200px]"
            onClick={() => onOpenChange(0)}
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvitePeopleModal;
