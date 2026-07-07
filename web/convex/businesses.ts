import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { ownerId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("businesses")
      .withIndex("by_owner", (q) => q.eq("owner_id", args.ownerId))
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: {
    owner_id: v.string(),
    name: v.string(),
    google_place_id: v.union(v.string(), v.null()),
    google_review_url: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("businesses", {
      ...args,
      created_at: Date.now(),
    });
  },
});

export const getById = query({
  args: { id: v.id("businesses") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const update = mutation({
  args: {
    id: v.id("businesses"),
    name: v.string(),
    google_place_id: v.union(v.string(), v.null()),
    google_review_url: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { id: v.id("businesses") },
  handler: async (ctx, args) => {
    const services = await ctx.db
      .query("services")
      .withIndex("by_business", (q) => q.eq("business_id", args.id))
      .collect();

    for (const service of services) {
      const reviewTexts = await ctx.db
        .query("review_texts")
        .withIndex("by_service", (q) => q.eq("service_id", service._id))
        .collect();
      for (const review of reviewTexts) {
        await ctx.db.delete(review._id);
      }

      const scanLogs = await ctx.db
        .query("scan_logs")
        .withIndex("by_service", (q) => q.eq("service_id", service._id))
        .collect();
      for (const log of scanLogs) {
        await ctx.db.delete(log._id);
      }

      await ctx.db.delete(service._id);
    }

    await ctx.db.delete(args.id);
  },
});
