"use client";

import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clipboard,
  Clock3,
  RotateCcw,
} from "lucide-react";

export default function JwtDecoder() {
  const [token, setToken] = useState("");
  const [header, setHeader] = useState("");
  const [payload, setPayload] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<"header" | "payload" | null>(
    null
  );
  const [expiration, setExpiration] = useState<number | null>(null);

  const decodeBase64Url = (value: string) => {
    const base64 = value
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "="
    );

    const binary = atob(padded);

    const bytes = Uint8Array.from(binary, (char) =>
      char.charCodeAt(0)
    );

    return new TextDecoder().decode(bytes);
  };

  const decodeJwt = () => {
    setHeader("");
    setPayload("");
    setError("");
    setExpiration(null);
    setCopied(null);

    if (!token.trim()) {
      setError("Please enter a JWT token to decode.");
      return;
    }

    const parts = token.trim().split(".");

    if (parts.length !== 3) {
      setError(
        "Invalid JWT format. A JWT must contain three parts separated by dots."
      );
      return;
    }

    try {
      const decodedHeader = JSON.parse(
        decodeBase64Url(parts[0])
      );

      const decodedPayload = JSON.parse(
        decodeBase64Url(parts[1])
      );

      setHeader(JSON.stringify(decodedHeader, null, 2));
      setPayload(JSON.stringify(decodedPayload, null, 2));

      if (
        typeof decodedPayload.exp === "number"
      ) {
        setExpiration(decodedPayload.exp);
      }
    } catch (error) {
      console.error("JWT Decode Error:", error);

      setError(
        "Unable to decode JWT. Please make sure the token contains valid Base64URL-encoded header and payload data."
      );
    }
  };

  const clearAll = () => {
    setToken("");
    setHeader("");
    setPayload("");
    setError("");
    setExpiration(null);
    setCopied(null);
  };

  const copyValue = async (
    value: string,
    type: "header" | "payload"
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

  const formatExpiration = () => {
    if (!expiration) return null;

    const expirationDate = new Date(expiration * 1000);
    const isExpired = expirationDate.getTime() < Date.now();

    return {
      date: expirationDate.toLocaleString(),
      isExpired,
    };
  };

  const expirationInfo = formatExpiration();

  return (
    <section className="rounded-3xl border border-white/10 bg-white/3 p-5 shadow-2xl shadow-black/20 sm:p-6">

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h2 className="text-lg font-semibold text-white">
            JWT Decoder
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Decode JWT header and payload directly in your browser.
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

      {/* Security Note */}
      <div className="mb-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">

        <p className="text-sm font-semibold text-amber-300">
          Decode only
        </p>

        <p className="mt-1 text-sm leading-6 text-amber-400/70">
          Decoding a JWT does not verify its signature or prove that
          the token is authentic.
        </p>

      </div>

      {/* Token Input */}
      <div>

        <div className="mb-2 flex items-center justify-between">

          <label className="text-sm font-medium text-slate-300">
            JWT Token
          </label>

          {token && (
            <span className="text-xs text-slate-600">
              {token.length} characters
            </span>
          )}

        </div>

        <textarea
          value={token}
          onChange={(event) => {
            setToken(event.target.value);
            setHeader("");
            setPayload("");
            setError("");
            setExpiration(null);
            setCopied(null);
          }}
          placeholder="Paste your JWT token here..."
          spellCheck={false}
          className="min-h-45 w-full resize-y rounded-2xl border border-white/10 bg-[#030712] p-4 font-mono text-sm leading-6 text-slate-200 outline-none transition placeholder:text-slate-700 focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20"
        />

      </div>

      {/* Decode Button */}
      <button
        onClick={decodeJwt}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:bg-blue-500 sm:w-auto"
      >
        <CheckCircle2 className="h-4 w-4" />
        Decode JWT
      </button>

      {/* Error */}
      {error && (
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-4">

          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />

          <div>
            <p className="text-sm font-semibold text-red-300">
              Invalid JWT
            </p>

            <p className="mt-1 text-sm leading-6 text-red-400/70">
              {error}
            </p>
          </div>

        </div>
      )}

      {/* Expiration */}
      {expirationInfo && (
        <div
          className={`mt-6 flex items-start gap-3 rounded-2xl border p-4 ${
            expirationInfo.isExpired
              ? "border-red-500/20 bg-red-500/5"
              : "border-emerald-500/20 bg-emerald-500/5"
          }`}
        >
          <Clock3
            className={`mt-0.5 h-5 w-5 shrink-0 ${
              expirationInfo.isExpired
                ? "text-red-400"
                : "text-emerald-400"
            }`}
          />

          <div>
            <p
              className={`text-sm font-semibold ${
                expirationInfo.isExpired
                  ? "text-red-300"
                  : "text-emerald-300"
              }`}
            >
              {expirationInfo.isExpired
                ? "Token Expired"
                : "Token Expiration"}
            </p>

            <p
              className={`mt-1 text-sm leading-6 ${
                expirationInfo.isExpired
                  ? "text-red-400/70"
                  : "text-emerald-400/70"
              }`}
            >
              {expirationInfo.date}
            </p>
          </div>

        </div>
      )}

      {/* Header Output */}
      {header && (
        <div className="mt-6">

          <div className="mb-2 flex items-center justify-between">

            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />

              <label className="text-sm font-medium text-slate-300">
                JWT Header
              </label>
            </div>

            <button
              onClick={() => copyValue(header, "header")}
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              {copied === "header" ? (
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
            value={header}
            readOnly
            spellCheck={false}
            className="min-h-37.5 w-full resize-y rounded-2xl border border-white/10 bg-[#030712] p-4 font-mono text-sm leading-6 text-slate-200 outline-none"
          />

        </div>
      )}

      {/* Payload Output */}
      {payload && (
        <div className="mt-6">

          <div className="mb-2 flex items-center justify-between">

            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />

              <label className="text-sm font-medium text-slate-300">
                JWT Payload
              </label>
            </div>

            <button
              onClick={() => copyValue(payload, "payload")}
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              {copied === "payload" ? (
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
            value={payload}
            readOnly
            spellCheck={false}
            className="min-h-55 w-full resize-y rounded-2xl border border-white/10 bg-[#030712] p-4 font-mono text-sm leading-6 text-slate-200 outline-none"
          />

        </div>
      )}

    </section>
  );
}