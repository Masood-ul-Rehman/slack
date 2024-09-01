import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";
import { getAuthUserId } from "@convex-dev/auth/server";
import { generateJoinCode, generateWorkspaceId } from "../src/lib/utils";

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { success: false, result: null, error: "Unauthorized" };
    const workspaceId = await ctx.db.insert("workspaces", {
      workspaceId: generateWorkspaceId(),
      name: args.name,
      userId: userId,
      joinCode: generateJoinCode(),
      members: [userId],
    });
    const workspace = await ctx.db.get(workspaceId);
    return { success: true, result: workspace, error: "" };
  },
});

export const get = query({
  args: {},
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { success: false, result: [], error: "Unauthorized" };
    const workspaces = await ctx.db
      .query("workspaces")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    return { success: true, result: workspaces, error: "" };
  },
});
export const getById = query({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { success: false, result: null, error: "Unauthorized" };
    const workspace = await ctx.db
      .query("workspaces")
      .filter((q) => q.eq(q.field("userId"), userId))
      .filter((q) => q.eq(q.field("workspaceId"), args.id))
      .first();

    return { success: true, result: workspace, error: "" };
  },
});
