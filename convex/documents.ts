import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const getSidebar = query({
  args: {
    parentDocument: v.optional(v.id("documents"))
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user_parent", (q) => (q.eq('userId', userId).eq('parentDocument', args.parentDocument))) // 通过by_user_parent索引读取文档进行查询
      .filter((q) => (
        q.eq(q.field("isArchived"), false) // 过滤输出
      ))
      .order("desc") // 降序
      .collect();

    return documents;
  }
})

export const create = mutation({
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id("documents"))
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      // not login
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    // create a documents
    const document = await ctx.db.insert('documents', {
      title: args.title,
      parentDocument: args.parentDocument,
      userId,
      isArchived: false,
      isPublished: false,
    })

    return document;
  }
})