import { defineSchema, defineTable  } from "convex/server";
import { v } from "convex/values";

/**
 * @desc 定义documents Table
 */
export default defineSchema({
  documents: defineTable({
    title: v.string(),
    userId: v.string(),
    isArchived: v.boolean(),
    parentDocument: v.optional(v.id("documents")),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.boolean(),
  })
  .index("by_user", ["userId"]) // 对userId字段 创建 索引
  .index("by_user_parent", ["userId", "parentDocument"])
})