"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/logo";
import {
  IconGrid,
  IconHeadset,
  IconQuestion,
  IconStore,
  IconX,
} from "@/components/icons";
import { logoutAction } from "@/app/login/actions";

function IconUsers({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.386 11.386 0 0110.089 18H8.25c-4.135 0-7.5 3.365-7.5 7.5v.75c0 .414.336.75.75.75h14.5a.75.75 0 00.75-.75v-.75c0-2.825-1.57-5.283-3.87-6.528M15 11.25a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zm6.75 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
      />
    </svg>
  );
}

type SessionType = {
  userId: string;
  username: string;
  role: "admin" | "staff";
} | null;

type SidebarNavProps = {
  session: SessionType;
  onNavigate?: () => void;
};

function SidebarNav({ session, onNavigate }: SidebarNavProps) {
  const pathname = usePathname();

  const isBusinessesActive =
    pathname.startsWith("/dashboard") && !pathname.startsWith("/dashboard/users");

  return (
    <div className="flex h-full flex-col">
      <div className="px-5 py-5">
        <Logo href="/" />
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
            isBusinessesActive
              ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          }`}
        >
          <IconStore className="h-5 w-5" />
          Businesses
        </Link>

        {session?.role === "admin" && (
          <Link
            href="/dashboard/users"
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              pathname.startsWith("/dashboard/users")
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            }`}
          >
            <IconUsers className="h-5 w-5" />
            User Management
          </Link>
        )}

        <div
          className="flex cursor-default items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/45"
          title="Coming soon"
        >
          <IconGrid className="h-5 w-5" />
          Dashboard
        </div>
      </nav>

      {/* Profile & Logout Section */}
      <div className="border-t border-sidebar-border p-4 flex flex-col gap-3 bg-sidebar-accent/10">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-accent-foreground font-bold text-sm shrink-0">
            {session?.username ? session.username.slice(0, 2).toUpperCase() : "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-sidebar-foreground truncate">
              {session?.username || "User"}
            </p>
            <p className="text-xs text-sidebar-foreground/50 capitalize">
              {session?.role || "Staff"}
            </p>
          </div>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-sidebar-border bg-sidebar hover:bg-destructive hover:text-white px-3 py-2 text-xs font-semibold text-sidebar-foreground transition-colors cursor-pointer"
          >
            Log Out
          </button>
        </form>
      </div>
    </div>
  );
}

export function DashboardSidebar({ session }: { session: SessionType }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between border-b border-sidebar-border bg-sidebar px-4 py-3 lg:hidden">
        <Logo href="/" compact />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-xl border border-sidebar-border bg-sidebar hover:bg-sidebar-accent px-3 py-2 text-sm font-semibold text-sidebar-foreground"
        >
          Menu
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-sidebar-foreground/40"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-72 flex-col bg-sidebar border-r border-sidebar-border shadow-xl">
            <div className="flex justify-end p-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-sidebar-foreground/70 hover:bg-sidebar-accent"
              >
                <IconX className="h-5 w-5" />
              </button>
            </div>
            <SidebarNav session={session} onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      ) : null}

      <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex">
        <SidebarNav session={session} />
      </aside>
    </>
  );
}
