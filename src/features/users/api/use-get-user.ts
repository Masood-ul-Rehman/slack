import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export const useGetUser = () => {
  const data = useQuery(api.users.get);
  const isLoading = data === undefined;
  return { isLoading, data };
};
