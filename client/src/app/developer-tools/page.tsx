"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  Binary,
  Braces,
  CheckCircle2,
  Clock3,
  Code2,
  Fingerprint,
  Hash,
  KeyRound,
  Link2,
  Minimize2,
  Regex,
  Sparkles,
  Wrench,
} from "lucide-react";

import JsonFormatter from "@/components/developer-tools/JsonFormatter";
import JsonValidator from "@/components/developer-tools/JsonValidator";
import JsonMinifier from "@/components/developer-tools/JsonMinifier";
import UuidGenerator from "@/components/developer-tools/UuidGenerator";
import Base64Tool from "@/components/developer-tools/Base64Tool";
import UrlEncoder from "@/components/developer-tools/UrlEncoder";
import JwtDecoder from "@/components/developer-tools/JwtDecoder";
import RegexTester from "@/components/developer-tools/RegexTester";
import TimestampConverter from "@/components/developer-tools/TimestampConverter";
import HashGenerator from "@/components/developer-tools/HashGenerator";

type ToolId =
  | "json-formatter"
  | "json-validator"
  | "json-minifier"
  | "uuid-generator"
  | "base64"
  | "url-encoder"
  | "jwt-decoder"
  | "regex-tester"
  | "timestamp"
  | "hash-generator";

type Tool = {
  id: ToolId;
  name: string;
  description: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
};

const tools: Tool[] = [
  {
    id: "json-formatter",
    name: "JSON Formatter",
    description:
      "Format and beautify JSON data into a clean and readable structure.",
    category: "JSON",
    icon: Braces,
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-400",
  },
  {
    id: "json-validator",
    name: "JSON Validator",
    description:
      "Validate JSON data and quickly identify syntax or structure errors.",
    category: "JSON",
    icon: CheckCircle2,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-400",
  },
  {
    id: "json-minifier",
    name: "JSON Minifier",
    description:
      "Minify JSON by removing unnecessary spaces and formatting characters.",
    category: "JSON",
    icon: Minimize2,
    iconBg: "bg-fuchsia-500/10",
    iconColor: "text-fuchsia-400",
  },
  {
    id: "uuid-generator",
    name: "UUID Generator",
    description:
      "Generate unique UUID identifiers instantly for your applications.",
    category: "Generators",
    icon: Fingerprint,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
  },
  {
    id: "base64",
    name: "Base64 Encoder / Decoder",
    description:
      "Encode text into Base64 or decode Base64 strings back into readable text.",
    category: "Encoding",
    icon: Binary,
    iconBg: "bg-cyan-500/10",
    iconColor: "text-cyan-400",
  },
  {
    id: "url-encoder",
    name: "URL Encoder / Decoder",
    description:
      "Encode or decode URL components safely for web development.",
    category: "Encoding",
    icon: Link2,
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-400",
  },
  {
    id: "jwt-decoder",
    name: "JWT Decoder",
    description:
      "Decode JWT tokens and inspect their header and payload information.",
    category: "Security",
    icon: KeyRound,
    iconBg: "bg-pink-500/10",
    iconColor: "text-pink-400",
  },
  {
    id: "regex-tester",
    name: "Regex Tester",
    description:
      "Test regular expressions against text and inspect matching results.",
    category: "Testing",
    icon: Regex,
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-400",
  },
  {
    id: "timestamp",
    name: "Timestamp Converter",
    description:
      "Convert Unix timestamps into human-readable dates and times.",
    category: "Converters",
    icon: Clock3,
    iconBg: "bg-indigo-500/10",
    iconColor: "text-indigo-400",
  },
  {
    id: "hash-generator",
    name: "Hash Generator",
    description:
      "Generate cryptographic hashes from text using supported algorithms.",
    category: "Security",
    icon: Hash,
    iconBg: "bg-red-500/10",
    iconColor: "text-red-400",
  },
];

