import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

import { mutation, query } from "./_generated/server";

export const createNotification = mutation({
  args: {
    workspaceId: v.string(),
    notificationTo: v.id("members"),
    notificationFrom: v.id("members"),
    channelId: v.optional(v.string()),
    conversationId: v.optional(v.id("conversations")),
    parentMessageId: v.optional(v.id("messages")),
    messageId: v.optional(v.id("messages")),
    type: v.union(
      v.literal("message_reaction"),
      v.literal("new_message"),
      v.literal("invited_to_workspace")
    ),
    data: v.string(),
    createdAt: v.number(),
  },
  handler: async ({ db, auth }, args) => {
    const identity = await auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    await db.insert("notifications", {
      workspaceId: args.workspaceId,
      notificationTo: args.notificationTo,
      notificationFrom: args.notificationFrom,
      channelId: args.channelId,
      conversationId: args.conversationId,
      messageId: args.messageId,
      read: false,
      type: args.type,
      data: args.data,
      createdAt: args.createdAt,
    });
  },
});
export const getNotifications = query({
  args: {
    workspaceId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    const member = await ctx.db
      .query("members")
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();
    if (!member) {
      throw new Error("Member not found");
    }
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_workspace_id_notification_to", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("notificationTo", member._id)
      )
      .collect();

    return notifications;
  },
});

export const readNotification = mutation({
  args: {
    notificationId: v.id("notifications"),
  },
  handler: async ({ db }, args) => {
    const notification = await db.get(args.notificationId);
    if (!notification) throw new Error("Notification not found");
    const updatedNotification = await db.patch(args.notificationId, {
      read: true,
    });
    return updatedNotification;
  },
});
