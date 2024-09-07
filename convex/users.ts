import { getAuthSessionId, getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (userId == null)
      return { success: false, result: null, error: "User not logged in" };
    const user = await ctx.db.get(userId);
    return { success: true, result: user, error: null };
  },
});
export const getSession = query({
  args: {},
  handler: async (ctx) => {
    const sessionId = await getAuthSessionId(ctx);

    if (sessionId === null) {
      return { success: false, result: null, error: "Session not found" };
    }
    const session = await ctx.db.get(sessionId);
    return { success: true, result: session, error: null };
  },
});
