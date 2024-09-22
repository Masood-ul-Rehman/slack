import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";
import { paginationOptsValidator } from "convex/server";
import { Doc } from "./_generated/dataModel";

const populateMember = async (ctx: QueryCtx, memberId: Id<"members">) => {
  return await ctx.db.get(memberId);
};
const populateUser = async (ctx: QueryCtx, userId: Id<"users">) => {
  return await ctx.db.get(userId);
};
const populateReactions = async (ctx: QueryCtx, messageId: Id<"messages">) => {
  return await ctx.db
    .query("reactions")
    .withIndex("by_message_id", (q) => q.eq("messageId", messageId))
    .collect();
};
const populateThread = async (ctx: QueryCtx, messageId: Id<"messages">) => {
  const parentMessages = await ctx.db
    .query("messages")
    .withIndex("by_parent_message_id", (q) =>
      q.eq("parentMessageId", messageId)
    )
    .collect();
  if (parentMessages.length === 0) {
    return { count: 0, image: undefined, timeStamp: 0 };
  }
  const lastMessage = parentMessages[parentMessages.length - 1];
  if (!lastMessage) {
    return { count: 0, image: undefined, timeStamp: 0 };
  }
  const lastMessageUser = await populateUser(ctx, lastMessage.userId);
  return {
    count: parentMessages.length,
    image: lastMessageUser?.image,
    timeStamp: lastMessage._creationTime,
  };
};
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
    parentMessageId: v.optional(v.id("messages")),
    conversationId: v.optional(v.id("conversations")),
  },
  handler: async (ctx, args) => {
    const { workspaceId, channelId, body, image } = args;
    const userId = await getAuthUserId(ctx);
    if (!userId) return { success: false, result: null, error: "Unauthorized" };
    const member = await getMember(ctx, { workspaceId, userId });
    if (!member) return { success: false, result: null, error: "Unauthorized" };

    let _conversationId = args.conversationId;

    if (!args.conversationId && !args.channelId && args.parentMessageId) {
      const parentMessage = await ctx.db.get(args.parentMessageId!);
      if (!parentMessage) {
        return {
          success: false,
          result: null,
          error: "Parent message id is required",
        };
      }
      _conversationId = parentMessage.conversationId;
    }
    const messageId = await ctx.db.insert("messages", {
      workspaceId,
      channelId,
      conversationId: _conversationId,
      memberId: member._id,
      body,
      image,
      userId,
      updatedAt: Date.now(),
    });
    return { success: true, result: messageId, error: null };
  },
});
export const get = query({
  args: {
    channelId: v.optional(v.string()),
    parentMessageId: v.optional(v.id("messages")),
    conversationId: v.optional(v.id("conversations")),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const { channelId, paginationOpts, parentMessageId } = args;
    let _conversationId = args.conversationId;

    if (!args.conversationId && !args.channelId && args.parentMessageId) {
      const parentMessage = await ctx.db.get(args.parentMessageId);
      if (!parentMessage) {
        throw new Error("Parent message not found");
      }
      _conversationId = parentMessage.conversationId;
    }

    const result = await ctx.db
      .query("messages")
      .withIndex("by_channel_id_parent_message_id_conversation_id", (q) =>
        q
          .eq("channelId", channelId)
          .eq("parentMessageId", parentMessageId)
          .eq("conversationId", _conversationId)
      )
      .order("desc")
      .paginate(paginationOpts);
    return {
      ...result,
      page: await Promise.all(
        result.page
          .map(async (message) => {
            const member = await populateMember(ctx, message.memberId);
            const user = await populateUser(ctx, message.userId);
            if (!member || !user) return null;
            const reactions = await populateReactions(ctx, message._id);
            const thread = await populateThread(ctx, message._id);
            const image = message.image
              ? await ctx.storage.getUrl(message.image)
              : undefined;
            const reactionWithCount = reactions.map((reaction) => {
              return {
                ...reaction,
                count: reactions.filter((r) => r.reaction === reaction.reaction)
                  .length,
              };
            });
            const groupedReactions = reactionWithCount.reduce(
              (acc, reaction) => {
                const existingReaction = acc.find(
                  (r) => r.reaction === reaction.reaction
                );
                if (existingReaction) {
                  existingReaction.memberIds.push(reaction.memberId);
                } else {
                  acc.push({ ...reaction, memberIds: [reaction.memberId] });
                }
                return acc;
              },
              [] as (Doc<"reactions"> & {
                count: number;
                memberIds: Id<"members">[];
              })[]
            );
            const reactionWithOutMemberIds = groupedReactions.map(
              ({ memberIds, ...rest }) => rest
            );
            return {
              ...message,
              image,
              member,
              user,
              reactions: reactionWithOutMemberIds,
              threadCount: thread.count,
              threadImage: thread.image,
              threadTimeStamp: thread.timeStamp,
            };
          })
          .filter(
            (message): message is NonNullable<typeof message> =>
              message !== null
          )
      ),
    };
  },
});

export const updateMessage = mutation({
  args: {
    messageId: v.id("messages"),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const { messageId, body } = args;
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    const message = await ctx.db.get(messageId);
    if (!message) throw new Error("Message not found");
    const member = await getMember(ctx, {
      workspaceId: message.workspaceId,
      userId,
    });
    if (!member || message.memberId !== member._id)
      throw new Error("Unauthorized");
    try {
      const updatedMessage = await ctx.db.patch(messageId, {
        body,
        updatedAt: Date.now(),
      });
      return { success: true, result: updatedMessage, error: null };
    } catch (error) {
      return { success: false, result: null, error: "Error updating message" };
    }
  },
});
export const deleteMessage = mutation({
  args: {
    messageId: v.id("messages"),
  },
  handler: async (ctx, args) => {
    const { messageId } = args;
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    const message = await ctx.db.get(messageId);
    if (!message) throw new Error("Message not found");
    const member = await getMember(ctx, {
      workspaceId: message.workspaceId,
      userId,
    });
    if (!member || message.memberId !== member._id)
      throw new Error("Unauthorized");
    await ctx.db.delete(messageId);
    return { success: true, result: message, error: null };
  },
});
