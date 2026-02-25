"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { RetroShell } from "@/components/RetroShell";
import { Alert } from "@/components/FormBits";
import { getAuth } from "@/lib/auth";

export default function AdminHomePage() {
  const nav = useMemo(
    () => [
      { href: "/directory", label: "Directory" },
      { href: "/profile", label: "My Profile" },
      { href: "/admin", label: "Admin" },
      { href: "/", label: "Home" },
    ],
    []
  );

  const role = getAuth()?.role;

  return (
    <RetroShell
      title="Admin Console"
      subtitle="Approvals, resident management, and announcements."
      navItems={nav}
      rightHeader={<span className="badge">ROLE: {role ?? "unknown"}</span>}
    >
      <div style={{ display: "grid", gap: 12 }}>
        <Alert
          kind="info"
          title="Access control"
          message="Admin endpoints require an admin token. If you see 403 errors, log in with an admin account."
        />

        <section className="card" aria-label="Admin actions">
          <div className="cardHeader">
            <div className="h2">Actions</div>
          </div>
          <div className="cardBody" style={{ display: "grid", gap: 10 }}>
            <Link className="btn btnPrimary" href="/admin/approvals">
              Approve / Reject Registrations
            </Link>
            <Link className="btn" href="/admin/announcements">
              Manage Announcements
            </Link>
          </div>
        </section>
      </div>
    </RetroShell>
  );
}
