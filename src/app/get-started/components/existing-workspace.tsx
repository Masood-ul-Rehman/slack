import React from "react";

const ExistingWorkspaces = ({ workspaces }: any) => {
  return (
    <div>
      {workspaces.map((workspace: any) => workspace.name + "," + workspace._id)}
    </div>
  );
};

export default ExistingWorkspaces;
