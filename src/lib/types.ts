import type { Id } from "../../convex/_generated/dataModel";

export type Business = {
  _id: Id<"businesses">;
  owner_id: string;
  name: string;
  google_place_id: string | null;
  google_review_url: string;
  created_at: number;
};

export type Service = {
  _id: Id<"services">;
  business_id: Id<"businesses">;
  name: string;
  qr_slug: string;
  created_at: number;
};

export type ReviewText = {
  _id: Id<"review_texts">;
  service_id: Id<"services">;
  text: string;
  used_count: number;
  last_used_at: number | null;
};

export type ScanLog = {
  _id: Id<"scan_logs">;
  service_id: Id<"services">;
  review_text_id: Id<"review_texts">;
  scanned_at: number;
};
