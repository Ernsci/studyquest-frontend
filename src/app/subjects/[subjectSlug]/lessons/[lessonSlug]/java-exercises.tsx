"use client";

import { useState } from "react";

const exercises: Record<string, { title: string; prompt: string; starter: string; solution: string; note: string }[]> = {
  "variables-and-types": [{ title: "Convert minutes to seconds", prompt: "Complete the method so it returns the number of seconds. Keep the result as an integer.", starter: "static int toSeconds(int minutes) {\n    // your code\n}", solution: "static int toSeconds(int minutes) {\n    return minutes * 60;\n}", note: "Try an input such as 3 minutes and check that the result is 180." }],
  "loops-and-iteration": [{ title: "Sum the scores", prompt: "Write a loop that totals every value in the array and returns the sum.", starter: "static int sum(int[] scores) {\n    int total = 0;\n    // your code\n    return total;\n}", solution: "static int sum(int[] scores) {\n    int total = 0;\n    for (int score : scores) {\n        total += score;\n    }\n    return total;\n}", note: "An empty array should naturally return 0." }],
  "methods-and-overloading": [{ title: "Find the larger number", prompt: "Implement a method that returns the larger of two integers without using Math.max.", starter: "static int larger(int first, int second) {\n    // your code\n}", solution: "static int larger(int first, int second) {\n    return first >= second ? first : second;\n}", note: "Consider what should happen when both values are equal." }],
  "arrays-and-copying": [{ title: "Count passing scores", prompt: "Return how many scores are at least 70.", starter: "static int countPassing(int[] scores) {\n    int count = 0;\n    // your code\n    return count;\n}", solution: "static int countPassing(int[] scores) {\n    int count = 0;\n    for (int score : scores) {\n        if (score >= 70) count++;\n    }\n    return count;\n}", note: "Test the boundary value 70 as well as a score below it." }],
  "collections-list-set-map": [{ title: "Count words", prompt: "Use a Map to count how many times each word appears in a list.", starter: "Map<String, Integer> counts = new HashMap<>();\nfor (String word : words) {\n    // update this word's count\n}", solution: "Map<String, Integer> counts = new HashMap<>();\nfor (String word : words) {\n    counts.merge(word, 1, Integer::sum);\n}", note: "For [\"java\", \"code\", \"java\"], java should have a count of 2." }],
  "optional-null-safety": [{ title: "Normalize a display name", prompt: "Turn an Optional name into a trimmed display value, using \"Learner\" when it is missing or blank.", starter: "String label = nickname\n    // finish the Optional pipeline\n    ;", solution: "String label = nickname\n    .map(String::trim)\n    .filter(name -> !name.isEmpty())\n    .orElse(\"Learner\");", note: "Avoid calling Optional.get() without checking it first." }],
  "capstone-java-learning-tracker": [{ title: "Group study time", prompt: "Add each session's minutes to a total grouped by its subject.", starter: "Map<String, Integer> totals = new HashMap<>();\nfor (StudySession session : sessions) {\n    // update the subject total\n}", solution: "Map<String, Integer> totals = new HashMap<>();\nfor (StudySession session : sessions) {\n    totals.merge(session.subject(), session.minutes(), Integer::sum);\n}", note: "Integer::sum gives merge a rule for combining a new value with an existing total." }],
};

export function JavaExercises({ lessonSlug }: { lessonSlug: string }) {
  const items = exercises[lessonSlug];
  const [code, setCode] = useState("");
  const [showSolution, setShowSolution] = useState(false);
  if (!items?.length) return null;
  const exercise = items[0];

  return <section aria-labelledby="java-exercise-title" className="card space-y-4 p-5">
    <div><p className="kicker">Java coding exercise</p><h2 className="mt-1 text-xl font-bold" id="java-exercise-title">{exercise.title}</h2><p className="muted mt-2 text-sm leading-6">{exercise.prompt}</p></div>
    <label className="sr-only" htmlFor="java-exercise-code">Your Java solution</label>
    <textarea autoCapitalize="off" autoCorrect="off" className="min-h-48 w-full rounded-xl border bg-[rgb(var(--code-surface))] p-4 font-mono text-sm leading-6" id="java-exercise-code" onChange={(event) => setCode(event.target.value)} placeholder={exercise.starter} spellCheck={false} value={code} />
    <p className="muted text-sm">Write your solution, then compare it with the reference. This practice editor does not compile or run Java code.</p>
    <button aria-expanded={showSolution} className="btn btn-ghost" onClick={() => setShowSolution((value) => !value)} type="button">{showSolution ? "Hide reference solution" : "Show reference solution"}</button>
    {showSolution ? <div className="space-y-3" aria-live="polite"><pre className="overflow-x-auto rounded-xl bg-[rgb(var(--code-surface))] p-4 text-sm leading-6"><code>{exercise.solution}</code></pre><p className="muted text-sm">{exercise.note}</p></div> : null}
  </section>;
}
