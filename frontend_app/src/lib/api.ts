"use client";

import { getToken } from "@/lib/auth";

export type ApiError = {
  status: number;
  message: string;
  details?: unknown;
};

function hasDetailField(value: unknown): value is { detail: unknown } {
  return (
    typeof value === "object" &&
    value !== null &&
    "detail" in value &&
    (value as { detail?: unknown }).detail !== undefined
  );
}

function getApiBaseUrl(): string {
  // The platform/container currently provides NEXT_PUBLIC_API_BASE, while local dev
  // and docs may use NEXT_PUBLIC_API_BASE_URL. Support both to avoid hard failures.
  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE;

  if (!base) {
    // Intentionally explicit so misconfiguration is obvious during development/CI.
    throw new Error(
      "Backend API base URL is not set. Define NEXT_PUBLIC_API_BASE_URL (preferred) or NEXT_PUBLIC_API_BASE in frontend_app environment."
    );
  }

  return base.replace(/\/+$/, "");
}

async function parseJsonSafe(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/** PUBLIC_INTERFACE */
export async function apiFetch<T>(
  path: string,
  options?: RequestInit & { auth?: boolean }
): Promise<T> {
  /**
   * Fetch helper for the backend API.
   * - Uses NEXT_PUBLIC_API_BASE_URL
   * - Adds Authorization header when options.auth !== false (default true)
   * - Throws ApiError for non-2xx responses with parsed details
   */
  const url = `${getApiBaseUrl()}${path.startsWith("/") ? "" : "/"}${path}`;
  const auth = options?.auth ?? true;

  const headers = new Headers(options?.headers ?? {});
  headers.set("Accept", "application/json");

  if (options?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (auth) {
    const token = getToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  const data = await parseJsonSafe(res);

  if (!res.ok) {
    const msg = hasDetailField(data)
      ? String(data.detail)
      : `Request failed (${res.status})`;

    const err: ApiError = {
      status: res.status,
      message: msg,
      details: data,
    };
    throw err;
  }

  return data as T;
}
