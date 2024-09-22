import { mutation, query, QueryCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
const populateMember = async (ctx: QueryCtx, memberId: Id<"members">) => {
  return await ctx.db.get(memberId);
};

export const addReaction = mutation({
  args: {
    messageId: v.id("messages"),
    memberId: v.id("members"),
    reaction: v.string(),
  },

  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const member = await populateMember(ctx, args.memberId);
    if (!member) {
      throw new Error("Member not found");
    }

    const message = await ctx.db.get(args.messageId);
    if (!message) {
      throw new Error("Message not found");
    }

    const existingReaction = await ctx.db
      .query("reactions")
      .filter((q) =>
        q.and(
          q.eq(q.field("messageId"), args.messageId),
          q.eq(q.field("memberId"), args.memberId),
          q.eq(q.field("reaction"), args.reaction)
        )
      )
      .first();
    if (existingReaction) {
      await ctx.db.delete(existingReaction._id);
      return { success: true, result: existingReaction, error: "" };
    }

    const reaction = await ctx.db.insert("reactions", {
      messageId: args.messageId,
      memberId: args.memberId,
      reaction: args.reaction,
      workspaceId: member.workspaceId,
    });
    return { success: true, result: reaction, error: "" };
  },
});
