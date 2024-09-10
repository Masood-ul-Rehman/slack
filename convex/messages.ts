import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getMember = query({
  args: {
    userId: v.id("users"),
    workspaceId: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId, workspaceId } = args;
    return await ctx.db
      .query("members")
      .withIndex("by_workspace_id_and_user_id", (q) =>
        q.eq("workspaceId", workspaceId).eq("userId", userId)
      )
      .first();
  },
});
export const createMessage = mutation({
  args: {
    workspaceId: v.string(),
    channelId: v.string(),
    body: v.string(),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { workspaceId, channelId, body, image } = args;
    const userId = await getAuthUserId(ctx);
    if (!userId) return { success: false, result: null, error: "Unauthorized" };
    const member = await getMember(ctx, { workspaceId, userId });
    if (!member) return { success: false, result: null, error: "Unauthorized" };
    const messageId = await ctx.db.insert("messages", {
      workspaceId,
      channelId,
      memberId: member._id,
      body,
      image,
      userId,
      updatedAt: Date.now(),
    });
    return { success: true, result: messageId, error: null };
  },
});
