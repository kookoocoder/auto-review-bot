import { nanoid } from "nanoid";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listForBusiness = query({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("services")
      .withIndex("by_business", (q) => q.eq("business_id", args.businessId))
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: {
    business_id: v.id("businesses"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("services", {
      ...args,
      qr_slug: nanoid(10),
      created_at: Date.now(),
    });
  },
});

export const getById = query({
  args: { id: v.id("services") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const update = mutation({
  args: {
    id: v.id("services"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { name: args.name });
  },
});

export const remove = mutation({
  args: { id: v.id("services") },
  handler: async (ctx, args) => {
    const reviewTexts = await ctx.db
      .query("review_texts")
      .withIndex("by_service", (q) => q.eq("service_id", args.id))
      .collect();
    for (const review of reviewTexts) {
      await ctx.db.delete(review._id);
    }

    const scanLogs = await ctx.db
      .query("scan_logs")
      .withIndex("by_service", (q) => q.eq("service_id", args.id))
      .collect();
    for (const log of scanLogs) {
      await ctx.db.delete(log._id);
    }

    await ctx.db.delete(args.id);
  },
});

export const getBySlugWithBusiness = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const service = await ctx.db
      .query("services")
      .withIndex("by_qr_slug", (q) => q.eq("qr_slug", args.slug))
      .unique();

    if (!service) return null;
    const business = await ctx.db.get(service.business_id);
    if (!business) return null;

    return { ...service, businesses: business };
  },
});
