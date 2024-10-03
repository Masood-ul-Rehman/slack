import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { generateChannelId } from "../src/lib/utils";

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
    if (!member)
      return {
        success: false,
        result: null,
        error: "You are not the member of this workspace",
      };
    const channels = await ctx.db
      .query("channels")
      .withIndex("by_workspace_id_status", (q) =>
        q.eq("workspaceId", args.workspaceId)
      )
      .collect();
    if (!channels)
      return { success: false, result: null, error: "No channels found" };

    const isMember = channels.some((channel) =>
      channel.members.includes(member._id)
    );
    if (!isMember)
      return {
        success: false,
        result: null,
        error: "You are not the member of any channel",
      };
    return { success: true, result: channels, error: "" };
  },
});

export const createChannel = mutation({
  args: {
    workspaceId: v.string(),
    name: v.string(),
    status: v.union(v.literal("public"), v.literal("private")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { success: false, result: null, error: "Unauthorized" };

    const members = await ctx.db
      .query("members")
      .withIndex("by_workspace_id", (q) =>
        q.eq("workspaceId", args.workspaceId)
      )
      .collect();
    const member = members.find((member) => member.userId === userId);
    const workspaceOwner = members.find((member) => member.role === "owner");
    if (!member)
      return {
        success: false,
        result: null,
        error: "You are not the member of this workspace",
      };
    const channelId = generateChannelId();
    await ctx.db.insert("channels", {
      name: args.name,
      workspaceId: args.workspaceId,
      members:
        args.status == "private"
          ? [member._id]
          : members.map((member) => member._id),
      type: "text",
      status: args.status,
      channelOwner: workspaceOwner?.userId || member.userId,
      channelId: channelId,
    });
    return { success: true, result: channelId, error: "" };
  },
});

export const getById = query({
  args: {
    channelId: v.optional(v.string()),
    workspaceId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { success: false, result: null, error: "Unauthorized" };
    if (!args.channelId || !args.workspaceId)
      return {
        success: false,
        result: null,
        error: "No channel id provided",
      };
    const channelDetails = await ctx.db
      .query("channels")
      .withIndex("by_workspace_id_channel_id", (q) =>
        q.eq("workspaceId", args.workspaceId!).eq("channelId", args.channelId!)
      )
      .first();
    if (!channelDetails)
      return {
        success: false,
        result: null,
        error: "No channel found with this id",
      };
    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_and_user_id", (q) =>
        q.eq("workspaceId", channelDetails.workspaceId).eq("userId", userId)
      )
      .first();
    if (!member)
      return {
        success: false,
        result: null,
        error: "You are not the member of this workspace",
      };
    const isOwner = channelDetails.channelOwner === userId;
    return { success: true, result: { ...channelDetails, isOwner }, error: "" };
  },
});
export const deleteChannel = mutation({
  args: {
    channelId: v.string(),
    workspaceId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { success: false, result: null, error: "Unauthorized" };
    const channel = await ctx.db
      .query("channels")
      .withIndex("by_workspace_id_channel_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("channelId", args.channelId)
      )
      .first();
    if (!channel)
      return {
        success: false,
        result: null,
        error: "No channel found with this id",
      };
    const isAdmin = channel.channelOwner === userId;
    if (!isAdmin)
      return {
        success: false,
        result: null,
        error: "You are not the owner of this channel",
      };
    await ctx.db.delete(channel._id);
    return { success: true, result: null, error: "" };
  },
});
export const updateChannel = mutation({
  args: {
    channelId: v.string(),
    workspaceId: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { success: false, result: null, error: "Unauthorized" };
    const channel = await ctx.db
      .query("channels")
      .withIndex("by_workspace_id_channel_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("channelId", args.channelId)
      )
      .first();
    if (!channel)
      return {
        success: false,
        result: null,
        error: "No channel found with this id",
      };
    const isAdmin = channel.channelOwner === userId;
    if (!isAdmin)
      return {
        success: false,
        result: null,
        error: "You are not the owner of this channel",
      };
    await ctx.db.patch(channel._id, {
      name: args.name,
    });
    return { success: true, result: null, error: "" };
  },
});
