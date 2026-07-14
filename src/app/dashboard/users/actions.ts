"use server";

import { revalidatePath } from "next/cache";
import { getConvexClient } from "@/lib/convex";
import { api } from "../../../../convex/_generated/api";
import { hashPassword, verifyPassword } from "@/lib/crypto";
import { getSession } from "@/lib/session";
import type { Id } from "../../../../convex/_generated/dataModel";

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    throw new Error("Forbidden: Admin access required.");
  }
}

export async function createUserAction(prevState: { error?: string; success?: boolean } | null, formData: FormData) {
  try {
    await requireAdmin();

    const username = String(formData.get("username") ?? "").trim();
    const password = String(formData.get("password") ?? "").trim();

    if (!username || !password) {
      return { error: "Username and password are required" };
    }

    if (password === (process.env.ADMIN_PASSWORD || "admin123")) {
      return { error: "Password cannot be the same as the Admin password" };
    }

    const client = getConvexClient();
    const users = await client.query(api.users.list);

    // Enforce unique passwords across all staff members
    for (const u of users) {
      if (verifyPassword(password, u.password_hash)) {
        return { error: "This password is already assigned to another user. Please choose a unique password." };
      }
    }

    // Generate hash
    const password_hash = hashPassword(password);
    await client.mutation(api.users.create, { username, password_hash });

    revalidatePath("/dashboard/users");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to create user" };
  }
}

export async function deleteUserAction(id: string) {
  await requireAdmin();
  const client = getConvexClient();
  await client.mutation(api.users.remove, { id: id as Id<"users"> });
  revalidatePath("/dashboard/users");
}

export async function toggleAssignmentAction(
  userId: string,
  targetId: string,
  type: "business" | "service",
  assigned: boolean
) {
  await requireAdmin();
  const client = getConvexClient();

  if (assigned) {
    await client.mutation(api.assignments.create, {
      user_id: userId as Id<"users">,
      target_id: targetId as any,
      type,
    });
  } else {
    await client.mutation(api.assignments.remove, {
      user_id: userId as Id<"users">,
      target_id: targetId as any,
    });
  }
  revalidatePath("/dashboard/users");
}
