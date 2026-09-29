"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { ThemeToggle } from "./theme-toggle";

export type SiteNavItem = { label: string; href: string };

type SiteNavProps = {
  items: SiteNavItem[];
  /** The "Sign in" CTA is hidden on auth screens and when there is nothing to sign in to. */
  showSignIn?: boolean;
  /** Wired to `theme.toggleEnabled` in app-config. */
  showThemeToggle?: boolean;
};

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Header navigation: animated desktop links + a disclosure-based mobile menu.
 * Owns its keyboard behaviour (Escape closes) and closes on route change.
 */
export function SiteNav({ items, showSignIn = true, showThemeToggle = true }: SiteNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuId = "primary-mobile-nav";

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const signInVisible = showSignIn && !pathname.startsWith("/auth");

  return <div className="flex items-center gap-2">
      <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
        {items.map((item) => (
          <Link
            aria-current={isActivePath(pathname, item.href) ? "page" : undefined}
            className="nav-link px-2.5 py-1.5 text-sm font-medium"
            href={item.href}
            key={item.href}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {signInVisible ? (
        <Link className="btn btn-primary hidden px-4 py-2 text-sm md:inline-flex" href="/auth/login">
          Sign in
        </Link>
      ) : null}

      {showThemeToggle ? <ThemeToggle /> : null}

      <button
        aria-controls={menuId}
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        className="menu-button md:hidden"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <span aria-hidden />
        <span aria-hidden />
        <span aria-hidden />
      </button>

      {open ? (
        <div
          className="animate-rise absolute inset-x-0 top-full border-b border-[rgb(var(--line))] bg-[rgb(var(--surface))]/95 backdrop-blur-lg md:hidden"
          id={menuId}
        >
          <nav aria-label="Primary mobile" className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4">
            {items.map((item) => (
              <Link
                aria-current={isActivePath(pathname, item.href) ? "page" : undefined}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-[rgb(var(--text-muted))] transition hover:bg-[rgb(var(--surface-sunken))] hover:text-[rgb(var(--text))] aria-[current=page]:bg-[rgb(var(--surface-sunken))] aria-[current=page]:text-[rgb(var(--text))]"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
            {signInVisible ? (
              <Link className="btn btn-primary mt-2 w-full" href="/auth/login">
                Sign in
              </Link>
            ) : null}
          </nav>
        </div>
      ) : null}
    </div>;
}