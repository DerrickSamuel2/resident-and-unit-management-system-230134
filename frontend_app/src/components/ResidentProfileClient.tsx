"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { RetroShell } from "@/components/RetroShell";
import { Alert } from "@/components/FormBits";
import { apiFetch } from "@/lib/api";

type ResidentProfile = {
  id: string;
  full_name?: string | null;
  unit_number?: string | null;
  building?: string | null;
  floor?: string | null;
  email?: string | null;
  phone?: string | null;
  bio?: string | null;
  interests?: string[] | null;
};

/** PUBLIC_INTERFACE */
export function ResidentProfileClient({ id }: { id: string }) {
  /** Client-side profile viewer that fetches resident profile details by ID. */
  const nav = useMemo(
    () => [
      { href: "/directory", label: "Directory" },
      { href: "/profile", label: "My Profile" },
      { href: "/admin", label: "Admin" },
      { href: "/", label: "Home" },
    ],
    []
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<ResidentProfile | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await apiFetch<ResidentProfile>(
          `/profiles/${encodeURIComponent(id)}`,
          { method: "GET" }
        );
        setProfile(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Unable to load profile.");
      } finally {
        setLoading(false);
      }
    }

    if (id && id !== "placeholder") {
      load();
    } else {
      setProfile(null);
      setError(null);
    }
  }, [id]);

  return (
    <RetroShell
      title="Resident Profile"
      subtitle="Fields shown here are filtered by the resident’s privacy settings."
      navItems={nav}
      rightHeader={<span className="badge">{loading ? "LOADING…" : "VIEW"}</span>}
    >
      <div style={{ display: "grid", gap: 12 }}>
        {id === "placeholder" ? (
          <Alert
            kind="info"
            title="Static export placeholder"
            message="This route is statically exported with a placeholder ID. In a server deployment, dynamic resident IDs would render normally."
          />
        ) : null}

        {error ? (
          <Alert kind="error" title="Profile error" message={error} />
        ) : null}

        <section className="card" aria-label="Profile details">
          <div className="cardHeader">
            <div className="h2">Details</div>
            <Link className="btn" href="/directory">
              Back
            </Link>
          </div>

          <div className="cardBody" style={{ display: "grid", gap: 10 }}>
            {!profile ? (
              <div className="muted">
                {id === "placeholder"
                  ? "No profile loaded for placeholder route."
                  : "No profile data."}
              </div>
            ) : (
              <>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <span className="badge">Name: {profile.full_name || "Hidden"}</span>
                  <span className="badge">Unit: {profile.unit_number || "Hidden"}</span>
                  {profile.building ? (
                    <span className="badge">Building: {profile.building}</span>
                  ) : null}
                  {profile.floor ? <span className="badge">Floor: {profile.floor}</span> : null}
                </div>

                <div className="card" style={{ padding: 14 }}>
                  <div className="h2">Contact</div>
                  <div className="muted" style={{ marginTop: 6 }}>
                    {profile.email ? `Email: ${profile.email}` : "Email: hidden"}
                    <br />
                    {profile.phone ? `Phone: ${profile.phone}` : "Phone: hidden"}
                  </div>
                </div>

                {profile.bio ? (
                  <div className="card" style={{ padding: 14 }}>
                    <div className="h2">Bio</div>
                    <div className="muted" style={{ marginTop: 6 }}>
                      {profile.bio}
                    </div>
                  </div>
                ) : null}

                {profile.interests && profile.interests.length ? (
                  <div className="card" style={{ padding: 14 }}>
                    <div className="h2">Interests</div>
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        flexWrap: "wrap",
                        marginTop: 10,
                      }}
                    >
                      {profile.interests.map((i) => (
                        <span className="badge" key={i}>
                          {i}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </section>
      </div>
    </RetroShell>
  );
}
