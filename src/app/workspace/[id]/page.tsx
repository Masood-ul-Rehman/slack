"use client";
import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import { useGetSession } from "@/features/users/api/use-get-session";
import { useGetWorkspaceById } from "@/features/workspaces/api/use-get-workspace-by-id";
import { useGetChannelsByWorkspaceId } from "@/features/workspaces/api/channels/use-get-channels";
import { useSetChannel } from "@/features/workspaces/store/use-set-channel";
import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-Id";

const Workspace = () => {
  const router = useRouter();
  const { workspaceId } = useWorkspaceId();
  const [_channel, setChannel] = useSetChannel();

  const { data, isLoading } = useGetSession();
  const { data: workspaceData, isLoading: isLoadingWorkspace } =
    useGetWorkspaceById({
      id: workspaceId,
    });
  const { data: channels, isLoading: channelsLoading } =
    useGetChannelsByWorkspaceId({ id: workspaceId });
  const channelId = useMemo(() => {
    if (!channels?.result || channelsLoading) return undefined;
    return channels.result[0]?.channelId;
  }, [channels, channelsLoading]);

  useEffect(() => {
    if (isLoading || isLoadingWorkspace || channelsLoading) return;
    if (channelId) {
      setChannel(channelId);
      router.replace(`/workspace/${workspaceId}/${channelId}`);
    }
    if (workspaceId === undefined || workspaceId === "") {
      router.replace("/auth/signin");
    }

    if (data?.error === "Session not found") {
      return router.replace("/auth/signin");
    }

    if (workspaceData?.error === "Workspace not found") {
      router.replace("/auth/signin");
    } else {
    }
  }, [
    workspaceId,
    data,
    channelId,
    setChannel,
    isLoading,
    isLoadingWorkspace,
    router,
    workspaceData,
    channelsLoading,
  ]);

  return <div>Workspace</div>;
};

export default Workspace;
