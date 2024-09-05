import { getAuthUserId } from "@convex-dev/auth/server";
import { query, QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
const populateUser = (ctx: QueryCtx, id: Id<"users">) => {
  return ctx.db.get(id);
};
export const getById = query({
  args: { workspaceId: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { success: false, result: [], error: "Unauthorized" };
    const members = await ctx.db
      .query("members")
      .withIndex("by_workspace_id", (q) =>
        q.eq("workspaceId", args.workspaceId)
      )
      .collect();
    const populatedMembers = [];
    for (const member of members) {
      const user = await populateUser(ctx, member.userId);
      if (user) {
        populatedMembers.push({ ...member, user });
      }
    }
    return { success: true, result: populatedMembers, error: "" };
  },
});
