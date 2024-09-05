import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
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
    });
    await ctx.db.insert("members", {
      workspaceId: Id,
      userId: userId,
      role: "owner",
    });
    await ctx.db.insert("channels", {
      workspaceId: Id,
      name: "general",
      type: "text",
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
export const update = mutation({
  args: {
    id: v.string(),
    name: v.optional(v.string()),
    joinCode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { success: false, result: null, error: "Unauthorized" };
    if (args.name == null && args.joinCode == null)
      return { success: false, result: null, error: "No changes" };
    const workspace = await ctx.db
      .query("workspaces")
      .filter((q) => q.eq(q.field("userId"), userId))
      .filter((q) => q.eq(q.field("workspaceId"), args.id))
      .first();
    if (workspace == null)
      return { success: false, result: null, error: "Workspace not found" };
    const updatedWorkspace = await ctx.db.patch(workspace._id, {
      name: args.name ?? workspace.name,
      joinCode: args.joinCode ?? workspace.joinCode,
    });
    return { success: true, result: updatedWorkspace, error: "" };
  },
});
export const deleteWorkspace = mutation({
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
      .unique();
    if (workspace == null)
      return { success: false, result: null, error: "Workspace not found" };
    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_and_user_id", (q) =>
        q.eq("workspaceId", args.id).eq("userId", userId)
      )
      .unique();
    if (!member || member.role != "owner")
      return { success: false, result: null, error: "You are not the owner" };
    await ctx.db.delete(workspace._id);
    return { success: true, result: null, error: "" };
  },
});
