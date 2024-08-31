import React from "react";

const ExistingWorkspaces = ({ workspaces }: any) => {
  return (
    <div className="bg-[#f4ede480]">
      {workspaces?.map(
        (workspace: any) => workspace.name + "," + workspace._id
      )}
    </div>
  );
};

export default ExistingWorkspaces;
