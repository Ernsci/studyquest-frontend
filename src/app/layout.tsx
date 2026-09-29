import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

import { navigation, site, theme } from "@/config/app-config";
import { isDemoModeEnabled, publicEnv } from "@/config/env";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: `${site.name} — ${site.tagline}`, template: `%s · ${site.name}` },
  description: site.description,
  keywords: [...site.keywords],
  metadataBase: new URL(publicEnv.siteUrl),
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    siteName: site.name,
    locale: site.locale,
    type: "website",
  },
};

/**
 * Brand scale and font stacks live in `config/app-config.ts`; globals.css reads
 * them through these custom properties, so changing the palette is a one-file
 * edit.
 */
const themeVariables = {
  "--brand-50": theme.colors.brand[50],
  "--brand-100": theme.colors.brand[100],
  "--brand-200": theme.colors.brand[200],
  "--brand-300": theme.colors.brand[300],
  "--brand-400": theme.colors.brand[400],
  "--brand-500": theme.colors.brand[500],
  "--brand-600": theme.colors.brand[600],
  "--brand-700": theme.colors.brand[700],
  "--brand-800": theme.colors.brand[800],
  "--brand-900": theme.colors.brand[900],
  "--accent-400": theme.colors.accent[400],
  "--accent-500": theme.colors.accent[500],
  "--accent-600": theme.colors.accent[600],
  "--font-sans-stack": theme.fonts.sans,
  "--font-mono-stack": theme.fonts.mono,
} as CSSProperties;

export default function RootLayout({ children }: { children: ReactNode }) {
  const primaryNav = navigation.primary.filter((item) => !item.authRequired);

  return (
    <html lang={site.locale} style={themeVariables}>
      <body className="min-h-dvh antialiased">
        <a className="skip-link" href="#main">
          Skip to content
        </a>

        <header className="sticky top-0 z-40 border-b border-[rgb(var(--line))] bg-[rgb(var(--surface))]/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
            <Link className="flex items-center gap-2 font-bold" href="/">
              <span
                aria-hidden
                className="grid size-8 place-items-center rounded-lg bg-brand-500 text-sm text-white"
              >
                {site.shortName}
              </span>
              <span>{site.name}</span>
            </Link>

            <nav aria-label="Primary" className="hidden items-center gap-5 text-sm sm:flex">
              {primaryNav.map((item) => (
                <Link key={item.href} className="muted hover:text-brand-600" href={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <main id="main" className="mx-auto w-full max-w-6xl px-4 py-10">
          {isDemoModeEnabled() ? (
            <p
              className="mb-6 rounded-xl border border-[rgb(var(--line))] bg-[var(--brand-tint)] px-4 py-3 text-sm"
              role="status"
            >
              Demo mode: bundled sample lessons and a shared demo learner. Sign-in appears once
              Supabase is configured.
            </p>
          ) : null}
          {children}
        </main>

        <footer className="mt-16 border-t border-[rgb(var(--line))]">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
            {site.footer.columns.map((column) => (
              <div key={column.title}>
                <h2 className="text-sm font-semibold">{column.title}</h2>
                <ul className="muted mt-3 space-y-2 text-sm">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link className="hover:text-brand-600" href={link.href}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="muted mx-auto max-w-6xl px-4 pb-8 text-xs">{site.footer.blurb}</p>
        </footer>
      </body>
    </html>
  );
}
