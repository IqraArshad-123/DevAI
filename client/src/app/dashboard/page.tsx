"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bot,
  MessageSquare,
  History,
  FileText,
  User,
  LogOut,
  ArrowRight,
  Sparkles,
  Code2,
  Terminal,
  Zap,
} from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  // =========================
  // Authentication Check
  // =========================
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/auth/login");
      return;
    }

    setCheckingAuth(false);
  }, [router]);

  // =========================
  // Logout
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/auth/login");
  };

  // =========================
  // Navigation
  // =========================
  const goToChat = () => {
    router.push("/chat");
  };

  const goToHistory = () => {
    router.push("/history");
  };

  const goToPrompts = () => {
    router.push("/prompts");
  };

  const goToProfile = () => {
    router.push("/profile");
  };

  // =========================
  // Loading
  // =========================
  if (checkingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050816] text-white">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-violet-600 to-blue-500 text-2xl shadow-lg shadow-violet-600/30">
            ✦
          </div>

          <p className="mt-4 text-sm text-slate-400">
            Loading your dashboard...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      {/* =========================
          Background Glow
      ========================= */}
      <div className="pointer-events-none fixed left-0 top-0 h-96 w-96 rounded-full bg-violet-600/10 blur-[140px]" />

      <div className="pointer-events-none fixed bottom-0 right-0 h-96 w-96 rounded-full bg-blue-600/10 blur-[140px]" />

      {/* =========================
          Navbar
      ========================= */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050816]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
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

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* New Chat */}
            <button
              onClick={goToChat}
              className="hidden rounded-xl border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-300 transition hover:border-violet-500/40 hover:bg-violet-500/20 sm:flex sm:items-center sm:gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              New Chat
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300"
            >
              <LogOut className="h-4 w-4" />

              <span className="hidden sm:inline">
                Logout
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* =========================
          Main Content
      ========================= */}
      <section className="relative mx-auto max-w-7xl px-6 py-10">
        {/* =========================
            Welcome Section
        ========================= */}
        <div className="rounded-3xl border border-white/10 bg-linear-to-br from-violet-600/10 via-[#0b1025] to-blue-600/5 p-8 shadow-2xl shadow-black/20">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
                <Sparkles className="h-4 w-4" />
                Dev AI Workspace
              </div>

              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Welcome back 👋
              </h2>

              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-400">
                Your AI-powered developer workspace is ready. Ask questions,
                debug code, learn new technologies and build faster.
              </p>
            </div>

            {/* Start New Chat */}
            <button
              onClick={goToChat}
              className="group flex shrink-0 items-center justify-center gap-3 rounded-2xl bg-linear-to-r from-violet-600 to-purple-600 px-6 py-4 font-semibold text-white shadow-xl shadow-violet-900/30 transition hover:scale-[1.02] hover:from-violet-500 hover:to-purple-500"
            >
              <MessageSquare className="h-5 w-5" />

              Start New Chat

              <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* =========================
            Stats
        ========================= */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* AI Chat */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-violet-500/10 p-3">
                <MessageSquare className="h-5 w-5 text-violet-400" />
              </div>

              <span className="text-xs text-emerald-400">
                Active
              </span>
            </div>

            <p className="mt-5 text-2xl font-bold">
              AI Chat
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Ready to assist
            </p>
          </div>

          {/* Code Help */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="w-fit rounded-xl bg-blue-500/10 p-3">
              <Code2 className="h-5 w-5 text-blue-400" />
            </div>

            <p className="mt-5 text-2xl font-bold">
              Code Help
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Generate & debug
            </p>
          </div>

          {/* Developer */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="w-fit rounded-xl bg-fuchsia-500/10 p-3">
              <Terminal className="h-5 w-5 text-fuchsia-400" />
            </div>

            <p className="mt-5 text-2xl font-bold">
              Developer
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Productivity tools
            </p>
          </div>

          {/* Availability */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="w-fit rounded-xl bg-emerald-500/10 p-3">
              <Zap className="h-5 w-5 text-emerald-400" />
            </div>

            <p className="mt-5 text-2xl font-bold">
              24/7
            </p>

            <p className="mt-1 text-sm text-slate-500">
              AI availability
            </p>
          </div>
        </div>

        {/* =========================
            Quick Actions
        ========================= */}
        <div className="mt-10">
          <div className="mb-5">
            <h3 className="text-2xl font-bold">
              Quick Actions
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Everything you need in one place.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* =========================
                New Chat
            ========================= */}
            <button
              onClick={goToChat}
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 text-left transition hover:-translate-y-1 hover:border-violet-500/40 hover:bg-violet-500/5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10">
                <MessageSquare className="h-6 w-6 text-violet-400" />
              </div>

              <h4 className="mt-5 text-lg font-semibold">
                New Chat
              </h4>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Ask Dev AI anything about coding or development.
              </p>

              <div className="mt-5 flex items-center gap-2 text-sm font-medium text-violet-400">
                Open Chat

                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </div>
            </button>

            {/* =========================
                Chat History
            ========================= */}
            <button
              onClick={goToHistory}
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 text-left transition hover:-translate-y-1 hover:border-blue-500/40 hover:bg-blue-500/5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                <History className="h-6 w-6 text-blue-400" />
              </div>

              <h4 className="mt-5 text-lg font-semibold">
                Chat History
              </h4>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                View your previous AI conversations.
              </p>

              <div className="mt-5 flex items-center gap-2 text-sm font-medium text-blue-400">
                View History

                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </div>
            </button>

            {/* =========================
                Saved Prompts
            ========================= */}
            <button
              onClick={goToPrompts}
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 text-left transition hover:-translate-y-1 hover:border-fuchsia-500/40 hover:bg-fuchsia-500/5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-fuchsia-500/10">
                <FileText className="h-6 w-6 text-fuchsia-400" />
              </div>

              <h4 className="mt-5 text-lg font-semibold">
                Saved Prompts
              </h4>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Save and reuse your favorite prompts.
              </p>

              <div className="mt-5 flex items-center gap-2 text-sm font-medium text-fuchsia-400">
                Open Prompts

                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </div>
            </button>

            {/* =========================
                My Profile
            ========================= */}
            <button
              onClick={goToProfile}
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 text-left transition hover:-translate-y-1 hover:border-emerald-500/40 hover:bg-emerald-500/5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                <User className="h-6 w-6 text-emerald-400" />
              </div>

              <h4 className="mt-5 text-lg font-semibold">
                My Profile
              </h4>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Manage your account and preferences.
              </p>

              <div className="mt-5 flex items-center gap-2 text-sm font-medium text-emerald-400">
                Open Profile

                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </div>
            </button>
          </div>
        </div>

        {/* =========================
            Developer Assistant
        ========================= */}
        <div className="mt-10 overflow-hidden rounded-3xl border border-violet-500/10 bg-linear-to-r from-violet-600/10 via-white/5 to-blue-500/10 p-8">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-600/20">
                <Bot className="h-7 w-7 text-violet-400" />
              </div>

              <div>
                <h3 className="text-xl font-bold">
                  Your AI Coding Companion
                </h3>

                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                  Need help with an error, a new concept, or some code?
                  Dev AI is ready whenever you are.
                </p>
              </div>
            </div>

            <button
              onClick={goToChat}
              className="flex items-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 px-5 py-3 text-sm font-semibold text-violet-300 transition hover:bg-violet-500/20"
            >
              Talk to Dev AI

              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* =========================
          Footer
      ========================= */}
      <footer className="border-t border-white/10 py-6 text-center text-sm text-slate-600">
        Dev AI • AI Powered Coding Assistant
      </footer>
    </main>
  );
}