import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export const useGetChannelsByWorkspaceId = ({ id }: { id: string }) => {
  const data = useQuery(api.channels.getChannels, {
    workspaceId: id,
  });

  const isLoading = data === undefined;
  return { data, isLoading };
};
