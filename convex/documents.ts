import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

/**
 * @desc 获取删除的所有Page
 */
export const getTrash = query({
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

/**
 * @desc 从垃圾桶恢复被删除的Page
 */
export const restore = mutation({
  args: { id: v.id("documents")},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);
    if (!existingDocument) {
      throw new Error("Not found");
    }
    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized"); // 无权修改
    }

    const recursiveRestore = async (documentId: Id<"documents">) => {
      const children = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) => (
          q
            .eq("userId", userId)
            .eq("parentDocument", documentId)
        ))
        .collect();

      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchived: false,
        });

        await recursiveRestore(child._id);
      }
    }

    const options: Partial<Doc<"documents">> = {
      isArchived: false,
    };

    if (existingDocument.parentDocument) {
      const parent = await ctx.db.get(existingDocument.parentDocument);
      if (parent?.isArchived) {
        options.parentDocument = undefined;
      }
    }

    const document = await ctx.db.patch(args.id, options);

    recursiveRestore(args.id);

    return document;
  }
})

/**
 * @desc 永久删除Page
 */
export const remove = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Not found");
    }
    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const document = await ctx.db.delete(args.id);

    return document;
  }
});


export const archive = mutation({
  args: {
    id: v.id("documents")
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;
    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Not found");
    }

    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized"); // 无权修改
    }

    // 递归处理子Page
    const recursiveArchive = async (documentId: Id<"documents">) => {
      const children = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) => (
          q
            .eq("userId", userId)
            .eq("parentDocument", documentId)
        ))
        .collect();

      for (const child of children) {
        await ctx.db.patch(child._id, { isArchived: true })
        // 递归
        await recursiveArchive(child._id);
      }
    }

    const document = await ctx.db.patch(args.id, {
      isArchived: true,
    })

    recursiveArchive(args.id);

    return document;
  }
})

export const getSidebar = query({
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