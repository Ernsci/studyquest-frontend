"use client";

import { useEffect, useRef, useState } from "react";

const RUNNER_DOCUMENT = `<!doctype html><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval'; worker-src blob:; connect-src 'none'; img-src data:; style-src 'unsafe-inline'"><script>
addEventListener('message', function(event) {
  if (event.source !== parent || !event.data || event.data.type !== 'run') return;
  const workerCode = "onmessage = function(event) { const lines = []; const format = value => { try { return typeof value === 'string' ? value : JSON.stringify(value); } catch { return String(value); } }; const logger = (...values) => lines.push(values.map(format).join(' ')); try { new Function('console', 'fetch', 'Worker', 'SharedWorker', 'XMLHttpRequest', 'WebSocket', 'EventSource', event.data)({ log: logger, info: logger, warn: logger, error: logger }, undefined, undefined, undefined, undefined, undefined, undefined); } catch (error) { lines.push(error instanceof Error ? error.name + ': ' + error.message : String(error)); } postMessage(lines.length ? lines : ['Program finished with no output.']); };";
  const worker = new Worker(URL.createObjectURL(new Blob([workerCode], { type: 'text/javascript' })));
  const killTimer = setTimeout(function() { worker.terminate(); parent.postMessage({ type: 'output', lines: ['Stopped after 2 seconds. Check for a loop that never ends.'] }, '*'); }, 2000);
  worker.onmessage = function(result) { clearTimeout(killTimer); worker.terminate(); parent.postMessage({ type: 'output', lines: result.data }, '*'); };
  worker.onerror = function() { clearTimeout(killTimer); worker.terminate(); parent.postMessage({ type: 'output', lines: ['Could not run this code. Check the syntax and try again.'] }, '*'); };
  worker.postMessage(event.data.code);
});
<\/script>`;

const STARTER = `const greeting = "Hello, StudyQuest!";
console.log(greeting);

const scores = [82, 95, 71];
const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
console.log("Average score:", average);`;

export function Playground() {
  const frame = useRef<HTMLIFrameElement>(null);
  const [code, setCode] = useState(STARTER);
  const [output, setOutput] = useState<string[]>([]);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.source !== frame.current?.contentWindow || event.data?.type !== "output") return;
      setOutput(Array.isArray(event.data.lines) ? event.data.lines.filter((line: unknown): line is string => typeof line === "string").slice(0, 100) : []);
      setRunning(false);
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  function run() {
    setRunning(true);
    setOutput(["Running…"]);
    frame.current?.contentWindow?.postMessage({ type: "run", code: code.slice(0, 12000) }, "*");
  }

  return <div className="grid gap-4 lg:grid-cols-2">
    <section className="card overflow-hidden"><div className="flex items-center justify-between border-b px-4 py-3"><h2 className="text-sm font-semibold">Editor</h2><span className="muted text-xs">JavaScript</span></div><label className="sr-only" htmlFor="playground-code">JavaScript code</label><textarea className="min-h-[24rem] w-full resize-y bg-[rgb(var(--code-surface))] p-4 font-mono text-sm leading-6 focus-visible:outline-none" id="playground-code" onChange={(event) => setCode(event.target.value.slice(0, 12000))} spellCheck={false} value={code} /><div className="flex items-center justify-between border-t px-4 py-3"><span className="muted text-xs">Runs in a restricted sandbox</span><button aria-busy={running} className="btn btn-primary inline-flex items-center gap-2" disabled={running} onClick={run} type="button">{running ? <><svg aria-hidden="true" className="size-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" d="M4 12a8 8 0 0 1 8-8" stroke="currentColor" strokeLinecap="round" strokeWidth="4" /></svg><span>Running code...</span></> : "Run code"}</button></div></section>
    <section aria-live="polite" className="card overflow-hidden"><div className="border-b px-4 py-3"><h2 className="text-sm font-semibold">Output</h2></div><pre className="min-h-[24rem] whitespace-pre-wrap p-4 font-mono text-sm leading-6">{output.length ? output.join("\n") : <span className="muted">Run your code to see the output here.</span>}</pre></section>
    <iframe aria-hidden className="hidden" ref={frame} sandbox="allow-scripts" srcDoc={RUNNER_DOCUMENT} title="Isolated JavaScript runner" />
  </div>;
}
