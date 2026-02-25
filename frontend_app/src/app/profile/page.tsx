"use client";

import React, { useEffect, useMemo, useState } from "react";
import { RetroShell } from "@/components/RetroShell";
import { Alert, Field } from "@/components/FormBits";
import { apiFetch } from "@/lib/api";

type PrivacySettings = {
  show_email?: boolean;
  show_phone?: boolean;
  show_unit?: boolean;
  show_photo?: boolean;
};

type MyProfile = {
  id: string;
  full_name?: string | null;
  unit_number?: string | null;
  building?: string | null;
  floor?: string | null;
  email?: string | null;
  phone?: string | null;
  bio?: string | null;
  interests?: string[] | null;
  privacy?: PrivacySettings | null;
};

export default function MyProfilePage() {
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
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const [profile, setProfile] = useState<MyProfile | null>(null);

  // Editable fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState("");

  // Privacy
  const [showEmail, setShowEmail] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [showUnit, setShowUnit] = useState(true);
  const [showPhoto, setShowPhoto] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await apiFetch<MyProfile>("/profiles/me", { method: "GET" });
        setProfile(data);

        setFullName(data.full_name ?? "");
        setPhone(data.phone ?? "");
        setBio(data.bio ?? "");
        setInterests((data.interests ?? []).join(", "));

        setShowEmail(Boolean(data.privacy?.show_email));
        setShowPhone(Boolean(data.privacy?.show_phone));
        setShowUnit(data.privacy?.show_unit !== false);
        setShowPhoto(Boolean(data.privacy?.show_photo));
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Unable to load your profile."
        );
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function saveProfile() {
    setSaving(true);
    setError(null);
    setOk(null);

    try {
      const payload = {
        full_name: fullName.trim(),
        phone: phone.trim() || null,
        bio: bio.trim() || null,
        interests: interests
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      const updated = await apiFetch<MyProfile>("/profiles/me", {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      setProfile(updated);
      setOk("Profile updated.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to save profile.");
    } finally {
      setSaving(false);
    }
  }

  async function savePrivacy() {
    setSaving(true);
    setError(null);
    setOk(null);

    try {
      const payload = {
        show_email: showEmail,
        show_phone: showPhone,
        show_unit: showUnit,
        show_photo: showPhoto,
      };

      const updated = await apiFetch<MyProfile>("/profiles/me/privacy", {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      setProfile(updated);
      setOk("Privacy settings updated.");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Unable to save privacy settings."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <RetroShell
      title="My Profile & Privacy"
      subtitle="Edit your info and control what other residents can see."
      navItems={nav}
      rightHeader={
        <span className="badge">
          {loading ? "LOADING…" : saving ? "SAVING…" : "READY"}
        </span>
      }
    >
      <div style={{ display: "grid", gap: 12 }}>
        {error ? <Alert kind="error" title="Error" message={error} /> : null}
        {ok ? <Alert kind="success" title="Saved" message={ok} /> : null}

        <section className="card" aria-label="Account">
          <div className="cardHeader">
            <div className="h2">Account</div>
            <span className="muted" style={{ fontFamily: "var(--font-mono)" }}>
              ID: {profile?.id ?? "—"}
            </span>
          </div>
          <div className="cardBody" style={{ display: "grid", gap: 10 }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <span className="badge">Email: {profile?.email ?? "—"}</span>
              <span className="badge">
                Unit: {profile?.unit_number ?? "—"}
              </span>
              {profile?.building ? (
                <span className="badge">Building: {profile.building}</span>
              ) : null}
              {profile?.floor ? (
                <span className="badge">Floor: {profile.floor}</span>
              ) : null}
            </div>
            <div className="muted">
              Some fields (like unit/building) may be managed by staff/admin.
            </div>
          </div>
        </section>

        <section className="card" aria-label="Edit profile">
          <div className="cardHeader">
            <div className="h2">Edit Profile</div>
            <button
              className="btn btnPrimary"
              type="button"
              onClick={saveProfile}
              disabled={saving || loading}
            >
              Save profile
            </button>
          </div>
          <div className="cardBody" style={{ display: "grid", gap: 14 }}>
            <Field label="Full name">
              <input
                className="input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
              />
            </Field>

            <Field label="Phone (optional)">
              <input
                className="input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555 0100"
              />
            </Field>

            <Field label="Interests (comma-separated)" hint="Example: tennis, gardening, chess">
              <input
                className="input"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="tennis, gardening, chess"
              />
            </Field>

            <Field label="Bio (optional)">
              <textarea
                className="textarea"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="A short intro…"
              />
            </Field>
          </div>
        </section>

        <section className="card" aria-label="Privacy controls">
          <div className="cardHeader">
            <div className="h2">Privacy Controls</div>
            <button
              className="btn btnPrimary"
              type="button"
              onClick={savePrivacy}
              disabled={saving || loading}
            >
              Save privacy
            </button>
          </div>

          <div className="cardBody" style={{ display: "grid", gap: 10 }}>
            <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input
                type="checkbox"
                checked={showEmail}
                onChange={(e) => setShowEmail(e.target.checked)}
              />
              <span>Show my email to other residents</span>
            </label>

            <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input
                type="checkbox"
                checked={showPhone}
                onChange={(e) => setShowPhone(e.target.checked)}
              />
              <span>Show my phone to other residents</span>
            </label>

            <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input
                type="checkbox"
                checked={showUnit}
                onChange={(e) => setShowUnit(e.target.checked)}
              />
              <span>Show my unit number in the directory</span>
            </label>

            <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input
                type="checkbox"
                checked={showPhoto}
                onChange={(e) => setShowPhoto(e.target.checked)}
              />
              <span>Show my photo (if uploaded)</span>
            </label>

            <div className="muted" style={{ marginTop: 6 }}>
              Privacy is enforced by the backend; this UI only manages your
              preferences.
            </div>
          </div>
        </section>
      </div>
    </RetroShell>
  );
}
