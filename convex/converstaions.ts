import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createOrGetConversation = mutation({
  args: {
    workspaceId: v.string(),
    receiverId: v.id("members"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { success: false, result: null, error: "Unauthorized" };

    const { workspaceId, receiverId } = args;

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_and_user_id", (q) =>
        q.eq("workspaceId", workspaceId).eq("userId", userId)
      )
      .first();

    if (!member) return { success: false, result: null, error: "Unauthorized" };

    const initiatorId = member?._id;

    const existingConversation = await ctx.db
      .query("conversations")
      .filter((q) =>
        q.or(
          q.and(
            q.eq("workspaceId", workspaceId),
            q.eq(q.field("initiatorId"), initiatorId)
          ),
          q.and(
            q.eq("workspaceId", workspaceId),
            q.eq(q.field("receiverId"), receiverId)
          )
        )
      )
      .unique();
    if (existingConversation)
      return { success: true, result: existingConversation, error: null };

    const newConversation = await ctx.db.insert("conversations", {
      workspaceId: workspaceId,
      initiatorId: initiatorId,
      receiverId: receiverId,
      updatedAt: Date.now(),
    });
    if (!newConversation)
      return {
        success: false,
        result: null,
        error: "Failed to create conversation",
      };
    const conversation = await ctx.db
      .query("conversations")
      .withIndex("by_id", (q) => q.eq("_id", newConversation))
      .first();
    if (!conversation)
      return {
        success: false,
        result: null,
        error: "Failed to get conversation",
      };
    return { success: true, result: conversation, error: null };
  },
});
