"use client";

import React, { useEffect } from "react";
import { applyThemeToDocument, getInitialTheme } from "@/lib/theme";

/** PUBLIC_INTERFACE */
export function ThemeBootstrap(): null {
  /**
   * Applies persisted/system theme on app load.
   * This ensures pages not using RetroShell still get correct theme variables.
   */
  useEffect(() => {
    applyThemeToDocument(getInitialTheme());
  }, []);

  return null;
}
