"use client";

import { useState } from "react";
import {
  Check,
  Clipboard,
  Code2,
  RotateCcw,
  Wand2,
} from "lucide-react";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const formatJson = () => {
    setError("");
    setOutput("");

    if (!input.trim()) {
      setError("Please enter JSON to format.");
      return;
    }

    try {
      const parsed = JSON.parse(input);

      setOutput(JSON.stringify(parsed, null, 2));
    } catch (err) {
      setError(
        err instanceof Error
          ? `Invalid JSON: ${err.message}`
          : "Invalid JSON."
      );
    }
  };

  const minifyJson = () => {
    setError("");
    setOutput("");

    if (!input.trim()) {
      setError("Please enter JSON to minify.");
      return;
    }

    try {
      const parsed = JSON.parse(input);

      setOutput(JSON.stringify(parsed));
    } catch (err) {
      setError(
        err instanceof Error
          ? `Invalid JSON: ${err.message}`
          : "Invalid JSON."
      );
    }
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
    setCopied(false);
  };

  const copyOutput = async () => {
    if (!output) return;

    try {
      await navigator.clipboard.writeText(output);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Copy Error:", err);
    }
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-white/3 p-5 shadow-2xl shadow-black/20 sm:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10">
            <Code2 className="h-5 w-5 text-violet-400" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white">
              JSON Formatter
            </h2>

            <p className="text-sm text-slate-500">
              Format and beautify your JSON data.
            </p>
          </div>
        </div>

        <button
          onClick={clearAll}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-400 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300"
        >
          <RotateCcw className="h-4 w-4" />
          Clear
        </button>
      </div>

      {/* Editor Grid */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Input */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-slate-300">
              JSON Input
            </label>

            <span className="text-xs text-slate-600">
              Paste JSON here
            </span>
          </div>

          <textarea
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
              setError("");
            }}
            placeholder={`{
  "name": "Dev AI",
  "type": "developer-tool"
}`}
            spellCheck={false}
            className="min-h-90 w-full resize-y rounded-2xl border border-white/10 bg-[#030712] p-4 font-mono text-sm leading-6 text-slate-200 outline-none transition placeholder:text-slate-700 focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20"
          />
        </div>

        {/* Output */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-slate-300">
              Formatted Output
            </label>

            <button
              onClick={copyOutput}
              disabled={!output}
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-slate-400 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
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

          <textarea
            value={output}
            readOnly
            placeholder="Formatted JSON will appear here..."
            spellCheck={false}
            className="min-h-90 w-full resize-y rounded-2xl border border-white/10 bg-[#030712] p-4 font-mono text-sm leading-6 text-emerald-300 outline-none placeholder:text-slate-700"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={formatJson}
          className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-900/20 transition hover:bg-violet-500"
        >
          <Wand2 className="h-4 w-4" />
          Format JSON
        </button>

        <button
          onClick={minifyJson}
          className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-300 transition hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-300"
        >
          Minify JSON
        </button>
      </div>
    </section>
  );
}