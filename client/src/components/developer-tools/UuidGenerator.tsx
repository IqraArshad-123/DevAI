"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Clipboard,
  Copy,
  RefreshCw,
  RotateCcw,
} from "lucide-react";

export default function UuidGenerator() {
  const [uuid, setUuid] = useState("");
  const [copied, setCopied] = useState(false);

  const generateUuid = () => {
    const newUuid = crypto.randomUUID();

    setUuid(newUuid);
    setCopied(false);
  };

  const clearAll = () => {
    setUuid("");
    setCopied(false);
  };

  const copyUuid = async () => {
    if (!uuid) return;

    try {
      await navigator.clipboard.writeText(uuid);

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
            UUID Generator
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Generate a unique UUID v4 instantly in your browser.
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

      {/* UUID Display */}
      <div>

        <div className="mb-2 flex items-center justify-between">

          <label className="text-sm font-medium text-slate-300">
            Generated UUID
          </label>

          <button
            onClick={copyUuid}
            disabled={!uuid}
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

        <div className="flex min-h-30 items-center justify-center rounded-2xl border border-white/10 bg-[#030712] p-6">

          {uuid ? (
            <p className="break-all text-center font-mono text-base leading-7 text-slate-200 sm:text-lg">
              {uuid}
            </p>
          ) : (
            <p className="text-center text-sm text-slate-700">
              Your generated UUID will appear here.
            </p>
          )}

        </div>

      </div>

      {/* Generate Button */}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">

        <button
          onClick={generateUuid}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:bg-blue-500 sm:w-auto"
        >
          {uuid ? (
            <RefreshCw className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}

          {uuid ? "Generate New UUID" : "Generate UUID"}
        </button>

      </div>

      {/* Success Message */}
      {uuid && (
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">

          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />

          <div>
            <p className="text-sm font-semibold text-emerald-300">
              UUID Generated
            </p>

            <p className="mt-1 text-sm leading-6 text-emerald-400/70">
              A unique UUID v4 has been generated successfully.
            </p>
          </div>

        </div>
      )}

    </section>
  );
}