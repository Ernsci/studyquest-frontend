import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

import { SiteNav } from "@/components/site-nav";
import { navigation, site, theme } from "@/config/app-config";
import { isDemoModeEnabled, isSupabaseConfigured, publicEnv } from "@/config/env";
import { createSupabaseServer } from "@/lib/supabase/server";
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


const displayFont = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});
const bodyFont = Instrument_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});
const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-code",
});


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
  "--font-sans-stack": `var(--font-body), ${theme.fonts.sans}`,
  "--font-mono-stack": `var(--font-code), ${theme.fonts.mono}`,
  "--font-display-stack": `var(--font-heading), ${theme.fonts.display}`,
} as CSSProperties;


const themeScript = `(function(){try{var stored=localStorage.getItem("sq-theme");var fallback=${JSON.stringify(
  theme.defaultMode,
)};var mode=stored==="light"||stored==="dark"?stored:fallback;if(mode==="system"){mode=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.classList.toggle("dark",mode==="dark")}catch(error){document.documentElement.classList.add("dark")}})();`;

export default async function RootLayout({ children }: { children: ReactNode }) {
  let signedIn = false;
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServer();
      const { data } = await supabase.auth.getUser();
      signedIn = Boolean(data.user);
    } catch {
      signedIn = false;
    }
  }
  const navItems = navigation.primary
    .filter((item) => !item.authRequired || signedIn)
    .map((item) => ({ label: item.label, href: item.href }));

  return (
    <html
      lang={site.locale}
      className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable}`}
      style={themeVariables}
    >
      <body className="min-h-dvh antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <a className="skip-link" href="#main">
          Skip to content
        </a>

        <header className="sticky top-0 z-40 border-b border-[rgb(var(--line))] bg-[rgb(var(--surface))]/80 backdrop-blur-xl">
          <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
            <Link className="group flex items-center gap-2.5" href="/">
              <span
                aria-hidden
                className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-700 text-sm font-bold text-white shadow-lg shadow-brand-500/30 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105"
              >
                {site.shortName}
              </span>
              <span className="text-[1.05rem] font-bold tracking-tight">{site.name}</span>
            </Link>

            <SiteNav items={navItems} showSignIn={!signedIn} showThemeToggle={theme.toggleEnabled} />
          </div>
        </header>

        <main id="main" className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
          {isDemoModeEnabled() ? (
            <p
              className="animate-rise mb-8 rounded-xl border border-[rgb(var(--line))] bg-[var(--brand-tint)] px-4 py-3 text-sm"
              role="status"
            >
              Demo mode: bundled sample lessons and a shared demo learner. Sign-in appears once
              Supabase is configured.
            </p>
          ) : null}
          {children}
        </main>

        <footer className="relative border-t border-[rgb(var(--line))] bg-[rgb(var(--surface-sunken))]/60">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Link className="flex items-center gap-2.5" href="/">
                <span
                  aria-hidden
                  className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-700 text-xs font-bold text-white"
                >
                  {site.shortName}
                </span>
                <span className="font-bold tracking-tight">{site.name}</span>
              </Link>
              <p className="muted mt-4 max-w-xs text-sm leading-6">{site.footer.blurb}</p>
              <span className="chip mt-4">
                <span aria-hidden className="pulse-dot" />
                Learn a little every day
              </span>
            </div>

            {site.footer.columns.map((column) => (
              <div key={column.title}>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-[rgb(var(--text-muted))]">
                  {column.title}
                </h2>
                <ul className="mt-3 space-y-1.5 text-sm">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link className="link-underline muted inline-block py-0.5" href={link.href}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-[rgb(var(--line))]">
            <p className="muted mx-auto max-w-6xl px-4 py-5 text-xs">
              © {new Date().getFullYear()} {site.name} — built for curious minds.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
