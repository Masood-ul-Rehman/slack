"use client";

import React, { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Sidebar from "./components/sidebar";
import Searchbar from "./components/searchbar";
import WorkplaceSideBar from "./components/workspace-sidebar";
import ThreadPanel from "./components/thread-pannel";
import { usePanel } from "@/features/workspaces/hooks/use-panel";
import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-Id";
import { useGetWorkspaceById } from "@/features/workspaces/api/use-get-workspace-by-id";
import { useGetCurrentMember } from "@/features/workspaces/api/members/use-current-member";
import { useGetUserNotifications } from "@/features/notifications/api/get-user-notifications";
import { useReadNotification } from "@/features/notifications/api/use-read-notification";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { channelId, memberId } = useParams();
  const [prevLength, setPrevLength] = useState(0);
  const { workspaceId } = useWorkspaceId();
  const { parentMessageId, onCloseMessage } = usePanel();
  const { data: user } = useGetCurrentMember({
    workspaceId: workspaceId as string,
  });
  const { data: notifications } = useGetUserNotifications({
    workspaceId,
    memberId: (user?.result as any)?._id as Id<"members">,
  });
  const showPanel = !!parentMessageId;
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspaceById({
    id: workspaceId,
  });
  const { mutate: readNotification } = useReadNotification();

  useEffect(() => {
    const unreadNotifications = notifications?.filter(
      (notification) => !notification.read
    );
    setPrevLength(unreadNotifications?.length || 0);
    if (prevLength < (unreadNotifications?.length || 0)) {
      const audio = new Audio("/notification.mp3");
      audio.play();
    }
    setPrevLength(unreadNotifications?.length || 0);
  }, [notifications, prevLength]);

  useEffect(() => {
    if (channelId) {
      const unreadNotifications = notifications?.filter(
        (notification) =>
          notification.channelId === channelId && !notification.read
      );
      if (unreadNotifications && unreadNotifications.length > 0) {
        for (const notification of unreadNotifications) {
          readNotification({
            notificationId: notification._id as Id<"notifications">,
          });
        }
      }
    }
    if (memberId) {
      const unreadNotifications = notifications?.filter(
        (notification) =>
          notification.notificationFrom === memberId && !notification.read
      );
      if (unreadNotifications && unreadNotifications.length > 0) {
        for (const notification of unreadNotifications) {
          readNotification({
            notificationId: notification._id as Id<"notifications">,
          });
        }
      }
    }
  }, [router, channelId, memberId, notifications, readNotification, user]);

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
            {showPanel && (
              <ResizablePanel
                minSize={20}
                defaultSize={29}
                className="bg-white"
              >
                {parentMessageId ? (
                  <ThreadPanel
                    messageId={parentMessageId as Id<"messages">}
                    onClose={onCloseMessage}
                  />
                ) : (
                  <div className="flex justify-center items-center h-full">
                    <Loader className="size-6 animate-spin text-black" />
                  </div>
                )}
              </ResizablePanel>
            )}
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  );
};

export default Layout;
