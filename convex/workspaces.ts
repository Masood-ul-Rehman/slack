import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    const joinCode = "1234";
    const workspaceId = await ctx.db.insert("workspaces", {
      name: args.name,
      userId: userId,
      joinCode: joinCode,
    });
    const workspace = await ctx.db.get(workspaceId);
    return workspace;
  },
});

export const get = query({
  args: {},
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return "User not logged in";
    const workspaces = await ctx.db
      .query("workspaces")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    return workspaces;
  },
});
