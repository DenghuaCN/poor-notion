import { v } from "convex/values";

import { mutation, query } from "../_generated/server";
import { Doc, Id } from "../_generated/dataModel";

const getSidebar = query({
  args: {
    parentDocument: v.optional(v.id("documents"))
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {  // 未登录
      throw new Error("Not authenticated");
    }

    const userId = identity.subject; // 当前登陆用户 userId

    const documents = await ctx.db
      .query("documents") // 查询documents表
      .withIndex("by_user_parent", (q) => (
        q
          .eq('userId', userId) // documents.
          .eq('parentDocument', args.parentDocument)
      ))
      .filter((q) => (
        q.eq(q.field("isArchived"), false) // 只返回 isArchived 为 false 的数据
      ))
      .order("desc") // 降序
      .collect();

    return documents;
  }
})

export default getSidebar;
