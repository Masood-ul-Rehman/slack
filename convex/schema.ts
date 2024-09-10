import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,
  workspaces: defineTable({
    workspaceId: v.string(),
    name: v.string(),
    userId: v.id("users"),
    joinCode: v.string(),
    image: v.optional(v.string()),
  }),
  members: defineTable({
    workspaceId: v.string(),
    userId: v.id("users"),
    role: v.union(v.literal("owner"), v.literal("member"), v.literal("guest")),
  })
    .index("by_user_id", ["userId"])
    .index("by_workspace_id", ["workspaceId"])
    .index("by_workspace_id_and_user_id", ["workspaceId", "userId"]),
  channels: defineTable({
    workspaceId: v.string(),
    channelId: v.string(),
    name: v.string(),
    type: v.union(v.literal("text"), v.literal("voice")),
    members: v.array(v.id("users")),
    status: v.union(v.literal("public"), v.literal("private")),
    channelOwner: v.id("users"),
  })
    .index("by_workspace_id_status", ["workspaceId", "status"])
    .index("by_workspace_id", ["workspaceId"])
    .index("by_workspace_id_channel_id", ["workspaceId", "channelId"]),
  conversations: defineTable({
    workspaceId: v.string(),
    initiatorId: v.id("members"),
    receiverId: v.id("members"),
    updatedAt: v.number(),
  })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_initiator_id", ["initiatorId"])
    .index("by_receiver_id", ["receiverId"]),
  messages: defineTable({
    workspaceId: v.string(),
    channelId: v.optional(v.string()),
    memberId: v.id("members"),
    body: v.string(),
    image: v.optional(v.string()),
    userId: v.id("users"),
    parentMessageId: v.optional(v.string()),
    conversationId: v.optional(v.id("conversations")),
    updatedAt: v.number(),
  })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_member_id", ["memberId"])
    .index("by_channel_id", ["channelId"])
    .index("by_conversation_id", ["conversationId"])
    .index("by_parent_message_id", ["parentMessageId"])
    .index("by_channel_id_parent_message_id_conversation_id", [
      "channelId",
      "parentMessageId",
      "conversationId",
    ]),
  reactions: defineTable({
    workspaceId: v.string(),
    messageId: v.id("messages"),
    memberId: v.id("members"),
    reaction: v.string(),
    updatedAt: v.number(),
  })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_message_id", ["messageId"])
    .index("by_member_id", ["memberId"]),
});

export default schema;
