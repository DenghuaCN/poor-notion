import { v } from "convex/values";

import { mutation, query } from "../_generated/server";
import { Doc, Id } from "../_generated/dataModel";

const getSearch = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {  // 未登录
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) =>
        q.eq(q.field("isArchived"), false),
      )
      .order("desc")
      .collect()

    return documents;
  }
})

export default getSearch;