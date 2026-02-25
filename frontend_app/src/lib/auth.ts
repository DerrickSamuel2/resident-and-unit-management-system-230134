"use client";

export type UserRole = "resident" | "staff" | "admin";

type StoredAuth = {
  token: string;
  role?: UserRole;
  email?: string;
};

const STORAGE_KEY = "resident_directory_auth";

/** PUBLIC_INTERFACE */
export function getAuth(): StoredAuth | null {
  /** Read auth context from localStorage (client-only). */
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredAuth;
  } catch {
    return null;
  }
}

/** PUBLIC_INTERFACE */
export function setAuth(auth: StoredAuth): void {
  /** Persist auth context to localStorage (client-only). */
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
}

/** PUBLIC_INTERFACE */
export function clearAuth(): void {
  /** Clear auth context from localStorage (client-only). */
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

/** PUBLIC_INTERFACE */
export function getToken(): string | null {
  /** Convenience getter for bearer token. */
  return getAuth()?.token ?? null;
}
