import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Workspace } from "@/features/workspaces/types";
import { Button } from "@/components/ui/button";

import EditNameModal from "./edit-name-model";
import { Trash } from "@phosphor-icons/react";
import { useDeleteWorkspace } from "@/features/workspaces/api/use-delete-workspace";
interface PrefrencesModalProps {
  open: number;
  onOpenChange: React.Dispatch<React.SetStateAction<number>>;
  workspace: Workspace;
}

const PrefrencesModal = ({
  open,
  onOpenChange,
  workspace,
}: PrefrencesModalProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const { mutate, isPending, data } = useDeleteWorkspace();
  const handleDelete = () => {
    mutate({ id: workspace.workspaceId });
    if (!isPending && data?.success == false)
      toast.error(data?.error || "Unknown error occured");
    else if (isPending) return <div>Loading...</div>;
    else {
      onOpenChange(0);
      toast.success("Workspace deleted");
      router.replace("/get-started");
    }
  };
  return (
    <Dialog open={open === 1} onOpenChange={() => onOpenChange(0)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Workspace Preferences</DialogTitle>
        </DialogHeader>
        <>
          <div className="border-gray-100 border rounded-md p-4 flex items-center justify-between">
            {!isEditing ? (
              <>
                <div>
                  <h2 className="text-sm font-bold">Workspace name</h2>
                  <h3 className="text-sm">{workspace.name}</h3>
                </div>
                <Button
                  variant={"transparent"}
                  size={"icon"}
                  className="text-blue-500 font-bold hover:text-blue-600"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              </>
            ) : (
              <EditNameModal
                open={isEditing}
                setOpen={setIsEditing}
                onCancel={() => setIsEditing(false)}
                workspace={workspace}
              />
            )}
          </div>
          <div
            className="border-gray-100 border rounded-md p-4 flex items-center gap-4 cursor-pointer"
            onClick={handleDelete}
          >
            <Trash size={24} className="text-red-500" />
            <h2 className="text-sm font-bold text-red-500">Delete Workspace</h2>
          </div>
        </>
      </DialogContent>
    </Dialog>
  );
};

export default PrefrencesModal;
