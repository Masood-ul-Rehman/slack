import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
export const createMessage = mutation({
  args: {
    workspaceId: v.string(),
    channelId: v.string(),
    memberId: v.id("members"),
    messageId: v.string(),
    body: v.string(),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { workspaceId, channelId, memberId, messageId, body, image } = args;
    const userId = await getAuthUserId(ctx);
    if (!userId) return { success: false, result: null, error: "Unauthorized" };
    await ctx.db.insert("messages", {
      workspaceId,
      channelId,
      memberId,
      messageId,
      body,
      image,
      userId,
      updatedAt: Date.now(),
    });
  },
});
