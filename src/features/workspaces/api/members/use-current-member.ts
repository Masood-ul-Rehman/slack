import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export const useGetCurrentMember = ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  const data = useQuery(api.members.getCurrentMember, { workspaceId });
  const isLoading = data === undefined;
  return { isLoading, data };
};
