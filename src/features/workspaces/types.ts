import { z } from "zod";
import { Id, Doc } from "@/convex/_generated/dataModel";
import { GetMessagesReturnType } from "@/features/workspaces/api/messages/use-get-messages";

export const createWorkspaceItemsSchema = z.object({
  name: z.string().max(12).min(3, {
    message: "Workspace name must be at least 3 characters ",
  }),
});

export interface Workspace {
  _id: Id<"workspaces">;
  _creationTime: number;
  workspaceId: string;
  name: string;
  userId: string;
  joinCode: string;
  image?: string | undefined;
}
export interface Channel {
  _id: Id<"channels">;
  _creationTime: number;
  name: string;
  type: "text" | "voice";
  status: "public" | "private";
  members: Id<"users">[];
  workspaceId: Id<"workspaces">;
  channelOwner: Id<"users">;
  channelId: string;
}
export interface MessageProps {
  id: Id<"messages">;
  memeberId: Id<"members">;
  authorImage?: string;
  authorName?: string;
  isAuthor: boolean;
  reaction: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number;
      memberIds: Array<Id<"members">>;
    }
  >;
  body: Doc<"messages">["body"];
  image?: string | null | undefined;
  isEditing: boolean;
  setEditingId: (id: Id<"messages"> | null) => void;
  threadCount?: number;
  threadImage?: string | null | undefined;
  threadTimeStamp?: number;
  channelCreatedAt?: Date | undefined;
  variant?: "channel" | "thread" | "conversation";
  isCompact: boolean;
  updatedAt: Doc<"messages">["updatedAt"];
  createdAt: Doc<"messages">["_creationTime"];
}
export interface MessageListProps {
  memberName?: string;
  memberImage?: string;
  channelName?: string;
  channelCreatedAt?: Date;
  variant?: "channel" | "thread" | "conversation";
  messages: GetMessagesReturnType | undefined;
  loadMore: () => void;
  isLoadingMore: boolean;
  canLoadMore: boolean;
}
