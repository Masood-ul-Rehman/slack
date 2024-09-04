import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Workspace } from "@/features/workspaces/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import EditNameModal from "./edit-name-model";
import { toast } from "sonner";
interface PrefrencesModalProps {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  workspace: Workspace;
}

const PrefrencesModal = ({
  open,
  onOpenChange,
  workspace,
}: PrefrencesModalProps) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Dialog open={open} onOpenChange={() => onOpenChange(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Workspace Preferences</DialogTitle>
        </DialogHeader>
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
            <>
              <EditNameModal
                open={isEditing}
                setOpen={setIsEditing}
                onCancel={() => setIsEditing(false)}
                workspace={workspace}
              />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrefrencesModal;
