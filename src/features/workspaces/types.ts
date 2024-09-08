import { z } from "zod";
import { Id } from "@/convex/_generated/dataModel";

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
