"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearAuth, getAuth } from "@/lib/auth";
import { ThemeToggle } from "@/components/ThemeToggle";
import React from "react";

type NavItem = { href: string; label: string; kbd?: string };

function NavLink({ href, label, kbd }: NavItem) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}
      className={active ? "activeNav" : undefined}
    >
      <span>{label}</span>
      {kbd ? <span className="kbd">{kbd}</span> : null}
    </Link>
  );
}

/** PUBLIC_INTERFACE */
export function RetroShell({
  title,
  subtitle,
  children,
  navItems,
  rightHeader,
}: {
  /** Page title */
  title: string;
  /** Optional subtitle text */
  subtitle?: string;
  /** Main content */
  children: React.ReactNode;
  /** Sidebar navigation */
  navItems: NavItem[];
  /** Optional header content on the right side */
  rightHeader?: React.ReactNode;
}) {
  const router = useRouter();
  const auth = getAuth();

  return (
    <main style={{ padding: "22px 0" }}>
      <div className="container">
        <div className="card" role="region" aria-label="Application shell">
          <div className="cardHeader">
            <div>
              <div className="h1">{title}</div>
              {subtitle ? <div className="muted">{subtitle}</div> : null}
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              {rightHeader}
              <ThemeToggle />
              {auth?.token ? (
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    clearAuth();
                    router.push("/login");
                  }}
                >
                  Log out
                </button>
              ) : null}
            </div>
          </div>

          <div className="cardBody">
            <div className="navShell">
              <aside className="card sidebar" aria-label="Sidebar navigation">
                {navItems.map((n) => (
                  <NavLink key={n.href} {...n} />
                ))}
              </aside>

              <section aria-label="Page content">{children}</section>
            </div>
          </div>
        </div>

        <style jsx>{`
          :global(.activeNav) {
            border-color: rgba(59, 130, 246, 0.55) !important;
            background: rgba(59, 130, 246, 0.12) !important;
            color: var(--text) !important;
          }
        `}</style>
      </div>
    </main>
  );
}
