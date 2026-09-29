"use client";

/**
 * Light/dark switch. The `.dark` class lives on <html> (set before first paint by
 * the inline script in `src/app/layout.tsx`); the icon swap itself is pure CSS so
 * there is no hydration flash. The choice is persisted under `sq-theme`.
 */
export function ThemeToggle() {
  function toggle() {
    const next = document.documentElement.classList.contains("dark") ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("sq-theme", next);
    } catch (cause) {
      console.warn("[studyquest:theme] could not persist theme preference:", cause);
    }
  }

  return (
    <button
      aria-label="Toggle dark mode"
      className="theme-toggle"
      onClick={toggle}
      title="Toggle dark mode"
      type="button"
    >
      <svg
        aria-hidden
        className="icon-sun"
        fill="none"
        height="18"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="18"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
      <svg
        aria-hidden
        className="icon-moon"
        fill="none"
        height="18"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="18"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z" />
      </svg>
    </button>
  );
}