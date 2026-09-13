"use client";

import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clipboard,
  RotateCcw,
} from "lucide-react";

export default function JsonValidator() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<
    "valid" | "invalid" | null
  >(null);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const validateJson = () => {
    setResult(null);
    setMessage("");

    if (!input.trim()) {
      setResult("invalid");
      setMessage("Please enter JSON to validate.");
      return;
    }

    try {
      JSON.parse(input);

      setResult("valid");
      setMessage("Valid JSON. Your JSON structure is correct.");
    } catch (error) {
      setResult("invalid");

      setMessage(
        error instanceof Error
          ? error.message
          : "Invalid JSON."
      );
    }
  };

  const clearAll = () => {
    setInput("");
    setResult(null);
    setMessage("");
    setCopied(false);
  };

  const copyInput = async () => {
    if (!input) return;

    try {
      await navigator.clipboard.writeText(input);

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
            JSON Validator
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Check whether your JSON is valid and correctly structured.
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

      {/* Input */}
      <div>

        <div className="mb-2 flex items-center justify-between">

          <label className="text-sm font-medium text-slate-300">
            JSON Input
          </label>

          <button
            onClick={copyInput}
            disabled={!input}
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-slate-400 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
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

        <textarea
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
            setResult(null);
            setMessage("");
          }}
          placeholder={`{
  "name": "Dev AI",
  "status": "active"
}`}
          spellCheck={false}
          className="min-h-75 w-full resize-y rounded-2xl border border-white/10 bg-[#030712] p-4 font-mono text-sm leading-6 text-slate-200 outline-none transition placeholder:text-slate-700 focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20"
        />

      </div>

      {/* Validate Button */}
      <button
        onClick={validateJson}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:bg-blue-500 sm:w-auto"
      >
        <CheckCircle2 className="h-4 w-4" />
        Validate JSON
      </button>

      {/* Result */}
      {result && (
        <div
          className={`mt-5 flex items-start gap-3 rounded-2xl border p-4 ${
            result === "valid"
              ? "border-emerald-500/20 bg-emerald-500/5"
              : "border-red-500/20 bg-red-500/5"
          }`}
        >
          {result === "valid" ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
          )}

          <div>
            <p
              className={`text-sm font-semibold ${
                result === "valid"
                  ? "text-emerald-300"
                  : "text-red-300"
              }`}
            >
              {result === "valid"
                ? "Valid JSON"
                : "Invalid JSON"}
            </p>

            <p
              className={`mt-1 text-sm leading-6 ${
                result === "valid"
                  ? "text-emerald-400/70"
                  : "text-red-400/70"
              }`}
            >
              {message}
            </p>
          </div>
        </div>
      )}

    </section>
  );
}