import React from "react";

import { Button } from "@/components/ui/button";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";

const NoWorkspaces = () => {
  const [open, setOpen] = useCreateWorkspaceModal();
  return (
    <div>
      <Button
        className="bg-slack_dark_bg text-white"
        onClick={() => setOpen(true)}
      >
        Create a new workspace
      </Button>
    </div>
  );
};

export default NoWorkspaces;
