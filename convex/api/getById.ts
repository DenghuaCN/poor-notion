import { v } from "convex/values";

import { query } from "../_generated/server";

const getById = query({
  args: { documentId: v.id("documents")},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    // 匿名访问情况，不需要第一时间校验是否登录
    const document = await ctx.db.get(args.documentId);

    if (!document) {
      throw new Error("Not Found");
    }
    if (document.isPublished && !document.isArchived) { // 只有已发布 且 未被删除的Page可供匿名阅读
      return document;
    }

    // 不是匿名访问情况（所有操作均需要登录才允许操作）
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    if (document.userId !== userId) {
      throw new Error("Unauthorized");
    }

    return document;
  }
})

export default getById;
