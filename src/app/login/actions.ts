"use server";

import { cookies } from "next/headers";
import { getConvexClient } from "@/lib/convex";
import { api } from "../../../convex/_generated/api";
import { verifyPassword } from "@/lib/crypto";
import { encryptSession, SESSION_COOKIE_NAME } from "@/lib/session";
import { redirect } from "next/navigation";

export async function loginAction(prevState: { error?: string } | null, formData: FormData) {
  const password = String(formData.get("password") ?? "").trim();
  if (!password) {
    return { error: "Password is required" };
  }

  // 1. Check Admin Password
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  if (password === adminPassword) {
    const sessionToken = await encryptSession({
      userId: "admin",
      username: "Admin",
      role: "admin",
    });

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    redirect("/dashboard");
  }

  // 2. Check Staff Passwords from Convex
  const client = getConvexClient();
  const users = await client.query(api.users.list);
  let matchingUser = null;
  for (const user of users) {
    if (verifyPassword(password, user.password_hash)) {
      matchingUser = user;
      break;
    }
  }

  if (matchingUser) {
    const sessionToken = await encryptSession({
      userId: matchingUser._id,
      username: matchingUser.username,
      role: "staff",
    });

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    redirect("/dashboard");
  }

  return { error: "Invalid password" };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect("/login");
}
