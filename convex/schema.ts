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
  members: defineTable({
    workspaceId: v.string(),
    userId: v.id("users"),
    role: v.union(v.literal("owner"), v.literal("member"), v.literal("guest")),
  })
    .index("by_user_id", ["userId"])
    .index("by_workspace_id", ["workspaceId"])
    .index("by_workspace_id_and_user_id", ["workspaceId", "userId"]),
});

export default schema;
