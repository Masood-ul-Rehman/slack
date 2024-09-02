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
    const Id = generateWorkspaceId();
    const workspaceId = await ctx.db.insert("workspaces", {
      workspaceId: Id,
      name: args.name,
      userId: userId,
      joinCode: generateJoinCode(),
      members: [userId],
    });
    await ctx.db.insert("members", {
      workspaceId: Id,
      userId: userId,
      role: "owner",
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
    const members = await ctx.db
      .query("members")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect();
    const workspacesIds = members.map((m) => m.workspaceId);
    const workspaces = [];
    for (const workspaceId of workspacesIds) {
      const workspace = await ctx.db
        .query("workspaces")
        .filter((q) => q.eq(q.field("workspaceId"), workspaceId))
        .first();
      if (workspace) workspaces.push(workspace);
    }
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
    if (workspace == null)
      return { success: false, result: null, error: "Workspace not found" };
    return { success: true, result: workspace, error: "" };
  },
});
