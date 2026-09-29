import type { Metadata } from "next";

import { Playground } from "./playground";

export const metadata: Metadata = { title: "Playground" };

export default function PlaygroundPage() {
  return <div className="space-y-7">
    <header className="max-w-2xl space-y-3"><p className="kicker">JavaScript playground</p><h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Try an idea. See what happens.</h1><p className="muted text-lg leading-7">Write JavaScript and run it in an isolated browser frame. Nothing is saved.</p></header>
    <Playground />
  </div>;
}
