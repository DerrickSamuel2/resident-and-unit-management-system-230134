"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { RetroShell } from "@/components/RetroShell";
import { Alert, Field } from "@/components/FormBits";
import { apiFetch } from "@/lib/api";

type DirectoryResident = {
  id: string;
  full_name?: string | null;
  unit_number?: string | null;
  building?: string | null;
  floor?: string | null;
  phone?: string | null;
  email?: string | null;
  // Backend may include a privacy-filtered "visible_fields" etc; we render conservatively.
};

type DirectoryResponse = {
  items: DirectoryResident[];
  total?: number;
};

export default function DirectoryPage() {
  const nav = useMemo(
    () => [
      { href: "/directory", label: "Directory", kbd: "D" },
      { href: "/profile", label: "My Profile", kbd: "P" },
      { href: "/admin", label: "Admin", kbd: "A" },
      { href: "/", label: "Home", kbd: "H" },
    ],
    []
  );

  const [q, setQ] = useState("");
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [items, setItems] = useState<DirectoryResident[]>([]);

  async function load() {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (building.trim()) params.set("building", building.trim());
    if (floor.trim()) params.set("floor", floor.trim());

    try {
      const data = await apiFetch<DirectoryResponse>(
        `/profiles/directory?${params.toString()}`,
        { method: "GET" }
      );
      setItems(data.items ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to load directory.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // initial load
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <RetroShell
      title="Resident Directory"
      subtitle="Search by name or unit, filter by building/floor. Privacy rules are applied by the server."
      navItems={nav}
      rightHeader={
        <span className="badge">{loading ? "SYNC…" : `${items.length} shown`}</span>
      }
    >
      <div style={{ display: "grid", gap: 12 }}>
        {error ? <Alert kind="error" title="Directory error" message={error} /> : null}

        <section className="card" aria-label="Search and filters">
          <div className="cardHeader">
            <div className="h2">Search & Filters</div>
            <button className="btn" type="button" onClick={load} disabled={loading}>
              Refresh
            </button>
          </div>
          <div className="cardBody" style={{ display: "grid", gap: 14 }}>
            <Field label="Search">
              <input
                className="input"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Name, unit number…"
              />
            </Field>

            <div className="grid2">
              <Field label="Building / Block">
                <input
                  className="input"
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                  placeholder="A, B, North…"
                />
              </Field>
              <Field label="Floor">
                <input
                  className="input"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  placeholder="2, 10…"
                />
              </Field>
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button
                className="btn btnPrimary"
                type="button"
                onClick={load}
                disabled={loading}
              >
                {loading ? "Searching…" : "Search"}
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setQ("");
                  setBuilding("");
                  setFloor("");
                }}
                disabled={loading}
              >
                Clear
              </button>
            </div>
          </div>
        </section>

        <section className="card" aria-label="Results">
          <div className="cardHeader">
            <div className="h2">Results</div>
            <span className="muted" style={{ fontFamily: "var(--font-mono)" }}>
              Click a resident to view profile
            </span>
          </div>
          <div className="cardBody" style={{ display: "grid", gap: 10 }}>
            {items.length === 0 ? (
              <div className="muted">No residents match your query.</div>
            ) : (
              items.map((r) => (
                <div
                  key={r.id}
                  className="card"
                  style={{ padding: 14, display: "grid", gap: 6 }}
                >
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <div style={{ fontWeight: 800 }}>
                      {r.full_name || "Unnamed Resident"}
                    </div>
                    <span className="badge">
                      Unit: {r.unit_number || "—"}
                    </span>
                    {r.building ? <span className="badge">Bldg: {r.building}</span> : null}
                    {r.floor ? <span className="badge">Floor: {r.floor}</span> : null}
                  </div>

                  <div className="muted" style={{ fontFamily: "var(--font-mono)" }}>
                    {r.email ? `Email: ${r.email}` : "Email: hidden"}
                    {" · "}
                    {r.phone ? `Phone: ${r.phone}` : "Phone: hidden"}
                  </div>

                  <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                    <Link className="btn btnPrimary" href={`/residents/${r.id}`}>
                      View profile
                    </Link>
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
