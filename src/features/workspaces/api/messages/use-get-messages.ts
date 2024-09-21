import { usePaginatedQuery, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface UseGetMessagesProps {
  channelId?: string;
  parentMessageId?: Id<"messages">;
  conversationId?: Id<"conversations">;
}
export type GetMessagesReturnType =
  (typeof api.messages.get._returnType)["page"];

let BATCH_SIZE = 20;

export const useGetMessages = ({
  channelId,
  parentMessageId,
  conversationId,
}: UseGetMessagesProps) => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.messages.get,
    { channelId, conversationId, parentMessageId },
    { initialNumItems: BATCH_SIZE }
  );

  return { results, status, loadMore: () => loadMore(BATCH_SIZE) };
};
