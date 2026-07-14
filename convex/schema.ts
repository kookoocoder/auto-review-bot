import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  businesses: defineTable({
    owner_id: v.string(),
    name: v.string(),
    google_place_id: v.union(v.string(), v.null()),
    google_review_url: v.string(),
    created_at: v.number(),
  }).index("by_owner", ["owner_id"]),

  services: defineTable({
    business_id: v.id("businesses"),
    name: v.string(),
    qr_slug: v.string(),
    created_at: v.number(),
  })
    .index("by_business", ["business_id"])
    .index("by_qr_slug", ["qr_slug"]),

  review_texts: defineTable({
    service_id: v.id("services"),
    text: v.string(),
    used_count: v.number(),
    last_used_at: v.union(v.number(), v.null()),
  }).index("by_service", ["service_id"]),

  scan_logs: defineTable({
    service_id: v.id("services"),
    review_text_id: v.id("review_texts"),
    scanned_at: v.number(),
  }).index("by_service", ["service_id"]),
});
