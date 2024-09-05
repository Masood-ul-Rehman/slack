import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getChannels = query({
  args: {
    workspaceId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { success: false, result: null, error: "Unauthorized" };

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_and_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .first();
    if (!member) return { success: false, result: null, error: "Unauthorized" };
    const channels = await ctx.db
      .query("channels")
      .withIndex("by_workspace_id_member_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("members", [userId])
      )
      .collect();
    return { success: true, result: channels, error: "" };
  },
});

export const createChannel = mutation({
  args: {
    workspaceId: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { success: false, result: null, error: "Unauthorized" };

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_and_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .first();
    if (!member) return { success: false, result: null, error: "Unauthorized" };

    const channel = await ctx.db.insert("channels", {
      name: args.name,
      workspaceId: args.workspaceId,
      members: [userId],
      type: "text",
    });
    return { success: true, result: channel, error: "" };
  },
});
