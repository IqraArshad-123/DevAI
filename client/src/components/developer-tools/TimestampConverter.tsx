"use client";

import { useState } from "react";
import {
  AlertCircle,
  CalendarClock,
  CheckCircle2,
  Clipboard,
  RotateCcw,
} from "lucide-react";

export default function TimestampConverter() {
  const [timestamp, setTimestamp] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [unit, setUnit] = useState<"seconds" | "milliseconds">(
    "seconds"
  );
  const [timestampResult, setTimestampResult] = useState("");
  const [dateResult, setDateResult] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<"timestamp" | "date" | null>(
    null
  );

  const convertTimestampToDate = () => {
    setTimestampResult("");
    setDateResult("");
    setError("");
    setCopied(null);

    if (!timestamp.trim()) {
      setError("Please enter a Unix timestamp.");
      return;
    }

    const numericTimestamp = Number(timestamp.trim());

    if (!Number.isFinite(numericTimestamp)) {
      setError("Please enter a valid numeric Unix timestamp.");
      return;
    }

    const milliseconds =
      unit === "seconds"
        ? numericTimestamp * 1000
        : numericTimestamp;

    const date = new Date(milliseconds);

    if (Number.isNaN(date.getTime())) {
      setError("The provided timestamp is outside the valid date range.");
      return;
    }

    setDateResult(date.toISOString());
  };

  const convertDateToTimestamp = () => {
    setTimestampResult("");
    setDateResult("");
    setError("");
    setCopied(null);

    if (!dateTime.trim()) {
      setError("Please enter a date and time.");
      return;
    }

    const date = new Date(dateTime);

    if (Number.isNaN(date.getTime())) {
      setError("Please enter a valid date and time.");
      return;
    }

    const milliseconds = date.getTime();

    const result =
      unit === "seconds"
        ? Math.floor(milliseconds / 1000)
        : milliseconds;

    setTimestampResult(result.toString());
  };

  const useCurrentTimestamp = () => {
    const milliseconds = Date.now();

    const result =
      unit === "seconds"
        ? Math.floor(milliseconds / 1000)
        : milliseconds;

    setTimestamp(result.toString());
    setTimestampResult("");
    setDateResult("");
    setError("");
    setCopied(null);
  };

  const useCurrentDateTime = () => {
    const now = new Date();

    const localDateTime = new Date(
      now.getTime() - now.getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, 16);

    setDateTime(localDateTime);
    setTimestampResult("");
    setDateResult("");
    setError("");
    setCopied(null);
  };

  const clearAll = () => {
    setTimestamp("");
    setDateTime("");
    setTimestampResult("");
    setDateResult("");
    setError("");
    setCopied(null);
  };

  const copyValue = async (
    value: string,
    type: "timestamp" | "date"
  ) => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);

      setCopied(type);

      setTimeout(() => {
        setCopied(null);
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
            Timestamp Converter
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Convert Unix timestamps to dates or dates to Unix timestamps.
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

      {/* Unit Selection */}
      <div className="mb-6">

        <label className="mb-3 block text-sm font-medium text-slate-300">
          Timestamp Unit
        </label>

        <div className="flex flex-col gap-3 sm:flex-row">

          <button
            onClick={() => {
              setUnit("seconds");
              setTimestampResult("");
              setDateResult("");
              setError("");
            }}
            className={`flex flex-1 items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition ${
              unit === "seconds"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                : "border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            Seconds
          </button>

          <button
            onClick={() => {
              setUnit("milliseconds");
              setTimestampResult("");
              setDateResult("");
              setError("");
            }}
            className={`flex flex-1 items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition ${
              unit === "milliseconds"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                : "border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            Milliseconds
          </button>

        </div>

      </div>

      {/* Timestamp Input */}
      <div>

        <div className="mb-2 flex items-center justify-between">

          <label className="text-sm font-medium text-slate-300">
            Unix Timestamp
          </label>

          <button
            onClick={useCurrentTimestamp}
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            <CalendarClock className="h-3.5 w-3.5" />
            Current Timestamp
          </button>

        </div>

        <input
          type="text"
          value={timestamp}
          onChange={(event) => {
            setTimestamp(event.target.value);
            setTimestampResult("");
            setError("");
            setCopied(null);
          }}
          placeholder={
            unit === "seconds"
              ? "e.g. 1710000000"
              : "e.g. 1710000000000"
          }
          inputMode="numeric"
          spellCheck={false}
          className="w-full rounded-2xl border border-white/10 bg-[#030712] p-4 font-mono text-sm leading-6 text-slate-200 outline-none transition placeholder:text-slate-700 focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20"
        />

      </div>

      {/* Timestamp Button */}
      <button
        onClick={convertTimestampToDate}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:bg-blue-500 sm:w-auto"
      >
        <CalendarClock className="h-4 w-4" />
        Convert to Date
      </button>

      {/* Date Input */}
      <div className="mt-8">

        <div className="mb-2 flex items-center justify-between">

          <label className="text-sm font-medium text-slate-300">
            Date &amp; Time
          </label>

          <button
            onClick={useCurrentDateTime}
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            <CalendarClock className="h-3.5 w-3.5" />
            Current Date &amp; Time
          </button>

        </div>

        <input
          type="datetime-local"
          value={dateTime}
          onChange={(event) => {
            setDateTime(event.target.value);
            setTimestampResult("");
            setError("");
            setCopied(null);
          }}
          className="w-full rounded-2xl border border-white/10 bg-[#030712] p-4 text-sm text-slate-200 outline-none transition focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20"
        />

      </div>

      {/* Date Button */}
      <button
        onClick={convertDateToTimestamp}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white sm:w-auto"
      >
        <CalendarClock className="h-4 w-4" />
        Convert to Timestamp
      </button>

      {/* Error */}
      {error && (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-4">

          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />

          <div>
            <p className="text-sm font-semibold text-red-300">
              Invalid Input
            </p>

            <p className="mt-1 text-sm leading-6 text-red-400/70">
              {error}
            </p>
          </div>

        </div>
      )}

      {/* Date Result */}
      {dateResult && (
        <div className="mt-6">

          <div className="mb-2 flex items-center justify-between">

            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />

              <label className="text-sm font-medium text-slate-300">
                Converted Date
              </label>
            </div>

            <button
              onClick={() => copyValue(dateResult, "date")}
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              {copied === "date" ? (
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

          <div className="rounded-2xl border border-emerald-500/10 bg-[#030712] p-4 font-mono text-sm leading-6 text-slate-200">
            {dateResult}
          </div>

        </div>
      )}

      {/* Timestamp Result */}
      {timestampResult && (
        <div className="mt-6">

          <div className="mb-2 flex items-center justify-between">

            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />

              <label className="text-sm font-medium text-slate-300">
                Converted Timestamp
              </label>
            </div>

            <button
              onClick={() =>
                copyValue(timestampResult, "timestamp")
              }
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              {copied === "timestamp" ? (
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

          <div className="rounded-2xl border border-emerald-500/10 bg-[#030712] p-4 font-mono text-sm leading-6 text-slate-200">
            {timestampResult}
          </div>

        </div>
      )}

    </section>
  );
}