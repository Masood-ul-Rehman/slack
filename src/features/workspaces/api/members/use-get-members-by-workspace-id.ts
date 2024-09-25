import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export const useGetWorkspaceMembers = ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  const data = useQuery(api.members.getByWorkspaceId, { workspaceId });
  const isLoading = data === undefined;
  return { isLoading, data };
};
