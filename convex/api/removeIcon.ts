import { v } from "convex/values";

import { mutation } from "../_generated/server";
import { Doc, Id } from "../_generated/dataModel";

const removeIcon = mutation({
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
      throw new Error("Not Found");
    }
    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const document = await ctx.db.patch(args.id, {
      icon: undefined
    })

    return document;
  }
})

export default removeIcon;