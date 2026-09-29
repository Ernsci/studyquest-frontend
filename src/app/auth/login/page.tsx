import type { Metadata } from "next";

import { AuthVisual } from "@/components/auth-visual";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div className="mx-auto grid min-h-[64vh] max-w-5xl items-center gap-8 md:grid-cols-[1fr_0.9fr] lg:gap-12">
      <AuthVisual
        blurb="Sign in to save your progress, revisit tricky questions, and keep building your skills."
        headline="Pick up where your"
        headlineAccent="curiosity left off."
        kicker="Your learning, in one place"
        points={[
          { icon: "→", title: "Progress that follows you", detail: "XP, streaks and completion sync across devices." },
          { icon: "→", title: "Honest feedback", detail: "Explanations after every answer — right or wrong." },
          { icon: "→", title: "Review that sticks", detail: "Spaced repetition brings back what you nearly forgot." },
        ]}
      />
      <LoginForm />
    </div>
  );
}
