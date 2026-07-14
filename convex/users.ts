import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").order("desc").collect();
  },
});

export const create = mutation({
  args: {
    username: v.string(),
    password_hash: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if username is already taken
    const existing = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("username"), args.username))
      .first();

    if (existing) {
      throw new Error("Username already exists");
    }

    return await ctx.db.insert("users", {
      username: args.username,
      password_hash: args.password_hash,
      created_at: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    // Delete all assignments for this user
    const assignments = await ctx.db
      .query("assignments")
      .withIndex("by_user", (q) => q.eq("user_id", args.id))
      .collect();

    for (const assignment of assignments) {
      await ctx.db.delete(assignment._id);
    }

    await ctx.db.delete(args.id);
  },
});

export const getByUsername = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("username"), args.username))
      .first();
  },
});
