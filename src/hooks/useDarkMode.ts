import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "darkMode";
const DARK = "dark-mode";
const LIGHT = "light-mode";

function readInitial(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== null) return JSON.parse(raw) as boolean;
  } catch {
    /* ignore */
  }
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  return false;
}

function applyToBody(dark: boolean) {
  const body = document.body;
  body.classList.add(dark ? DARK : LIGHT);
  body.classList.remove(dark ? LIGHT : DARK);
}

/**
 * Drop-in replacement for the old `use-dark-mode` package.
 * Uses the same localStorage key ("darkMode") and body classes
 * ("dark-mode" / "light-mode") that the FOUC bootstrap script in
 * index.html and all the SCSS rely on.
 */
export default function useDarkMode(initial = false) {
  const [value, setValue] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) !== null ? readInitial() : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    applyToBody(value);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  }, [value]);

  const toggle = useCallback(() => setValue((v) => !v), []);
  const enable = useCallback(() => setValue(true), []);
  const disable = useCallback(() => setValue(false), []);

  return { value, toggle, enable, disable, setValue };
}
