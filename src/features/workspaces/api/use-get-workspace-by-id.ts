import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export const useGetWorkspaceById = ({ id }: { id: string }) => {
  const data = useQuery(api.workspaces.getById, { id: id });

  const isLoading = data === undefined;
  return { isLoading, data };
};
