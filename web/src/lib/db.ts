import { redirect } from "next/navigation";
import { getConvexClient } from "@/lib/convex";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { buildGoogleReviewUrl } from "@/lib/utils";

const DEMO_OWNER_ID = process.env.DEMO_OWNER_ID ?? "demo-owner";

export async function listBusinesses() {
  const client = getConvexClient();
  return client.query(api.businesses.list, { ownerId: DEMO_OWNER_ID });
}

export async function createBusiness(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const placeOrUrl = String(formData.get("google_place_or_url") ?? "").trim();
  if (!name || !placeOrUrl) return;

  const client = getConvexClient();
  await client.mutation(api.businesses.create, {
    owner_id: DEMO_OWNER_ID,
    name,
    google_place_id: placeOrUrl.startsWith("http") ? null : placeOrUrl,
    google_review_url: buildGoogleReviewUrl(placeOrUrl),
  });
}

export async function updateBusiness(id: string, formData: FormData) {
  "use server";
  const name = String(formData.get("name") ?? "").trim();
  const placeOrUrl = String(formData.get("google_place_or_url") ?? "").trim();
  if (!name || !placeOrUrl) return;

  const client = getConvexClient();
  await client.mutation(api.businesses.update, {
    id: id as Id<"businesses">,
    name,
    google_place_id: placeOrUrl.startsWith("http") ? null : placeOrUrl,
    google_review_url: buildGoogleReviewUrl(placeOrUrl),
  });
  redirect(`/dashboard/business/${id}`);
}

export async function deleteBusiness(id: string) {
  "use server";
  const client = getConvexClient();
  await client.mutation(api.businesses.remove, { id: id as Id<"businesses"> });
  redirect("/dashboard");
}

export async function getBusiness(id: string) {
  const client = getConvexClient();
  return client.query(api.businesses.getById, { id: id as Id<"businesses"> });
}

export async function listServicesForBusiness(businessId: string) {
  const client = getConvexClient();
  return client.query(api.services.listForBusiness, {
    businessId: businessId as Id<"businesses">,
  });
}

export async function createService(businessId: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const client = getConvexClient();
  await client.mutation(api.services.create, {
    business_id: businessId as Id<"businesses">,
    name,
  });
}

export async function getService(id: string) {
  const client = getConvexClient();
  return client.query(api.services.getById, { id: id as Id<"services"> });
}

export async function updateService(id: string, formData: FormData) {
  "use server";
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const client = getConvexClient();
  await client.mutation(api.services.update, {
    id: id as Id<"services">,
    name,
  });
  redirect(`/dashboard/service/${id}`);
}

export async function deleteService(id: string, businessId: string) {
  "use server";
  const client = getConvexClient();
  await client.mutation(api.services.remove, { id: id as Id<"services"> });
  redirect(`/dashboard/business/${businessId}`);
}

export async function getServiceBySlug(slug: string) {
  const client = getConvexClient();
  return client.query(api.services.getBySlugWithBusiness, { slug });
}

export async function listReviewTexts(serviceId: string) {
  const client = getConvexClient();
  return client.query(api.reviews.listForService, {
    serviceId: serviceId as Id<"services">,
  });
}

export async function createReviewText(serviceId: string, formData: FormData) {
  "use server";
  const text = String(formData.get("text") ?? "").trim();
  if (!text) return;

  const client = getConvexClient();
  await client.mutation(api.reviews.create, {
    service_id: serviceId as Id<"services">,
    text,
  });
  redirect(`/dashboard/service/${serviceId}`);
}

function parseReviewTextsFromFormData(formData: FormData): string[] {
  const textsField = formData.get("texts");
  if (textsField != null) {
    try {
      const parsed = JSON.parse(String(textsField));
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item));
      }
    } catch {
      // fall through to individual fields
    }
  }

  return formData
    .getAll("text")
    .map((value) => String(value));
}

export async function importReviewTexts(serviceId: string, formData: FormData) {
  "use server";
  const texts = parseReviewTextsFromFormData(formData);
  if (texts.length === 0) return;

  const client = getConvexClient();
  await client.mutation(api.reviews.bulkCreate, {
    serviceId: serviceId as Id<"services">,
    texts,
  });
  redirect(`/dashboard/service/${serviceId}`);
}

export async function updateReviewText(id: string, serviceId: string, formData: FormData) {
  "use server";
  const text = String(formData.get("text") ?? "").trim();
  if (!text) return;

  const client = getConvexClient();
  await client.mutation(api.reviews.update, {
    id: id as Id<"review_texts">,
    text,
  });
  redirect(`/dashboard/service/${serviceId}`);
}

export async function deleteReviewText(id: string, serviceId: string) {
  "use server";
  const client = getConvexClient();
  await client.mutation(api.reviews.remove, { id: id as Id<"review_texts"> });
  redirect(`/dashboard/service/${serviceId}`);
}

export async function pickNextReviewText(serviceId: string) {
  const client = getConvexClient();
  return client.mutation(api.reviews.pickNextReviewText, {
    serviceId: serviceId as Id<"services">,
  });
}
