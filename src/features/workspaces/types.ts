import { z } from "zod";
import { Id } from "@/convex/_generated/dataModel";

export const createWorkspaceSchema = z.object({
  name: z.string().min(3, {
    message: "Workspace name must be at least 3 characters",
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
  members: string[];
}
