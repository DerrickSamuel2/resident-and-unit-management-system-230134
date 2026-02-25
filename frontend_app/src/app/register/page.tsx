"use client";

import React, { useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { Alert, Field } from "@/components/FormBits";

type RegisterResponse = {
  id?: string;
  email?: string;
  status?: string;
};

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [unitNumber, setUnitNumber] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setDone(null);

    if (!email.trim() || !password || !fullName.trim() || !unitNumber.trim()) {
      setError("Name, unit number, email, and password are required.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        email: email.trim(),
        password,
        full_name: fullName.trim(),
        unit_number: unitNumber.trim(),
      };

      await apiFetch<RegisterResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
        auth: false,
      });

      setDone(
        "Registration submitted. If admin approval is enabled, you’ll be able to log in after approval."
      );
      setEmail("");
      setPassword("");
      setFullName("");
      setUnitNumber("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: "26px 0" }}>
      <div className="container">
        <section className="card" aria-label="Register">
          <header className="cardHeader">
            <div>
              <div className="h1">Register</div>
              <div className="muted">
                Create a resident account (may require approval).
              </div>
            </div>
            <span className="badge">ONBOARD / PRIVACY</span>
          </header>

          <div className="cardBody">
            {error ? (
              <div style={{ marginBottom: 12 }}>
                <Alert kind="error" title="Registration error" message={error} />
              </div>
            ) : null}
            {done ? (
              <div style={{ marginBottom: 12 }}>
                <Alert kind="success" title="Submitted" message={done} />
              </div>
            ) : null}

            <form onSubmit={onSubmit} style={{ display: "grid", gap: 14 }}>
              <div className="grid2">
                <Field label="Full name">
                  <input
                    className="input"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alex Resident"
                    autoComplete="name"
                  />
                </Field>

                <Field label="Unit number">
                  <input
                    className="input"
                    value={unitNumber}
                    onChange={(e) => setUnitNumber(e.target.value)}
                    placeholder="B-204"
                  />
                </Field>
              </div>

              <div className="grid2">
                <Field label="Email">
                  <input
                    className="input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@community.org"
                    autoComplete="email"
                  />
                </Field>

                <Field label="Password" hint="Minimum 8 characters.">
                  <input
                    className="input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                </Field>
              </div>

              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <button
                  className="btn btnPrimary"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Submitting…" : "Create account"}
                </button>
                <Link className="btn" href="/login">
                  Back to login
                </Link>
                <Link className="btn" href="/">
                  Home
                </Link>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
