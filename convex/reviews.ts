import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listForService = query({
  args: { serviceId: v.id("services") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("review_texts")
      .withIndex("by_service", (q) => q.eq("service_id", args.serviceId))
      .collect();
  },
});

export const create = mutation({
  args: {
    service_id: v.id("services"),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const text = args.text.trim().slice(0, 300);
    if (!text) return null;

    return await ctx.db.insert("review_texts", {
      service_id: args.service_id,
      text,
      used_count: 0,
      last_used_at: null,
    });
  },
});

export const bulkCreate = mutation({
  args: {
    serviceId: v.id("services"),
    texts: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    let inserted = 0;
    let skipped = 0;

    for (const raw of args.texts) {
      const text = raw.trim().slice(0, 300);
      if (!text) {
        skipped++;
        continue;
      }

      await ctx.db.insert("review_texts", {
        service_id: args.serviceId,
        text,
        used_count: 0,
        last_used_at: null,
      });
      inserted++;
    }

    return { inserted, skipped };
  },
});

export const update = mutation({
  args: {
    id: v.id("review_texts"),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const text = args.text.trim().slice(0, 300);
    if (!text) return;
    await ctx.db.patch(args.id, { text });
  },
});

export const remove = mutation({
  args: { id: v.id("review_texts") },
  handler: async (ctx, args) => {
    const review = await ctx.db.get(args.id);
    if (!review) return;

    const scanLogs = await ctx.db
      .query("scan_logs")
      .withIndex("by_service", (q) => q.eq("service_id", review.service_id))
      .collect();

    for (const log of scanLogs) {
      if (log.review_text_id === args.id) {
        await ctx.db.delete(log._id);
      }
    }

    await ctx.db.delete(args.id);
  },
});

export const pickNextReviewText = mutation({
  args: { serviceId: v.id("services") },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("review_texts")
      .withIndex("by_service", (q) => q.eq("service_id", args.serviceId))
      .collect();

    if (rows.length === 0) return null;

    rows.sort((a, b) => {
      const aTs = a.last_used_at ?? 0;
      const bTs = b.last_used_at ?? 0;
      return aTs - bTs;
    });

    const next = rows[0];
    const now = Date.now();

    await ctx.db.patch(next._id, {
      used_count: next.used_count + 1,
      last_used_at: now,
    });

    await ctx.db.insert("scan_logs", {
      service_id: args.serviceId,
      review_text_id: next._id,
      scanned_at: now,
    });

    return next;
  },
});