export default function DeveloperToolsPage() {
  const router = useRouter();

  const [selectedTool, setSelectedTool] = useState<ToolId | null>(null);

  const selectedToolData = tools.find(
    (tool) => tool.id === selectedTool
  );

  const renderTool = () => {
    switch (selectedTool) {
      case "json-formatter":
        return <JsonFormatter />;

      case "json-validator":
        return <JsonValidator />;

      case "json-minifier":
        return <JsonMinifier />;

      case "uuid-generator":
        return <UuidGenerator />;

      case "base64":
        return <Base64Tool />;

      case "url-encoder":
        return <UrlEncoder />;

      case "jwt-decoder":
        return <JwtDecoder />;

      case "regex-tester":
        return <RegexTester />;

      case "timestamp":
        return <TimestampConverter />;

      case "hash-generator":
        return <HashGenerator />;

      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none fixed left-0 top-0 h-96 w-96 rounded-full bg-violet-600/10 blur-[150px]" />

      <div className="pointer-events-none fixed bottom-0 right-0 h-96 w-96 rounded-full bg-blue-600/10 blur-[150px]" />

      <div className="relative mx-auto max-w-6xl px-5 py-8 sm:px-6 sm:py-10">
        {/* =====================================================
            TOP NAV
        ===================================================== */}

        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => router.push("/dashboard")}
            className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 transition-all hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-300"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />

            Dashboard
          </button>

          <div className="hidden items-center gap-2 text-xs text-slate-600 sm:flex">
            <Wrench className="h-3.5 w-3.5" />

            Developer Toolkit
          </div>
        </div>

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10">
              <Wrench className="h-5 w-5 text-violet-400" />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-violet-400">
                Developer Workspace
              </p>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Developer Tools
              </h1>
            </div>
          </div>

          <p className="max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Useful development utilities for formatting, validating,
            encoding, decoding, testing and working with common developer data.
          </p>
        </div>

        {/* =====================================================
            TOOL AREA
        ===================================================== */}

        {selectedTool ? (
          <>
            {/* =================================================
                SELECTED TOOL HEADER
            ================================================= */}

            <div className="mb-6">
              <button
                onClick={() => setSelectedTool(null)}
                className="mb-5 flex items-center gap-2 text-sm text-slate-500 transition hover:text-violet-400"
              >
                <ArrowLeft className="h-4 w-4" />

                Back to Developer Tools
              </button>

              <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/3 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  {selectedToolData && (
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${selectedToolData.iconBg}`}
                    >
                      {(() => {
                        const Icon = selectedToolData.icon;

                        return (
                          <Icon
                            className={`h-6 w-6 ${selectedToolData.iconColor}`}
                          />
                        );
                      })()}
                    </div>
                  )}

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-violet-400">
                      {selectedToolData?.category}
                    </p>

                    <h2 className="mt-1 text-xl font-bold">
                      {selectedToolData?.name}
                    </h2>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedTool(null)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-300"
                >
                  All Tools

                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* =================================================
                ACTIVE TOOL
            ================================================= */}

            <div>{renderTool()}</div>
          </>
        ) : (
          <>
            {/* =================================================
                TOOL LIST HEADER
            ================================================= */}

            <div className="mb-5 flex items-end justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-violet-400" />

                  <h2 className="text-lg font-semibold">
                    Available Tools
                  </h2>
                </div>

                <p className="mt-1 text-sm text-slate-600">
                  Choose a tool to open it.
                </p>
              </div>

              <div className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-500 sm:block">
                {tools.length} tools
              </div>
            </div>

            {/* =================================================
                TOOL BLOCKS
            ================================================= */}

            <div className="space-y-3">
              {tools.map((tool) => {
                const Icon = tool.icon;

                return (
                  <button
                    key={tool.id}
                    onClick={() => setSelectedTool(tool.id)}
                    className="group relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-left transition-all duration-300 hover:-translate-y-px hover:border-violet-500/30 hover:bg-white/5.5 hover:shadow-xl hover:shadow-violet-950/10 sm:gap-5 sm:p-5"
                  >
                    {/* Left Accent */}

                    <div className="absolute left-0 top-0 h-full w-0.5 bg-violet-500/0 transition group-hover:bg-violet-500/70" />

                    {/* Icon */}

                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tool.iconBg} transition-transform duration-300 group-hover:scale-105 sm:h-14 sm:w-14`}
                    >
                      <Icon
                        className={`h-5 w-5 sm:h-6 sm:w-6 ${tool.iconColor}`}
                      />
                    </div>

                    {/* Content */}

                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold text-white sm:text-lg">
                          {tool.name}
                        </h3>

                        <span className="rounded-md border border-white/5 bg-white/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-600">
                          {tool.category}
                        </span>
                      </div>

                      <p className="max-w-2xl text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">
                        {tool.description}
                      </p>
                    </div>

                    {/* Arrow */}

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/5 bg-white/3 text-slate-600 transition-all duration-300 group-hover:border-violet-500/20 group-hover:bg-violet-500/10 group-hover:text-violet-400">
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* =================================================
                BOTTOM INFO
            ================================================= */}

            <div className="mt-8 rounded-2xl border border-violet-500/10 bg-linear-to-r from-violet-500/4 to-blue-500/3 p-5">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
                  <Sparkles className="h-4 w-4 text-violet-400" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-300">
                    Developer Toolkit
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    Select any tool above to open its workspace. Your tools
                    remain separate so the page stays clean and easy to use.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <footer className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-slate-700">
          Dev AI • Developer Toolkit
        </footer>
      </div>
    </main>
  );
}