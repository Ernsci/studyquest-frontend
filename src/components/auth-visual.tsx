type AuthVisualPoint = { icon: string; title: string; detail: string };

type AuthVisualProps = {
  kicker: string;
  headline: string;
  headlineAccent: string;
  blurb: string;
  points: AuthVisualPoint[];
};

/**
 * Decorative side panel for the auth screens: aurora orbs, a display headline and
 * three value props. Pure presentational markup — no client hooks — so the server
 * renders it and only the form ships as client JS.
 */
export function AuthVisual({ kicker, headline, headlineAccent, blurb, points }: AuthVisualProps) {
  return (
    <section className="relative isolate flex flex-col justify-between overflow-hidden rounded-3xl border border-[rgb(var(--line))] bg-[rgb(var(--surface-raised))] p-6 sm:p-8 lg:p-10">
      <span aria-hidden className="orb orb-a" />
      <span aria-hidden className="orb orb-b" />

      <div className="stagger relative">
        <p className="kicker">{kicker}</p>
        <h1 className="mt-4 max-w-md text-3xl font-bold leading-[1.08] tracking-tight sm:text-4xl lg:text-[2.75rem]">
          {headline} <span className="text-gradient">{headlineAccent}</span>
        </h1>
        <p className="muted mt-4 max-w-md leading-7">{blurb}</p>
      </div>

      <ul className="relative mt-8 hidden gap-4 md:grid lg:mt-10">
        {points.map((point) => (
          <li className="flex items-start gap-3" key={point.title}>
            <span
              aria-hidden
              className="grid size-8 shrink-0 place-items-center rounded-full bg-[var(--brand-tint)] text-sm text-[var(--brand-600)] dark:text-[var(--brand-300)]"
            >
              {point.icon}
            </span>
            <span>
              <span className="block text-sm font-semibold">{point.title}</span>
              <span className="muted block text-sm">{point.detail}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}