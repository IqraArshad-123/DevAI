"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Palette,
  Bot,
  Bell,
  Shield,
  Moon,
  Sun,
  Monitor,
  Check,
  ChevronRight,
  Settings,
} from "lucide-react";

type Theme = "dark" | "light" | "system";

export default function SettingsPage() {
  const router = useRouter();

  const [theme, setTheme] = useState<Theme>("dark");
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  const handleThemeChange = (value: Theme) => {
    setTheme(value);

    if (value === "dark") {
      document.documentElement.classList.add("dark");
    }

    if (value === "light") {
      document.documentElement.classList.remove("dark");
    }

    if (value === "system") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      if (prefersDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  return (
    <main className="min-h-screen bg-[#050816] text-white">

      {/* HEADER */}

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050816]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-6">

          <div className="flex items-center gap-3">

            <button
              onClick={() => router.push("/dashboard")}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-white"
              title="Back to Dashboard"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div>
              <h1 className="text-lg font-bold">
                Settings
              </h1>

              <p className="text-xs text-slate-500">
                Manage your Dev AI preferences
              </p>
            </div>

          </div>

          <button
            onClick={() => router.push("/profile")}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-300"
          >
            <User className="h-4 w-4" />

            <span className="hidden sm:inline">
              Profile
            </span>
          </button>

        </div>
      </header>

      {/* CONTENT */}

      <section className="mx-auto max-w-6xl px-5 py-8 sm:px-6 sm:py-10">

        {/* INTRO */}

        <div className="mb-8">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
            <Palette className="h-4 w-4" />
            Preferences
          </div>

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Make Dev AI yours.
          </h2>

          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-400">
            Customize your appearance, AI experience,
            notifications and workspace preferences.
          </p>

        </div>

        {/* SETTINGS GRID */}

        <div className="grid gap-6 lg:grid-cols-2">

          {/* APPEARANCE */}

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/10">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-500/10">
                <Palette className="h-6 w-6 text-violet-400" />
              </div>

              <div>
                <h3 className="text-lg font-semibold">
                  Appearance
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Choose how Dev AI looks on your device.
                </p>
              </div>

            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">

              {/* DARK */}

              <button
                onClick={() => handleThemeChange("dark")}
                className={`rounded-2xl border p-4 text-left transition ${
                  theme === "dark"
                    ? "border-violet-500/50 bg-violet-500/10"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between">

                  <Moon className="h-5 w-5 text-violet-400" />

                  {theme === "dark" && (
                    <Check className="h-4 w-4 text-violet-400" />
                  )}

                </div>

                <p className="mt-4 text-sm font-semibold">
                  Dark
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Recommended
                </p>
              </button>

              {/* LIGHT */}

              <button
                onClick={() => handleThemeChange("light")}
                className={`rounded-2xl border p-4 text-left transition ${
                  theme === "light"
                    ? "border-violet-500/50 bg-violet-500/10"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between">

                  <Sun className="h-5 w-5 text-amber-400" />

                  {theme === "light" && (
                    <Check className="h-4 w-4 text-violet-400" />
                  )}

                </div>

                <p className="mt-4 text-sm font-semibold">
                  Light
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Bright interface
                </p>
              </button>

              {/* SYSTEM */}

              <button
                onClick={() => handleThemeChange("system")}
                className={`rounded-2xl border p-4 text-left transition ${
                  theme === "system"
                    ? "border-violet-500/50 bg-violet-500/10"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between">

                  <Monitor className="h-5 w-5 text-blue-400" />

                  {theme === "system" && (
                    <Check className="h-4 w-4 text-violet-400" />
                  )}

                </div>

                <p className="mt-4 text-sm font-semibold">
                  System
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Follow device
                </p>
              </button>

            </div>

          </section>

          {/* AI PREFERENCES */}

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/10">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10">
                <Bot className="h-6 w-6 text-blue-400" />
              </div>

              <div>
                <h3 className="text-lg font-semibold">
                  AI Preferences
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Configure how you interact with Dev AI.
                </p>
              </div>

            </div>

            <div className="mt-6 space-y-3">

              <button
                onClick={() => router.push("/chat")}
                className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-blue-500/30 hover:bg-blue-500/5"
              >
                <div>

                  <p className="text-sm font-semibold">
                    AI Modes
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Choose how Dev AI assists you
                  </p>

                </div>

                <ChevronRight className="h-5 w-5 text-slate-600" />
              </button>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">

                <p className="text-sm font-semibold">
                  Response style
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Detailed responses are enabled by default.
                </p>

              </div>

            </div>

          </section>

          {/* NOTIFICATIONS */}

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/10">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10">
                <Bell className="h-6 w-6 text-emerald-400" />
              </div>

              <div>
                <h3 className="text-lg font-semibold">
                  Notifications
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Control notifications and workspace updates.
                </p>
              </div>

            </div>

            <div className="mt-6">

              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">

                <div className="pr-4">

                  <p className="text-sm font-semibold">
                    Notifications
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Receive important Dev AI updates.
                  </p>

                </div>

                <button
                  onClick={() =>
                    setNotifications(!notifications)
                  }
                  className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                    notifications
                      ? "bg-emerald-500"
                      : "bg-slate-700"
                  }`}
                >

                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                      notifications
                        ? "left-6"
                        : "left-1"
                    }`}
                  />

                </button>

              </div>

            </div>

          </section>

          {/* WORKSPACE */}

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/10">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10">
                <Settings className="h-6 w-6 text-amber-400" />
              </div>

              <div>
                <h3 className="text-lg font-semibold">
                  Workspace
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Manage how your workspace behaves.
                </p>
              </div>

            </div>

            <div className="mt-6">

              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">

                <div className="pr-4">

                  <p className="text-sm font-semibold">
                    Auto-save
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Automatically save your workspace changes.
                  </p>

                </div>

                <button
                  onClick={() => setAutoSave(!autoSave)}
                  className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                    autoSave
                      ? "bg-violet-500"
                      : "bg-slate-700"
                  }`}
                >

                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                      autoSave
                        ? "left-6"
                        : "left-1"
                    }`}
                  />

                </button>

              </div>

            </div>

          </section>

          {/* ACCOUNT */}

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/10">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/10">
                <User className="h-6 w-6 text-cyan-400" />
              </div>

              <div>
                <h3 className="text-lg font-semibold">
                  Account
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Manage your profile and account information.
                </p>
              </div>

            </div>

            <div className="mt-6 space-y-3">

              <button
                onClick={() => router.push("/profile")}
                className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-cyan-500/30 hover:bg-cyan-500/5"
              >

                <div>

                  <p className="text-sm font-semibold">
                    Profile
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    View and update your profile
                  </p>

                </div>

                <ChevronRight className="h-5 w-5 text-slate-600" />

              </button>

            </div>

          </section>

          {/* SECURITY */}

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/10">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-500/10">
                <Shield className="h-6 w-6 text-red-400" />
              </div>

              <div>
                <h3 className="text-lg font-semibold">
                  Security
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Keep your Dev AI account secure.
                </p>
              </div>

            </div>

            <div className="mt-6">

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">

                <p className="text-sm font-semibold">
                  Account security
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Security controls can be added here as the
                  Security feature is developed.
                </p>

              </div>

            </div>

          </section>

        </div>

        {/* FUTURE FEATURES */}

        <div className="mt-8 rounded-3xl border border-dashed border-white/10 bg-white/2 p-6">

          <div className="flex items-start gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
              <Settings className="h-5 w-5 text-violet-400" />
            </div>

            <div>

              <h3 className="font-semibold">
                More settings coming soon
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                AI Modes, Developer Tools, File Uploads,
                Security controls and other advanced preferences
                can be connected here as those features are added.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* FOOTER */}

      <footer className="border-t border-white/10 py-6 text-center text-sm text-slate-600">
        Dev AI • Settings
      </footer>

    </main>
  );
}