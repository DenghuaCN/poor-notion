import { v } from "convex/values";

import { mutation, query } from "../_generated/server";
import { Doc, Id } from "../_generated/dataModel";


/**
 * @desc 获取删除的所有Page
 */
const getTrash = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) =>
        q.eq(q.field("isArchived"), true), // 过滤isArchived为false的内容
      )
      .order("desc")
      .collect();

    return documents;
  }
})

export default getTrash;