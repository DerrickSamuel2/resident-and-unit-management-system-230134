"use client";

import React, { useEffect, useMemo, useState } from "react";
import { RetroShell } from "@/components/RetroShell";
import { Alert } from "@/components/FormBits";
import { apiFetch } from "@/lib/api";

type PendingUser = {
  id: string;
  email: string;
  full_name?: string | null;
  unit_number?: string | null;
  created_at?: string | null;
};

type PendingResponse = { items: PendingUser[] };

export default function AdminApprovalsPage() {
  const nav = useMemo(
    () => [
      { href: "/admin", label: "Admin" },
      { href: "/admin/approvals", label: "Approvals" },
      { href: "/admin/announcements", label: "Announcements" },
      { href: "/directory", label: "Directory" },
    ],
    []
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<PendingUser[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<PendingResponse>("/auth/pending", {
        method: "GET",
      });
      setItems(data.items ?? []);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Unable to load pending approvals."
      );
    } finally {
      setLoading(false);
    }
  }

  async function approve(id: string) {
    setBusyId(id);
    setError(null);
    try {
      await apiFetch(`/auth/approve/${encodeURIComponent(id)}`, {
        method: "POST",
      });
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Approval failed.");
    } finally {
      setBusyId(null);
    }
  }

  async function reject(id: string) {
    setBusyId(id);
    setError(null);
    try {
      await apiFetch(`/auth/reject/${encodeURIComponent(id)}`, {
        method: "POST",
      });
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Reject failed.");
    } finally {
      setBusyId(null);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <RetroShell
      title="Admin Approvals"
      subtitle="Review and approve new registrations."
      navItems={nav}
      rightHeader={<span className="badge">{loading ? "SYNC…" : `${items.length} pending`}</span>}
    >
      <div style={{ display: "grid", gap: 12 }}>
        {error ? <Alert kind="error" title="Approvals error" message={error} /> : null}

        <section className="card" aria-label="Pending approvals">
          <div className="cardHeader">
            <div className="h2">Pending</div>
            <button className="btn" type="button" onClick={load} disabled={loading}>
              Refresh
            </button>
          </div>
          <div className="cardBody" style={{ display: "grid", gap: 10 }}>
            {items.length === 0 ? (
              <div className="muted">No pending registrations.</div>
            ) : (
              items.map((u) => (
                <div key={u.id} className="card" style={{ padding: 14 }}>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <span className="badge">Email: {u.email}</span>
                    <span className="badge">
                      Name: {u.full_name || "—"}
                    </span>
                    <span className="badge">
                      Unit: {u.unit_number || "—"}
                    </span>
                    {u.created_at ? (
                      <span className="badge">Created: {u.created_at}</span>
                    ) : null}
                  </div>

                  <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                    <button
                      className="btn btnPrimary"
                      type="button"
                      onClick={() => approve(u.id)}
                      disabled={busyId === u.id}
                    >
                      {busyId === u.id ? "Working…" : "Approve"}
                    </button>
                    <button
                      className="btn btnDanger"
                      type="button"
                      onClick={() => reject(u.id)}
                      disabled={busyId === u.id}
                    >
                      {busyId === u.id ? "Working…" : "Reject"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </RetroShell>
  );
}
