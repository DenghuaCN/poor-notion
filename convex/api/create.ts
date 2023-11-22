import { v } from "convex/values";

import { mutation, query } from "../_generated/server";
import { Doc, Id } from "../_generated/dataModel";

const create = mutation({
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

export default create;