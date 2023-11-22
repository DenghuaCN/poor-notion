import { v } from "convex/values";

import { mutation } from "../_generated/server";

const update = mutation({
  args: {
    id: v.id("documents"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      // not login
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const { id, ...rest } = args; // 通过id查找需要更新的数据，但不需要更新id这个字段

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Not Found");
    }
    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const document = await ctx.db.patch(args.id, {
      ...rest,
    });

    return document;
  }
})


export default update;