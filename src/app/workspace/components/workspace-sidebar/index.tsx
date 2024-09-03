import React from "react";
import UseGetWorkspaceId from "@/features/hooks/use-workspace-Id";
import { useGetWorkspaceById } from "@/features/workspaces/api/use-get-workspace-by-id";
import WorkspaceHeader from "./workspace-header";

const WorkplaceSideBar = () => {
  const { workspaceId } = UseGetWorkspaceId();

  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspaceById({
    id: workspaceId,
  });

  return (
    <div className="text-white m-5 ">
      <WorkspaceHeader workspace={workspace?.result!} />
    </div>
  );
};

export default WorkplaceSideBar;
