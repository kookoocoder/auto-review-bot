import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("assignments").collect();
  },
});

export const listForUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("assignments")
      .withIndex("by_user", (q) => q.eq("user_id", args.userId))
      .collect();
  },
});

export const create = mutation({
  args: {
    user_id: v.id("users"),
    target_id: v.union(v.id("businesses"), v.id("services")),
    type: v.union(v.literal("business"), v.literal("service")),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("assignments")
      .withIndex("by_user_and_target", (q) =>
        q.eq("user_id", args.user_id).eq("target_id", args.target_id)
      )
      .first();

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert("assignments", {
      user_id: args.user_id,
      target_id: args.target_id,
      type: args.type,
      created_at: Date.now(),
    });
  },
});

export const remove = mutation({
  args: {
    user_id: v.id("users"),
    target_id: v.union(v.id("businesses"), v.id("services")),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("assignments")
      .withIndex("by_user_and_target", (q) =>
        q.eq("user_id", args.user_id).eq("target_id", args.target_id)
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});
