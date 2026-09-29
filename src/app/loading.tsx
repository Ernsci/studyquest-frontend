export default function Loading() {
  return <div aria-live="polite" className="mx-auto grid min-h-[50vh] max-w-3xl place-content-center justify-items-center gap-4 text-center" role="status">
    <svg aria-hidden="true" className="size-9 animate-spin text-brand-600" fill="none" viewBox="0 0 24 24"><circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-90" d="M4 12a8 8 0 0 1 8-8" stroke="currentColor" strokeLinecap="round" strokeWidth="4" /></svg>
    <div><p className="font-semibold">Loading StudyQuest...</p><p className="muted mt-1 text-sm">Getting your learning space ready.</p></div>
  </div>;
}
