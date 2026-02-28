"use client";

export type Theme = "dark" | "light";

const THEME_STORAGE_KEY = "resident_directory_theme";

/** PUBLIC_INTERFACE */
export function getStoredTheme(): Theme | null {
  /** Returns the user's persisted theme preference, if any. */
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (raw === "light" || raw === "dark") return raw;
    return null;
  } catch {
    return null;
  }
}

/** PUBLIC_INTERFACE */
export function getSystemTheme(): Theme {
  /** Best-effort system theme detection. Defaults to dark for the app's retro aesthetic. */
  if (typeof window === "undefined") return "dark";
  return window.matchMedia?.("(prefers-color-scheme: light)")?.matches
    ? "light"
    : "dark";
}

/** PUBLIC_INTERFACE */
export function getInitialTheme(): Theme {
  /** Determines the initial theme (stored preference first, then system). */
  return getStoredTheme() ?? getSystemTheme();
}

/** PUBLIC_INTERFACE */
export function setStoredTheme(theme: Theme): void {
  /** Persists the theme preference. */
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Ignore write failures (private mode, disabled storage, etc.)
  }
}

/** PUBLIC_INTERFACE */
export function applyThemeToDocument(theme: Theme): void {
  /**
   * Applies the theme to the document root.
   * Our CSS uses :root[data-theme="light"] overrides (dark is default :root).
   */
  if (typeof document === "undefined") return;

  if (theme === "light") {
    document.documentElement.dataset.theme = "light";
  } else {
    // Remove attribute so base :root (dark) is used.
    delete document.documentElement.dataset.theme;
  }
}
