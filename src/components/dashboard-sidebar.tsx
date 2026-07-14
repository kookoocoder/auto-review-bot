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

const navItems = [
  {
    href: "/dashboard",
    label: "Businesses",
    icon: IconStore,
    match: (path: string) => path.startsWith("/dashboard"),
  },
];

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      <div className="px-5 py-5">
        <Logo href="/" />
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {navItems.map((item) => {
          const active = item.match(pathname);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-primary-soft text-primary"
                  : "text-muted hover:bg-surface-muted hover:text-navy"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
        <div
          className="flex cursor-default items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-light"
          title="Coming soon"
        >
          <IconGrid className="h-5 w-5" />
          Dashboard
        </div>
      </nav>

      <div className="m-3 rounded-2xl border border-border bg-surface-muted p-4">
        <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-primary">
          <IconQuestion className="h-4 w-4" />
        </div>
        <p className="text-sm font-semibold text-navy">Need Help?</p>
        <p className="mt-1 text-xs leading-relaxed text-muted">
          Check our documentation or contact support.
        </p>
        <a
          href="mailto:support@qrreview.platform"
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-navy transition-colors hover:bg-primary-soft hover:text-primary"
        >
          <IconHeadset className="h-3.5 w-3.5" />
          Contact Support
        </a>
      </div>
    </>
  );
}

export function DashboardSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3 lg:hidden">
        <Logo href="/" compact />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-xl border border-border px-3 py-2 text-sm font-semibold text-navy"
        >
          Menu
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-navy/40"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-72 flex-col bg-surface shadow-xl">
            <div className="flex justify-end p-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-muted hover:bg-surface-muted"
              >
                <IconX className="h-5 w-5" />
              </button>
            </div>
            <SidebarNav onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      ) : null}

      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-surface lg:flex">
        <SidebarNav />
      </aside>
    </>
  );
}
