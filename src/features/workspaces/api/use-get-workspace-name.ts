import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export const useGetWorkspaceName = (workspaceId: string) => {
  const data = useQuery(api.workspaces.getBasicInfo, {
    id: workspaceId,
  });

  const isLoading = data === undefined;
  return { isLoading, data };
};
