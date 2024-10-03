import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import {
  generateJoinCode,
  generateWorkspaceId,
  generateChannelId,
} from "../src/lib/utils";

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
    const member = await ctx.db.insert("members", {
      workspaceId: Id,
      userId: userId,
      role: "owner",
    });
    await ctx.db.insert("channels", {
      workspaceId: Id,
      name: "general",
      type: "text",
      members: [member],
      status: "public",
      channelOwner: userId,
      channelId: generateChannelId(),
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
      .filter((q) => q.eq(q.field("workspaceId"), args.id))
      .first();
    if (workspace == null)
      return { success: false, result: null, error: "Workspace not found" };
    const workspaceMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_and_user_id", (q) =>
        q.eq("workspaceId", workspace?.workspaceId).eq("userId", userId)
      )
      .first();
    if (!workspaceMember)
      return {
        success: false,
        result: workspace,
        error: "You are not the member of this workspace",
      };
    return { success: true, result: workspace, error: "" };
  },
});
export const getBasicInfo = query({
  args: {
    id: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.id)
      return { success: false, result: null, error: "No id provided" };
    const workspace = await ctx.db
      .query("workspaces")
      .filter((q) => q.eq(q.field("workspaceId"), args.id))
      .first();
    if (workspace == null)
      return { success: false, result: null, error: "Workspace not found" };

    const members = await ctx.db
      .query("members")
      .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.id!))
      .collect();
    const basicInfo = {
      workspaceId: workspace.workspaceId,
      name: workspace.name,
      members,
    };
    return { success: true, result: basicInfo, error: "" };
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
export const join = mutation({
  args: {
    workspaceId: v.string(),
    joinCode: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { success: false, result: null, error: "Unauthorized" };
    const workspace = await ctx.db
      .query("workspaces")
      .filter((q) => q.eq(q.field("workspaceId"), args.workspaceId))
      .first();
    if (workspace == null)
      return {
        success: false,
        result: null,
        error: "Workspace not found ",
      };
    if (workspace.joinCode !== args.joinCode)
      return {
        success: false,
        result: null,
        error: "Invalid join code",
      };

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_and_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();
    if (member) {
      return {
        success: false,
        result: null,
        error: "You are already a member of this workspace",
      };
    }

    const newMember = await ctx.db.insert("members", {
      workspaceId: args.workspaceId,
      userId: userId,
      role: "member",
    });
    const channels = await ctx.db
      .query("channels")
      .withIndex("by_workspace_id_status", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("status", "public")
      )
      .collect();
    for (const channel of channels) {
      await ctx.db.patch(channel._id, {
        members: [...channel.members, newMember],
      });
    }
    return { success: true, result: null, error: "" };
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
    if (!member || member.role !== "owner")
      return { success: false, result: null, error: "You are not the owner" };
    else if (member.role == "owner") await ctx.db.delete(workspace._id);
    return { success: true, result: null, error: "" };
  },
});
