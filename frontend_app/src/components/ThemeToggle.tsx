"use client";

import React, { useEffect, useState } from "react";
import {
  applyThemeToDocument,
  getInitialTheme,
  setStoredTheme,
  type Theme,
} from "@/lib/theme";

/** PUBLIC_INTERFACE */
export function ThemeToggle(): React.ReactNode {
  /**
   * Header-friendly theme toggle.
   * - Persists selection in localStorage
   * - Applies `data-theme` to <html> so globals.css variables take effect
   */
  const [theme, setTheme] = useState<Theme>(() => "dark");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Hydration-safe: resolve theme on client, then apply.
    const t = getInitialTheme();
    setTheme(t);
    applyThemeToDocument(t);
    setHydrated(true);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    setStoredTheme(next);
    applyThemeToDocument(next);
  }

  // Avoid showing a potentially wrong state before hydration; keep layout stable.
  const label = hydrated ? (theme === "dark" ? "Dark" : "Light") : "Theme";
  const hint = hydrated ? (theme === "dark" ? "🌙" : "☀") : "…";

  return (
    <button
      type="button"
      className="btn"
      onClick={toggle}
      aria-label="Toggle color theme"
      aria-pressed={hydrated ? theme === "light" : undefined}
      title="Toggle light/dark theme"
      style={{ minWidth: 110 }}
    >
      <span style={{ fontFamily: "var(--font-mono)" }}>{hint}</span>
      <span style={{ fontFamily: "var(--font-mono)" }}>{label}</span>
    </button>
  );
}
