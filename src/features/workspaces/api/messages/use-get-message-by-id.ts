import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export const useGetMessageById = (messageId: Id<"messages">) => {
  const data = useQuery(api.messages.getById, { messageId });

  const isLoading = data === undefined;
  return { isLoading, data };
};
