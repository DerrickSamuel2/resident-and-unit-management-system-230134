"use client";

import React from "react";

/** PUBLIC_INTERFACE */
export function Field({
  label,
  children,
  hint,
}: {
  /** Visible field label */
  label: string;
  /** Input element */
  children: React.ReactNode;
  /** Optional hint text */
  hint?: string;
}) {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <div className="label">{label}</div>
      {children}
      {hint ? <div className="muted" style={{ fontSize: 12 }}>{hint}</div> : null}
    </div>
  );
}

/** PUBLIC_INTERFACE */
export function Alert({
  kind,
  title,
  message,
}: {
  /** Visual type */
  kind: "info" | "success" | "error";
  /** Short heading */
  title: string;
  /** Optional message details */
  message?: string;
}) {
  const border =
    kind === "success"
      ? "rgba(6, 182, 212, 0.55)"
      : kind === "error"
        ? "rgba(239, 68, 68, 0.55)"
        : "rgba(59, 130, 246, 0.55)";
  const bg =
    kind === "success"
      ? "rgba(6, 182, 212, 0.10)"
      : kind === "error"
        ? "rgba(239, 68, 68, 0.10)"
        : "rgba(59, 130, 246, 0.10)";

  return (
    <div
      className="card"
      role={kind === "error" ? "alert" : "status"}
      aria-live="polite"
      style={{
        padding: 12,
        borderColor: border,
        background: `linear-gradient(180deg, ${bg}, rgba(255,255,255,0.02))`,
      }}
    >
      <div style={{ fontWeight: 800 }}>{title}</div>
      {message ? <div className="muted">{message}</div> : null}
    </div>
  );
}
