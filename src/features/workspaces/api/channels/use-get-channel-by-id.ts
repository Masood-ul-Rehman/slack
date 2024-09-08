import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export const useGetChannelById = (channelId: string, workspaceId: string) => {
  const data = useQuery(api.channels.getById, {
    channelId,
    workspaceId,
  });
  const isLoading = data === undefined;
  return { data, isLoading };
};
