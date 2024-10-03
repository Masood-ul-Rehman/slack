import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export const useGetUserNotifications = ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  const data = useQuery(api.notifications.getNotifications, {
    workspaceId,
  });
  const isLoading = data === undefined;
  return { isLoading, data };
};
