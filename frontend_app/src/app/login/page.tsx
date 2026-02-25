"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { setAuth, UserRole } from "@/lib/auth";
import { Alert, Field } from "@/components/FormBits";

type LoginResponse = {
  access_token: string;
  token_type: "bearer";
  role?: UserRole;
  email?: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    try {
      // Backend typically uses JSON body for login in our implementation.
      const data = await apiFetch<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: email.trim(), password }),
        auth: false,
      });

      setAuth({ token: data.access_token, role: data.role, email: data.email });
      router.push("/directory");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: "26px 0" }}>
      <div className="container">
        <section className="card" aria-label="Login">
          <header className="cardHeader">
            <div>
              <div className="h1">Login</div>
              <div className="muted">Authenticate to access the directory.</div>
            </div>
            <span className="badge">AUTH / JWT</span>
          </header>

          <div className="cardBody">
            {error ? (
              <div style={{ marginBottom: 12 }}>
                <Alert kind="error" title="Login error" message={error} />
              </div>
            ) : null}

            <form onSubmit={onSubmit} style={{ display: "grid", gap: 14 }}>
              <Field label="Email">
                <input
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@community.org"
                  autoComplete="email"
                />
              </Field>

              <Field label="Password">
                <input
                  className="input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </Field>

              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <button
                  className="btn btnPrimary"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Signing in…" : "Sign in"}
                </button>
                <Link className="btn" href="/register">
                  Create account
                </Link>
                <Link className="btn" href="/">
                  Home
                </Link>
              </div>
            </form>

            <p className="muted" style={{ marginTop: 14 }}>
              Note: new accounts may require admin approval before they can log
              in.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
