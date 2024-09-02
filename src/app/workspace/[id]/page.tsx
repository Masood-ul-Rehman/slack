"use client";
import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useGetSession } from "@/features/users/api/use-get-session";
import { useGetWorkspaceById } from "@/features/workspaces/api/use-get-workspace-by-id";
const Workspace = () => {
  const router = useRouter();
  const pathname = usePathname();
  const workspaceId = pathname.split("/")[2];

  const { data, isLoading } = useGetSession();
  const { data: workspaceData, isLoading: isLoadingWorkspace } =
    useGetWorkspaceById({
      id: workspaceId,
    });

  useEffect(() => {
    if (workspaceId === undefined || workspaceId === "") {
      router.replace("/auth/signin");
      return;
    }

    if (isLoading || isLoadingWorkspace) return;

    if (!data?.result?.userId || data?.error === "Session not found") {
      router.replace("/auth/signin");
      return;
    }

    if (workspaceData?.error === "Workspace not found") {
      console.log("there is an error ");
      router.replace("/auth/signin");
    } else {
      console.log("nothing");
    }
  }, [workspaceId, data, isLoading, isLoadingWorkspace, router, workspaceData]);

  return <div>Workspace</div>;
};

export default Workspace;
