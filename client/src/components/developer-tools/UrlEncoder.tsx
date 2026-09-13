"use client";

import { useState } from "react";
import {
  AlertCircle,
  ArrowDownUp,
  CheckCircle2,
  Clipboard,
  RotateCcw,
} from "lucide-react";

export default function UrlEncoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const processUrl = () => {
    setOutput("");
    setError("");
    setCopied(false);

    if (!input.trim()) {
      setError("Please enter a URL or text to process.");
      return;
    }

    try {
      const processed =
        mode === "encode"
          ? encodeURIComponent(input)
          : decodeURIComponent(input);

      setOutput(processed);
    } catch (error) {
      console.error("URL Error:", error);

      setError(
        mode === "encode"
          ? "Unable to encode the provided text."
          : "Invalid URL-encoded input. Please check your value."
      );
    }
  };

  const switchMode = () => {
    setMode((currentMode) =>
      currentMode === "encode" ? "decode" : "encode"
    );

    setInput("");
    setOutput("");
    setError("");
    setCopied(false);
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
            URL Encoder / Decoder
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Encode URLs and text or decode URL-encoded values instantly.
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

      {/* Mode Switch */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">

        <button
          onClick={() => {
            setMode("encode");
            setInput("");
            setOutput("");
            setError("");
            setCopied(false);
          }}
          className={`flex flex-1 items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition ${
            mode === "encode"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
              : "border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
          }`}
        >
          Encode URL
        </button>

        <button
          onClick={() => {
            setMode("decode");
            setInput("");
            setOutput("");
            setError("");
            setCopied(false);
          }}
          className={`flex flex-1 items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition ${
            mode === "decode"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
              : "border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
          }`}
        >
          Decode URL
        </button>

      </div>

      {/* Input */}
      <div>

        <div className="mb-2 flex items-center justify-between">

          <label className="text-sm font-medium text-slate-300">
            {mode === "encode" ? "URL / Text Input" : "Encoded URL Input"}
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
            setOutput("");
            setError("");
            setCopied(false);
          }}
          placeholder={
            mode === "encode"
              ? "https://example.com/search?q=hello world"
              : "https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world"
          }
          spellCheck={false}
          className="min-h-55 w-full resize-y rounded-2xl border border-white/10 bg-[#030712] p-4 font-mono text-sm leading-6 text-slate-200 outline-none transition placeholder:text-slate-700 focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20"
        />

      </div>

      {/* Process Buttons */}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">

        <button
          onClick={processUrl}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:bg-blue-500 sm:w-auto"
        >
          {mode === "encode" ? "Encode URL" : "Decode URL"}
        </button>

        <button
          onClick={switchMode}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white sm:w-auto"
        >
          <ArrowDownUp className="h-4 w-4" />
          Switch Mode
        </button>

      </div>

      {/* Error */}
      {error && (
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-4">

          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />

          <div>
            <p className="text-sm font-semibold text-red-300">
              Unable to Process
            </p>

            <p className="mt-1 text-sm leading-6 text-red-400/70">
              {error}
            </p>
          </div>

        </div>
      )}

      {/* Output */}
      {output && (
        <div className="mt-6">

          <div className="mb-2 flex items-center justify-between">

            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />

              <label className="text-sm font-medium text-slate-300">
                {mode === "encode"
                  ? "Encoded URL"
                  : "Decoded URL"}
              </label>
            </div>

            <button
              onClick={copyOutput}
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

          <textarea
            value={output}
            readOnly
            spellCheck={false}
            className="min-h-45 w-full resize-y rounded-2xl border border-emerald-500/10 bg-[#030712] p-4 font-mono text-sm leading-6 text-slate-200 outline-none"
          />

        </div>
      )}

    </section>
  );
}