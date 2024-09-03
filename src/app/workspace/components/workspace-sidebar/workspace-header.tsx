import { Workspace } from "@/features/workspaces/types";
import React from "react";
import WorkspaceDropdown from "./workspace-dropdown";
import Filter from "@/components/icons/filter";
import NewMessage from "@/components/icons/new-message";
import Hint from "@/components/hint";

const WorkspaceHeader = ({ workspace }: { workspace: Workspace }) => {
  return (
    <div className="flex justify-between items-center">
      <WorkspaceDropdown workspace={workspace} />
      <div className="flex gap-4 items-center">
        <Hint label="Filter">
          <div className="w-5 h-5">
            <Filter />
          </div>
        </Hint>
        <Hint label="New message">
          <div className="w-5 h-5">
            <NewMessage />
          </div>
        </Hint>
      </div>
    </div>
  );
};

export default WorkspaceHeader;
