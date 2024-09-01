import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { generateWorkspaceId } from "../src/lib/utils";
const schema = defineSchema({
  ...authTables,
  workspaces: defineTable({
    workspaceId: v.string(),
    name: v.string(),
    userId: v.id("users"),
    joinCode: v.string(),
    image: v.optional(v.string()),
    members: v.array(v.id("users")),
  }),
});

export default schema;
