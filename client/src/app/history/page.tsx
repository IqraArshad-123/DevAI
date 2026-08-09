"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MessageSquare,
  Search,
  Clock3,
  Trash2,
  Plus,
  Sparkles,
} from "lucide-react";

type ChatHistory = {
  id: number;
  title: string;
  preview: string;
  date: string;
};

const sampleHistory: ChatHistory[] = [
  {
    id: 1,
    title: "Explain JavaScript",
    preview: "Can you explain JavaScript in simple words?",
    date: "Today",
  },
  {
    id: 2,
    title: "Next.js API",
    preview: "How do I create an API in Next.js?",
    date: "Yesterday",
  },
  {
    id: 3,
    title: "React Debugging",
    preview: "Help me debug my React component.",
    date: "2 days ago",
  },
];

export default function HistoryPage() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [history, setHistory] = useState(sampleHistory);

  const filteredHistory = history.filter(
    (chat) =>
      chat.title.toLowerCase().includes(search.toLowerCase()) ||
      chat.preview.toLowerCase().includes(search.toLowerCase())
  );

  const deleteChat = (id: number) => {
    setHistory((prev) => prev.filter((chat) => chat.id !== id));
  };

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      {/* Background Glow */}
      <div className="pointer-events-none fixed left-0 top-0 h-96 w-96 rounded-full bg-violet-600/10 blur-[140px]" />

      <div className="pointer-events-none fixed bottom-0 right-0 h-96 w-96 rounded-full bg-blue-600/10 blur-[140px]" />

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050816]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          {/* Logo */}
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

              <p className="text-xs text-slate-500">
                Developer Workspace
              </p>
            </div>
          </button>

          {/* Back */}
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />

            <span className="hidden sm:inline">
              Dashboard
            </span>
          </button>
        </div>
      </header>

      {/* Main */}
      <section className="relative mx-auto max-w-5xl px-6 py-12">
        {/* Heading */}
        <div className="mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
            <Clock3 className="h-4 w-4" />
            Your Conversations
          </div>

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Chat History
              </h2>

              <p className="mt-3 max-w-2xl text-slate-400">
                Find and continue your previous conversations with Dev AI.
              </p>
            </div>

            <button
              onClick={() => router.push("/chat")}
              className="flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-violet-600 to-purple-600 px-5 py-3 font-semibold text-white shadow-lg shadow-violet-900/20 transition hover:scale-[1.02] hover:from-violet-500 hover:to-purple-500"
            >
              <Plus className="h-5 w-5" />
              New Chat
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl transition focus-within:border-violet-500/40">
          <Search className="h-5 w-5 shrink-0 text-slate-500" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your conversations..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
          />
        </div>

        {/* History */}
        {filteredHistory.length > 0 ? (
          <div className="space-y-4">
            {filteredHistory.map((chat) => (
              <div
                key={chat.id}
                className="group rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/30 hover:bg-white/[0.07]"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                    <MessageSquare className="h-5 w-5" />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="truncate text-lg font-semibold text-white">
                        {chat.title}
                      </h3>

                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock3 className="h-3.5 w-3.5" />
                        {chat.date}
                      </span>
                    </div>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">
                      {chat.preview}
                    </p>

                    {/* Actions */}
                    <div className="mt-4 flex items-center gap-3">
                      <button
                        onClick={() => router.push("/chat")}
                        className="rounded-lg border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-300 transition hover:border-violet-500/40 hover:bg-violet-500/20 hover:text-white"
                      >
                        Open Chat
                      </button>

                      <button
                        onClick={() => deleteChat(chat.id)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-500 transition hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-16 text-center backdrop-blur-xl">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-violet-500/20 bg-violet-500/10 text-violet-400">
              <MessageSquare className="h-9 w-9" />
            </div>

            <h3 className="mt-6 text-2xl font-bold">
              No conversations found
            </h3>

            <p className="mx-auto mt-3 max-w-md text-slate-400">
              {search
                ? "Try searching with a different keyword."
                : "Start a conversation with Dev AI and your chats will appear here."}
            </p>

            <button
              onClick={() => router.push("/chat")}
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white transition hover:bg-violet-500"
            >
              <Sparkles className="h-5 w-5" />
              Start Chatting
            </button>
          </div>
        )}

        {/* Temporary notice */}
        <div className="mt-8 rounded-2xl border border-amber-500/10 bg-amber-500/5 px-5 py-4 text-sm text-amber-200/70">
          <p>
            <span className="font-semibold text-amber-300">
              Development Preview:
            </span>{" "}
            These conversations are currently sample data. We will connect
            this page to your real chat database in the next step.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 text-center text-sm text-slate-600">
        Dev AI • AI Powered Coding Assistant
      </footer>
    </main>
  );
}