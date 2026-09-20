"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "theme";
const THEME_CHANGE_EVENT = "themechange";

// The dark class on <html> is genuine external mutable state (set by the
// blocking script in app/layout.tsx before this component ever mounts), not
// something to mirror into local state via useEffect+setState — that's
// exactly the synchronous-setState-in-an-effect anti-pattern this codebase's
// React Compiler lint already caught once, in useAnimatedNumber.
// useSyncExternalStore reads it correctly across the server/client boundary:
// getServerSnapshot answers "light" (this app's default) during SSR and the
// hydration pass, then getSnapshot takes over for the real DOM state.
function subscribe(callback: () => void) {
  window.addEventListener(THEME_CHANGE_EVENT, callback);
  return () => window.removeEventListener(THEME_CHANGE_EVENT, callback);
}

function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerSnapshot() {
  return false;
}

// Light is the default for every visitor, matching the source site's own
// page — this only ever turns dark when a visitor explicitly opts in, never
// from `prefers-color-scheme`. The choice persists via localStorage, and a
// blocking inline script in the document head (see app/layout.tsx) applies
// it before first paint so returning dark-mode visitors don't see a flash
// of light first.
export function ThemeToggle() {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    } catch {
      // Storage unavailable (private browsing, etc.) — the toggle still
      // works for the session, it just won't persist across reloads.
    }
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="rounded-sm p-2 text-ink hover:bg-stone-900/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:text-cream dark:hover:bg-cream/10 dark:focus-visible:ring-offset-ink"
    >
      {isDark ? (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.5A8.5 8.5 0 1 1 11.5 3a7 7 0 0 0 9.5 9.5Z" />
        </svg>
      ) : (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4.5" />
          <path d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
        </svg>
      )}
    </button>
  );
}
