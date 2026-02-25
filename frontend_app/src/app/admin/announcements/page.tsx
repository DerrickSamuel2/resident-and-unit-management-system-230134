"use client";

import React, { useEffect, useMemo, useState } from "react";
import { RetroShell } from "@/components/RetroShell";
import { Alert, Field } from "@/components/FormBits";
import { apiFetch } from "@/lib/api";

type Announcement = {
  id: string;
  title: string;
  body: string;
  created_at?: string | null;
};

type ListResponse = { items: Announcement[] };

export default function AdminAnnouncementsPage() {
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
  const [ok, setOk] = useState<string | null>(null);

  const [items, setItems] = useState<Announcement[]>([]);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<ListResponse>("/announcements", {
        method: "GET",
      });
      setItems(data.items ?? []);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Unable to load announcements."
      );
    } finally {
      setLoading(false);
    }
  }

  async function create() {
    setError(null);
    setOk(null);

    if (!title.trim() || !body.trim()) {
      setError("Title and body are required.");
      return;
    }

    try {
      await apiFetch("/announcements", {
        method: "POST",
        body: JSON.stringify({ title: title.trim(), body: body.trim() }),
      });
      setTitle("");
      setBody("");
      setOk("Announcement posted.");
      await load();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Unable to create announcement."
      );
    }
  }

  async function remove(id: string) {
    setError(null);
    setOk(null);
    try {
      await apiFetch(`/announcements/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      setOk("Announcement removed.");
      await load();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Unable to delete announcement."
      );
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <RetroShell
      title="Admin Announcements"
      subtitle="Broadcast messages to all residents."
      navItems={nav}
      rightHeader={<span className="badge">{loading ? "SYNC…" : `${items.length} items`}</span>}
    >
      <div style={{ display: "grid", gap: 12 }}>
        {error ? <Alert kind="error" title="Announcements error" message={error} /> : null}
        {ok ? <Alert kind="success" title="OK" message={ok} /> : null}

        <section className="card" aria-label="Create announcement">
          <div className="cardHeader">
            <div className="h2">Create</div>
            <button className="btn btnPrimary" type="button" onClick={create}>
              Post
            </button>
          </div>
          <div className="cardBody" style={{ display: "grid", gap: 14 }}>
            <Field label="Title">
              <input
                className="input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Water shutdown notice…"
              />
            </Field>
            <Field label="Body">
              <textarea
                className="textarea"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Details, timing, contact…"
              />
            </Field>
          </div>
        </section>

        <section className="card" aria-label="Existing announcements">
          <div className="cardHeader">
            <div className="h2">Existing</div>
            <button className="btn" type="button" onClick={load} disabled={loading}>
              Refresh
            </button>
          </div>
          <div className="cardBody" style={{ display: "grid", gap: 10 }}>
            {items.length === 0 ? (
              <div className="muted">No announcements yet.</div>
            ) : (
              items.map((a) => (
                <div key={a.id} className="card" style={{ padding: 14, display: "grid", gap: 8 }}>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                    <div style={{ fontWeight: 900 }}>{a.title}</div>
                    {a.created_at ? <span className="badge">{a.created_at}</span> : null}
                  </div>
                  <div className="muted" style={{ whiteSpace: "pre-wrap" }}>
                    {a.body}
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button className="btn btnDanger" type="button" onClick={() => remove(a.id)}>
                      Delete
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
