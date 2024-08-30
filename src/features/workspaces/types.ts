import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().min(3, {
    message: "Workspace name must be at least 3 characters",
  }),
});
