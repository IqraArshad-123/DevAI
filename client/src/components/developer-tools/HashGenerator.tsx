"use client";

import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clipboard,
  Hash,
  RotateCcw,
} from "lucide-react";

type HashAlgorithm = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

export default function HashGenerator() {
  const [input, setInput] = useState("");
  const [algorithm, setAlgorithm] =
    useState<HashAlgorithm>("SHA-256");
  const [hash, setHash] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const bufferToHex = (buffer: ArrayBuffer) => {
    return Array.from(new Uint8Array(buffer))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  };

  const generateHash = async () => {
    setHash("");
    setError("");
    setCopied(false);

    if (!input) {
      setError("Please enter text to generate a hash.");
      return;
    }

    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);

      const digest = await window.crypto.subtle.digest(
        algorithm,
        data
      );

      setHash(bufferToHex(digest));
    } catch (error) {
      console.error("Hash Error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to generate hash."
      );
    }
  };

  const clearAll = () => {
    setInput("");
    setHash("");
    setError("");
    setCopied(false);
  };

  const copyHash = async () => {
    if (!hash) return;

    try {
      await navigator.clipboard.writeText(hash);

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
            Hash Generator
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Generate cryptographic hashes from text directly in your browser.
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

      {/* Algorithm */}
      <div className="mb-6">

        <label className="mb-3 block text-sm font-medium text-slate-300">
          Hash Algorithm
        </label>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

          {(
            ["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as HashAlgorithm[]
          ).map((item) => (
            <button
              key={item}
              onClick={() => {
                setAlgorithm(item);
                setHash("");
                setError("");
                setCopied(false);
              }}
              className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                algorithm === item
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                  : "border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item}
            </button>
          ))}

        </div>

      </div>

      {/* Input */}
      <div>

        <div className="mb-2 flex items-center justify-between">

          <label className="text-sm font-medium text-slate-300">
            Input Text
          </label>

          {input && (
            <span className="text-xs text-slate-600">
              {input.length} characters
            </span>
          )}

        </div>

        <textarea
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
            setHash("");
            setError("");
            setCopied(false);
          }}
          placeholder={`Enter text to hash...

Example:
Hello Dev AI`}
          spellCheck={false}
          className="min-h-55 w-full resize-y rounded-2xl border border-white/10 bg-[#030712] p-4 font-mono text-sm leading-6 text-slate-200 outline-none transition placeholder:text-slate-700 focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20"
        />

      </div>

      {/* Generate Button */}
      <button
        onClick={generateHash}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:bg-blue-500 sm:w-auto"
      >
        <Hash className="h-4 w-4" />
        Generate Hash
      </button>

      {/* Error */}
      {error && (
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-4">

          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />

          <div>
            <p className="text-sm font-semibold text-red-300">
              Hash Error
            </p>

            <p className="mt-1 text-sm leading-6 text-red-400/70">
              {error}
            </p>
          </div>

        </div>
      )}

      {/* Hash Result */}
      {hash && (
        <div className="mt-6">

          <div className="mb-2 flex items-center justify-between">

            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />

              <label className="text-sm font-medium text-slate-300">
                Generated Hash
              </label>
            </div>

            <button
              onClick={copyHash}
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

          <div className="rounded-2xl border border-emerald-500/10 bg-[#030712] p-4">

            <p className="break-all font-mono text-sm leading-6 text-slate-200">
              {hash}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-600">
              <span>
                Algorithm: {algorithm}
              </span>

              <span>•</span>

              <span>
                Length: {hash.length} characters
              </span>
            </div>

          </div>

        </div>
      )}

    </section>
  );
}