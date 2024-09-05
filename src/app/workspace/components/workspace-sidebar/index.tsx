import React from "react";
import UseGetWorkspaceId from "@/features/workspaces/hooks/use-workspace-Id";
import { useGetWorkspaceById } from "@/features/workspaces/api/use-get-workspace-by-id";
import WorkspaceHeader from "./workspace-header";
import SidebarItem from "./sidebar-item";
import DraftSent from "@/components/icons/draft-sent";
import { Button } from "@/components/ui/button";
import Rocket from "@/components/icons/rocket";
import Channels from "./channels";
import Members from "./members";
const WorkplaceSideBar = () => {
  const { workspaceId } = UseGetWorkspaceId();

  const { data: workspace, isLoading: _workspaceLoading } = useGetWorkspaceById(
    {
      id: workspaceId,
    }
  );

  return (
    <div className="text-white px-3 py-4">
      <WorkspaceHeader workspace={workspace?.result!} />
      <Button
        variant="secondary"
        className="w-full flex gap-2 mt-4 font-medium text-black text-md"
      >
        <Rocket />
        Upgrade plan
      </Button>
      <div className="mt-12 ">
        <SidebarItem
          icon={<DraftSent />}
          label="Drafts & sent"
          link="/workspace/drafts"
        />

        <Channels />

        <Members />
      </div>
    </div>
  );
};

export default WorkplaceSideBar;
