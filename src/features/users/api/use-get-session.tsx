import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export const useGetSession = () => {
  const data = useQuery(api.users.getSession);
  const isLoading = data === undefined;
  return { isLoading, data };
};
