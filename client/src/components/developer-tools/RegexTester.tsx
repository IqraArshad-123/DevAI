"use client";

import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clipboard,
  RotateCcw,
} from "lucide-react";

export default function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [testText, setTestText] = useState("");
  const [global, setGlobal] = useState(true);
  const [caseInsensitive, setCaseInsensitive] = useState(false);
  const [multiline, setMultiline] = useState(false);
  const [matches, setMatches] = useState<string[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [tested, setTested] = useState(false);
  const [copied, setCopied] = useState(false);

  const testRegex = () => {
    setMatches([]);
    setGroups([]);
    setError("");
    setCopied(false);
    setTested(false);

    if (!pattern.trim()) {
      setError("Please enter a regular expression.");
      return;
    }

    if (!testText) {
      setError("Please enter text to test.");
      return;
    }

    try {
      const flags = `${global ? "g" : ""}${caseInsensitive ? "i" : ""}${
        multiline ? "m" : ""
      }`;

      const regex = new RegExp(pattern, flags);

      const foundMatches: string[] = [];
      const foundGroups: string[] = [];

      if (global) {
        const regexMatches = Array.from(testText.matchAll(regex));

        regexMatches.forEach((match) => {
          foundMatches.push(match[0]);

          if (match.length > 1) {
            match.slice(1).forEach((group) => {
              if (group !== undefined) {
                foundGroups.push(group);
              }
            });
          }
        });
      } else {
        const match = regex.exec(testText);

        if (match) {
          foundMatches.push(match[0]);

          if (match.length > 1) {
            match.slice(1).forEach((group) => {
              if (group !== undefined) {
                foundGroups.push(group);
              }
            });
          }
        }
      }

      setMatches(foundMatches);
      setGroups(foundGroups);
      setTested(true);
    } catch (error) {
      console.error("Regex Error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Invalid regular expression."
      );
    }
  };

  const clearAll = () => {
    setPattern("");
    setTestText("");
    setMatches([]);
    setGroups([]);
    setError("");
    setTested(false);
    setCopied(false);
  };

  const copyMatches = async () => {
    if (!matches.length) return;

    try {
      await navigator.clipboard.writeText(matches.join("\n"));

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy Error:", error);
    }
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-white/3 p-5 shadow-2xl shadow-black/20 sm:p-6">

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h2 className="text-lg font-semibold text-white">
            Regex Tester
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Test regular expressions against text directly in your browser.
          </p>
        </div>

        <button
          onClick={clearAll}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-400 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300"
        >
          <RotateCcw className="h-4 w-4" />
          Clear
        </button>

      </div>

      {/* Regex Pattern */}
      <div>

        <div className="mb-2 flex items-center justify-between">

          <label className="text-sm font-medium text-slate-300">
            Regex Pattern
          </label>

          <span className="text-xs text-slate-600">
            JavaScript RegExp
          </span>

        </div>

        <input
          type="text"
          value={pattern}
          onChange={(event) => {
            setPattern(event.target.value);
            setError("");
            setTested(false);
            setMatches([]);
            setGroups([]);
          }}
          placeholder="e.g. \b[\w.-]+@[\w.-]+\.\w+\b"
          spellCheck={false}
          className="w-full rounded-2xl border border-white/10 bg-[#030712] p-4 font-mono text-sm leading-6 text-slate-200 outline-none transition placeholder:text-slate-700 focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20"
        />

      </div>

      {/* Flags */}
      <div className="mt-5">

        <label className="mb-3 block text-sm font-medium text-slate-300">
          Regex Flags
        </label>

        <div className="flex flex-wrap gap-3">

          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-400 transition hover:bg-white/10 hover:text-white">
            <input
              type="checkbox"
              checked={global}
              onChange={(event) => setGlobal(event.target.checked)}
              className="h-4 w-4 accent-blue-600"
            />
            Global
            <span className="font-mono text-xs text-slate-600">
              g
            </span>
          </label>

          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-400 transition hover:bg-white/10 hover:text-white">
            <input
              type="checkbox"
              checked={caseInsensitive}
              onChange={(event) =>
                setCaseInsensitive(event.target.checked)
              }
              className="h-4 w-4 accent-blue-600"
            />
            Case Insensitive
            <span className="font-mono text-xs text-slate-600">
              i
            </span>
          </label>

          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-400 transition hover:bg-white/10 hover:text-white">
            <input
              type="checkbox"
              checked={multiline}
              onChange={(event) => setMultiline(event.target.checked)}
              className="h-4 w-4 accent-blue-600"
            />
            Multiline
            <span className="font-mono text-xs text-slate-600">
              m
            </span>
          </label>

        </div>

      </div>

      {/* Test Text */}
      <div className="mt-5">

        <div className="mb-2 flex items-center justify-between">

          <label className="text-sm font-medium text-slate-300">
            Test Text
          </label>

          {testText && (
            <span className="text-xs text-slate-600">
              {testText.length} characters
            </span>
          )}

        </div>

        <textarea
          value={testText}
          onChange={(event) => {
            setTestText(event.target.value);
            setError("");
            setTested(false);
            setMatches([]);
            setGroups([]);
          }}
          placeholder={`Enter text to test your regex against...

Example:
Contact us at hello@example.com
or support@devai.com`}
          spellCheck={false}
          className="min-h-55 w-full resize-y rounded-2xl border border-white/10 bg-[#030712] p-4 font-mono text-sm leading-6 text-slate-200 outline-none transition placeholder:text-slate-700 focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20"
        />

      </div>

      {/* Test Button */}
      <button
        onClick={testRegex}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:bg-blue-500 sm:w-auto"
      >
        <CheckCircle2 className="h-4 w-4" />
        Test Regex
      </button>

      {/* Error */}
      {error && (
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-4">

          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />

          <div>
            <p className="text-sm font-semibold text-red-300">
              Regex Error
            </p>

            <p className="mt-1 text-sm leading-6 text-red-400/70">
              {error}
            </p>
          </div>

        </div>
      )}

      {/* Result */}
      {tested && !error && (
        <div className="mt-6">

          {/* Match Summary */}
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">

            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />

            <div>
              <p className="text-sm font-semibold text-emerald-300">
                Regex Test Complete
              </p>

              <p className="mt-1 text-sm leading-6 text-emerald-400/70">
                {matches.length === 0
                  ? "No matches found."
                  : `${matches.length} match${
                      matches.length === 1 ? "" : "es"
                    } found.`}
              </p>
            </div>

          </div>

          {/* Matches */}
          {matches.length > 0 && (
            <div className="mt-6">

              <div className="mb-2 flex items-center justify-between">

                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-slate-300">
                    Matches
                  </label>

                  <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-xs text-blue-400">
                    {matches.length}
                  </span>
                </div>

                <button
                  onClick={copyMatches}
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-slate-400 transition hover:bg-white/5 hover:text-white"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Clipboard className="h-3.5 w-3.5" />
                      Copy
                    </>
                  )}
                </button>

              </div>

              <div className="max-h-65 overflow-y-auto rounded-2xl border border-white/10 bg-[#030712] p-4">

                <div className="space-y-2">
                  {matches.map((match, index) => (
                    <div
                      key={`${match}-${index}`}
                      className="rounded-xl border border-white/5 bg-white/3 px-4 py-3"
                    >
                      <div className="mb-1 text-xs text-slate-600">
                        Match {index + 1}
                      </div>

                      <code className="break-all text-sm text-slate-200">
                        {match}
                      </code>
                    </div>
                  ))}
                </div>

              </div>

            </div>
          )}

          {/* Capture Groups */}
          {groups.length > 0 && (
            <div className="mt-6">

              <div className="mb-2 flex items-center gap-2">
                <label className="text-sm font-medium text-slate-300">
                  Capture Groups
                </label>

                <span className="rounded-md bg-violet-500/10 px-2 py-0.5 text-xs text-violet-400">
                  {groups.length}
                </span>
              </div>

              <div className="space-y-2 rounded-2xl border border-white/10 bg-[#030712] p-4">

                {groups.map((group, index) => (
                  <div
                    key={`${group}-${index}`}
                    className="flex flex-col gap-1 rounded-xl border border-white/5 bg-white/3 px-4 py-3 sm:flex-row sm:items-center sm:gap-4"
                  >
                    <span className="text-xs text-slate-600">
                      Group {index + 1}
                    </span>

                    <code className="break-all text-sm text-slate-200">
                      {group}
                    </code>
                  </div>
                ))}

              </div>

            </div>
          )}

        </div>
      )}

    </section>
  );
}