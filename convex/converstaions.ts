import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
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
      .unique();

    if (!member) return { success: false, result: null, error: "Unauthorized" };

    const initiatorId = member._id;

    const existingConversation = await ctx.db
      .query("conversations")
      .filter((q) => q.eq(q.field("workspaceId"), workspaceId))
      .filter((q) =>
        q.or(
          q.and(
            q.eq(q.field("initiatorId"), initiatorId),
            q.eq(q.field("receiverId"), receiverId)
          ),
          q.and(
            q.eq(q.field("initiatorId"), receiverId),
            q.eq(q.field("receiverId"), initiatorId)
          )
        )
      )
      .unique();

    if (existingConversation) {
      return {
        success: true,
        result: existingConversation._id,
        error: null,
      };
    }

    // Use insert if not exists to prevent race conditions
    const newConversationId = await ctx.db.insert("conversations", {
      workspaceId,
      initiatorId,
      receiverId,
      updatedAt: Date.now(),
    });
    return { success: true, result: newConversationId, error: null };
  },
});
