import { redirect } from "next/navigation";
import { getConvexClient } from "@/lib/convex";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { buildGoogleReviewUrl } from "@/lib/utils";
import { getSession } from "@/lib/session";

const DEMO_OWNER_ID = process.env.DEMO_OWNER_ID ?? "demo-owner";

async function requireSession() {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized: No active session");
  }
  return session;
}

export async function listBusinesses() {
  const session = await requireSession();
  const client = getConvexClient();

  if (session.role === "admin") {
    return client.query(api.businesses.list, { ownerId: DEMO_OWNER_ID });
  }

  // Staff/User session: Return only businesses where assigned,
  // or businesses where assigned to at least one service.
  const allBusinesses = await client.query(api.businesses.list, { ownerId: DEMO_OWNER_ID });
  const assignments = await client.query(api.assignments.listForUser, { userId: session.userId as any });

  const assignedBusinessIds = new Set(
    assignments
      .filter((a) => a.type === "business")
      .map((a) => a.target_id)
  );

  const assignedServiceIds = new Set(
    assignments
      .filter((a) => a.type === "service")
      .map((a) => a.target_id)
  );

  const filteredBusinesses = [];
  for (const business of allBusinesses) {
    if (assignedBusinessIds.has(business._id)) {
      filteredBusinesses.push(business);
      continue;
    }

    const services = await client.query(api.services.listForBusiness, { businessId: business._id });
    const hasAssignedService = services.some((service) => assignedServiceIds.has(service._id));
    if (hasAssignedService) {
      filteredBusinesses.push(business);
    }
  }

  return filteredBusinesses;
}

export async function createBusiness(formData: FormData) {
  "use server";
  const session = await requireSession();
  if (session.role !== "admin") {
    throw new Error("Forbidden: Admin access required.");
  }

  const name = String(formData.get("name") ?? "").trim();
  const placeOrUrl = String(formData.get("google_place_or_url") ?? "").trim();
  if (!name || !placeOrUrl) {
    throw new Error("Business name and Google Place ID or review URL are required.");
  }

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
  const session = await requireSession();
  if (session.role !== "admin") {
    throw new Error("Forbidden: Admin access required.");
  }

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
  const session = await requireSession();
  if (session.role !== "admin") {
    throw new Error("Forbidden: Admin access required.");
  }

  const client = getConvexClient();
  await client.mutation(api.businesses.remove, { id: id as Id<"businesses"> });
  redirect("/dashboard");
}

export async function getBusiness(id: string) {
  const session = await requireSession();
  const client = getConvexClient();

  const business = await client.query(api.businesses.getById, { id: id as Id<"businesses"> });
  if (!business) return null;

  if (session.role === "admin") {
    return business;
  }

  // Staff check
  const assignments = await client.query(api.assignments.listForUser, { userId: session.userId as any });
  const isAssignedToBusiness = assignments.some(
    (a) => a.type === "business" && a.target_id === id
  );

  if (isAssignedToBusiness) {
    return business;
  }

  const services = await client.query(api.services.listForBusiness, { businessId: id as Id<"businesses"> });
  const assignedServiceIds = new Set(
    assignments
      .filter((a) => a.type === "service")
      .map((a) => a.target_id)
  );

  const hasAssignedService = services.some((service) => assignedServiceIds.has(service._id));
  if (hasAssignedService) {
    return business;
  }

  throw new Error("Forbidden: Access to this business is restricted.");
}

export async function listServicesForBusiness(businessId: string) {
  const session = await requireSession();
  const client = getConvexClient();

  const allServices = await client.query(api.services.listForBusiness, {
    businessId: businessId as Id<"businesses">,
  });

  if (session.role === "admin") {
    return allServices;
  }

  const assignments = await client.query(api.assignments.listForUser, { userId: session.userId as any });
  const isAssignedToBusiness = assignments.some(
    (a) => a.type === "business" && a.target_id === businessId
  );

  if (isAssignedToBusiness) {
    return allServices;
  }

  const assignedServiceIds = new Set(
    assignments
      .filter((a) => a.type === "service")
      .map((a) => a.target_id)
  );

  return allServices.filter((service) => assignedServiceIds.has(service._id));
}

export async function createService(businessId: string, formData: FormData) {
  const session = await requireSession();
  if (session.role !== "admin") {
    throw new Error("Forbidden: Admin access required.");
  }

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const client = getConvexClient();
  await client.mutation(api.services.create, {
    business_id: businessId as Id<"businesses">,
    name,
  });
}

export async function getService(id: string) {
  const session = await requireSession();
  const client = getConvexClient();

  const service = await client.query(api.services.getById, { id: id as Id<"services"> });
  if (!service) return null;

  if (session.role === "admin") {
    return service;
  }

  const assignments = await client.query(api.assignments.listForUser, { userId: session.userId as any });
  const isAssignedToService = assignments.some(
    (a) => a.type === "service" && a.target_id === id
  );

  if (isAssignedToService) {
    return service;
  }

  const isAssignedToBusiness = assignments.some(
    (a) => a.type === "business" && a.target_id === service.business_id
  );

  if (isAssignedToBusiness) {
    return service;
  }

  throw new Error("Forbidden: Access to this service is restricted.");
}

export async function updateService(id: string, formData: FormData) {
  "use server";
  const session = await requireSession();
  if (session.role !== "admin") {
    throw new Error("Forbidden: Admin access required.");
  }

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
  const session = await requireSession();
  if (session.role !== "admin") {
    throw new Error("Forbidden: Admin access required.");
  }

  const client = getConvexClient();
  await client.mutation(api.services.remove, { id: id as Id<"services"> });
  redirect(`/dashboard/business/${businessId}`);
}

export async function getServiceBySlug(slug: string) {
  const client = getConvexClient();
  return client.query(api.services.getBySlugWithBusiness, { slug });
}

export async function listReviewTexts(serviceId: string) {
  const session = await requireSession();
  const client = getConvexClient();

  if (session.role !== "admin") {
    const service = await client.query(api.services.getById, { id: serviceId as Id<"services"> });
    if (!service) {
      throw new Error("Service not found");
    }

    const assignments = await client.query(api.assignments.listForUser, { userId: session.userId as any });
    const isAssignedToService = assignments.some(
      (a) => a.type === "service" && a.target_id === serviceId
    );
    const isAssignedToBusiness = assignments.some(
      (a) => a.type === "business" && a.target_id === service.business_id
    );

    if (!isAssignedToService && !isAssignedToBusiness) {
      throw new Error("Forbidden: Access to this service is restricted.");
    }
  }

  return client.query(api.reviews.listForService, {
    serviceId: serviceId as Id<"services">,
  });
}

export async function createReviewText(serviceId: string, formData: FormData) {
  "use server";
  const session = await requireSession();
  if (session.role !== "admin") {
    throw new Error("Forbidden: Admin access required.");
  }

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
  const session = await requireSession();
  if (session.role !== "admin") {
    throw new Error("Forbidden: Admin access required.");
  }

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
  const session = await requireSession();
  if (session.role !== "admin") {
    throw new Error("Forbidden: Admin access required.");
  }

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
  const session = await requireSession();
  if (session.role !== "admin") {
    throw new Error("Forbidden: Admin access required.");
  }

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
