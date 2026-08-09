"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  Search,
  Sparkles,
} from "lucide-react";

type Prompt = {
  id: number;
  title: string;
  description: string;
  category: string;
  prompt: string;
};

const PROMPTS: Prompt[] = [
  {
    id: 1,
    title: "Explain Code",
    description: "Understand any code in simple, beginner-friendly language.",
    category: "Learning",
    prompt:
      "Explain the following code step by step in simple language. Also explain why each important part is used:\n\n[PASTE YOUR CODE HERE]",
  },
  {
    id: 2,
    title: "Debug My Code",
    description: "Find bugs, explain the problem and suggest a clean fix.",
    category: "Debugging",
    prompt:
      "Debug the following code. Identify the error, explain why it is happening, and provide the corrected version:\n\n[PASTE YOUR CODE HERE]",
  },
  {
    id: 3,
    title: "Generate Code",
    description: "Generate clean and production-ready code for your idea.",
    category: "Coding",
    prompt:
      "Generate clean, readable and production-ready code for the following requirement. Explain the important parts after the code:\n\n[DESCRIBE YOUR REQUIREMENT HERE]",
  },
  {
    id: 4,
    title: "React Component",
    description: "Create a modern reusable React component.",
    category: "React",
    prompt:
      "Create a modern, reusable React component for the following requirement. Use clean TypeScript and explain how to use the component:\n\n[DESCRIBE COMPONENT HERE]",
  },
  {
    id: 5,
    title: "Next.js API",
    description: "Create a Next.js API endpoint with proper structure.",
    category: "Next.js",
    prompt:
      "Create a Next.js API endpoint for the following requirement. Include validation, error handling and a clean response structure:\n\n[DESCRIBE API HERE]",
  },
  {
    id: 6,
    title: "Write Tests",
    description: "Generate useful tests for your code.",
    category: "Testing",
    prompt:
      "Write comprehensive tests for the following code. Cover normal cases, edge cases and error cases. Explain what each test verifies:\n\n[PASTE YOUR CODE HERE]",
  },
  {
    id: 7,
    title: "Optimize Code",
    description: "Improve performance, readability and maintainability.",
    category: "Optimization",
    prompt:
      "Review the following code and suggest improvements for performance, readability and maintainability. Then provide an optimized version:\n\n[PASTE YOUR CODE HERE]",
  },
  {
    id: 8,
    title: "Code Documentation",
    description: "Create clear documentation for your code or project.",
    category: "Documentation",
    prompt:
      "Create clear developer documentation for the following code or feature. Include purpose, usage, parameters and examples:\n\n[PASTE CODE OR DESCRIBE FEATURE HERE]",
  },
];

const CATEGORIES = [
  "All",
  "Coding",
  "Debugging",
  "Learning",
  "React",
  "Next.js",
  "Testing",
  "Optimization",
  "Documentation",
];

export default function PromptsPage() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/auth/login");
    }
  }, [router]);

  const filteredPrompts = useMemo(() => {
    return PROMPTS.filter((prompt) => {
      const matchesCategory =
        category === "All" || prompt.category === category;

      const searchText = search.toLowerCase();

      const matchesSearch =
        prompt.title.toLowerCase().includes(searchText) ||
        prompt.description.toLowerCase().includes(searchText) ||
        prompt.category.toLowerCase().includes(searchText);

      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

  const usePrompt = (prompt: Prompt) => {
    sessionStorage.setItem("devai_prompt", prompt.prompt);
    router.push("/chat");
  };

  const copyPrompt = async (prompt: Prompt) => {
    await navigator.clipboard.writeText(prompt.prompt);

    setCopiedId(prompt.id);

    setTimeout(() => {
      setCopiedId(null);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      {/* Background Glow */}
      <div className="pointer-events-none fixed left-0 top-0 h-96 w-96 rounded-full bg-violet-600/10 blur-[140px]" />

      <div className="pointer-events-none fixed bottom-0 right-0 h-96 w-96 rounded-full bg-blue-600/10 blur-[140px]" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050816]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-violet-600 to-blue-500 text-xl shadow-lg shadow-violet-600/20">
              ✦
            </div>

            <div className="text-left">
              <h1 className="text-lg font-bold">
                Dev <span className="text-violet-400">AI</span>
              </h1>

              <p className="text-xs text-slate-500">Prompt Library</p>
            </div>
          </button>

          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </button>
        </div>
      </header>

      {/* Main */}
      <section className="relative mx-auto max-w-7xl px-6 py-12">
        {/* Hero */}
        <div className="text-center">
          <div className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
            <Sparkles className="h-4 w-4" />
            Developer Prompt Library
          </div>

          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Build faster with
            <span className="ml-2 bg-linear-to-r from-violet-400 via-fuchsia-500 to-blue-400 bg-clip-text text-transparent">
              smart prompts
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400">
            Use ready-made prompts for coding, debugging, learning and
            development. Pick a prompt and start chatting with Dev AI.
          </p>
        </div>

        {/* Search */}
        <div className="mx-auto mt-10 max-w-2xl">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition focus-within:border-violet-500/40">
            <Search className="h-5 w-5 text-slate-500" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search prompts..."
              className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                category === item
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-900/20"
                  : "border border-white/10 bg-white/5 text-slate-400 hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-white"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Prompt Count */}
        <div className="mt-10 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">Prompt Collection</h3>

            <p className="mt-1 text-sm text-slate-500">
              {filteredPrompts.length} prompts available
            </p>
          </div>
        </div>

        {/* Prompt Cards */}
        {filteredPrompts.length > 0 ? (
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredPrompts.map((prompt) => (
              <div
                key={prompt.id}
                className="group flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 transition duration-300 hover:-translate-y-1 hover:border-violet-500/30 hover:bg-white/[0.07]"
              >
                {/* Category */}
                <div className="flex items-center justify-between">
                  <span className="rounded-lg border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">
                    {prompt.category}
                  </span>

                  <button
                    onClick={() => copyPrompt(prompt)}
                    className="rounded-lg p-2 text-slate-500 transition hover:bg-white/10 hover:text-white"
                    title="Copy prompt"
                  >
                    {copiedId === prompt.id ? (
                      <Check className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* Content */}
                <h4 className="mt-5 text-xl font-semibold">{prompt.title}</h4>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {prompt.description}
                </p>

                {/* Prompt Preview */}
                <div className="mt-5 rounded-xl border border-white/5 bg-black/20 p-4">
                  <p className="line-clamp-4 whitespace-pre-wrap text-xs leading-5 text-slate-500">
                    {prompt.prompt}
                  </p>
                </div>

                {/* Button */}
                <button
                  onClick={() => {
                    router.push(
                      `/chat?prompt=${encodeURIComponent(prompt.description)}`,
                    );
                  }}
                  className="group/btn mt-6 flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-900/20 transition hover:bg-violet-500"
                >
                  Use Prompt
                  <ArrowRight className="h-4 w-4 transition group-hover/btn:translate-x-1" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
            <Search className="mx-auto h-10 w-10 text-slate-600" />

            <h3 className="mt-4 text-xl font-semibold">No prompts found</h3>

            <p className="mt-2 text-sm text-slate-500">
              Try another search or select a different category.
            </p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 text-center text-sm text-slate-600">
        Dev AI • Developer Prompt Library
      </footer>
    </main>
  );
}
