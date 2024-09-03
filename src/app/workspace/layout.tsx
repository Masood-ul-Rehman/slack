"use client";

import React from "react";
import { Loader } from "lucide-react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Sidebar from "./components/sidebar";
import Searchbar from "./components/searchbar";
import WorkplaceSideBar from "./components/workspace-sidebar";
import useWorkspaceId from "@/features/hooks/use-workspace-Id";
import { useGetWorkspaceById } from "@/features/workspaces/api/use-get-workspace-by-id";
import { useRouter } from "next/navigation";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { workspaceId } = useWorkspaceId();
  const router = useRouter();
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspaceById({
    id: workspaceId,
  });
  if (workspaceLoading)
    return (
      <div className="w-[100vw] h-[100vh] flex flex-col gap-4 justify-center items-center bg-[#f4ede480]">
        <Loader className="size-6 animate-spin text-black" />
        <h4 className="text-xl font-medium">Loading your amazing workspace</h4>
      </div>
    );
  else if (workspace?.error) router.push("/auth/signin");
  return (
    <div className="flex flex-col h-[100vh] ">
      <Searchbar />
      <div className="flex h-[calc(100vh-47px)] bg-slack_dark_bg">
        <Sidebar />
        <div className="w-[calc(100vw-80px)]  ">
          <ResizablePanelGroup
            direction="horizontal"
            autoSaveId="view-workspace"
          >
            <ResizablePanel
              defaultSize={20}
              minSize={15}
              maxSize={30}
              className="bg-[#5e2c5f] rounded-tl-xl rounded-bl-xl "
            >
              <WorkplaceSideBar />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel minSize={20} defaultSize={50} className="bg-white">
              {children}
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  );
};

export default Layout;
