"use client";

import { useEffect, useState } from "react";
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
  Settings,
  Lock,
  Eye,
  EyeOff,
  Save,
  Loader2,
  Sparkles,
} from "lucide-react";

type Theme = "dark" | "light" | "system";

type ResponseStyle =
  | "concise"
  | "balanced"
  | "detailed";

type UserSettings = {
  theme: Theme;
  notifications: boolean;
  autoSave: boolean;
  responseStyle: ResponseStyle;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function SettingsPage() {
  const router = useRouter();

  const [settings, setSettings] =
    useState<UserSettings>({
      theme: "dark",
      notifications: true,
      autoSave: true,
      responseStyle: "balanced",
    });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  // =====================================================
  // PASSWORD STATES
  // =====================================================

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showCurrent, setShowCurrent] =
    useState(false);

  const [showNew, setShowNew] =
    useState(false);

  const [showConfirm, setShowConfirm] =
    useState(false);

  const [changingPassword, setChangingPassword] =
    useState(false);

  // =====================================================
  // LOAD SETTINGS
  // =====================================================

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const token =
        localStorage.getItem("token");

      if (!token) {
        router.push("/auth/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load settings"
        );
      }

      const user = data.user;

      const loadedSettings: UserSettings = {
        theme: user.theme || "dark",
        notifications:
          user.notifications ?? true,
        autoSave:
          user.autoSave ?? true,
        responseStyle:
          user.responseStyle || "balanced",
      };

      setSettings(loadedSettings);

      applyTheme(loadedSettings.theme);
    } catch (err) {
      console.error(
        "Load Settings Error:",
        err
      );

      setError(
        "Unable to load your settings."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // APPLY THEME
  // =====================================================

  const applyTheme = (
    value: Theme
  ) => {
    const root =
      document.documentElement;

    if (value === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
      return;
    }

    if (value === "light") {
      root.classList.remove("dark");
      root.classList.add("light");
      return;
    }

    const prefersDark =
      window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

    if (prefersDark) {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
    }
  };

  // =====================================================
  // UPDATE SINGLE SETTING
  // =====================================================

  const updateSetting = async (
    changes: Partial<UserSettings>
  ) => {
    setMessage("");
    setError("");
    setSaving(true);

    const newSettings = {
      ...settings,
      ...changes,
    };

    setSettings(newSettings);

    if (changes.theme) {
      applyTheme(changes.theme);
    }

    try {
      const token =
        localStorage.getItem("token");

      if (!token) {
        router.push("/auth/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/auth/settings`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(changes),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update setting"
        );
      }

      setMessage(
        "Settings saved successfully."
      );

      setTimeout(() => {
        setMessage("");
      }, 2500);
    } catch (err) {
      console.error(
        "Update Setting Error:",
        err
      );

      setError(
        "Failed to save setting."
      );

      // Reload original values
      await loadSettings();
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // CHANGE PASSWORD
  // =====================================================

  const handleChangePassword = async () => {
    setMessage("");
    setError("");

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      setError(
        "Please fill all password fields."
      );
      return;
    }

    if (newPassword.length < 6) {
      setError(
        "New password must be at least 6 characters."
      );
      return;
    }

    if (
      newPassword !== confirmPassword
    ) {
      setError(
        "New password and confirmation do not match."
      );
      return;
    }

    setChangingPassword(true);

    try {
      const token =
        localStorage.getItem("token");

      if (!token) {
        router.push("/auth/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/auth/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
            confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to change password"
        );
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setMessage(
        "Password changed successfully."
      );

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (err: any) {
      setError(
        err.message ||
          "Failed to change password."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050816] text-white">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin text-violet-400" />
          Loading settings...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">

        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-6">

          <div className="flex items-center gap-3">

            <button
              onClick={() =>
                router.push("/dashboard")
              }
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition hover:border-violet-500/40 hover:text-violet-400"
              title="Back to Dashboard"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div>
              <h1 className="text-lg font-bold">
                Settings
              </h1>

              <p className="text-xs text-muted-foreground">
                Manage your Dev AI preferences
              </p>
            </div>

          </div>

          <button
            onClick={() =>
              router.push("/profile")
            }
            className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm text-muted-foreground transition hover:border-violet-500/40 hover:text-violet-400"
          >
            <User className="h-4 w-4" />

            <span className="hidden sm:inline">
              Profile
            </span>
          </button>

        </div>

      </header>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <section className="mx-auto max-w-6xl px-5 py-8 sm:px-6 sm:py-10">

        {/* INTRO */}

        <div className="mb-8">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm text-violet-400">
            <Sparkles className="h-4 w-4" />
            Preferences
          </div>

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Make Dev AI yours.
          </h2>

          <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
            Customize your appearance, AI
            experience, notifications,
            workspace and account security.
          </p>

        </div>

        {/* GLOBAL MESSAGE */}

        {message && (
          <div className="mb-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* =====================================================
            SETTINGS GRID
        ===================================================== */}

        <div className="grid gap-6 lg:grid-cols-2">

          {/* ===================================================
              APPEARANCE
          =================================================== */}

          <section className="rounded-3xl border border-border bg-card p-6 shadow-xl">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-500/10">
                <Palette className="h-6 w-6 text-violet-400" />
              </div>

              <div>
                <h3 className="text-lg font-semibold">
                  Appearance
                </h3>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Choose how Dev AI looks.
                </p>
              </div>

            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">

              {[
                {
                  value: "dark" as Theme,
                  label: "Dark",
                  description:
                    "Recommended",
                  icon: Moon,
                },
                {
                  value: "light" as Theme,
                  label: "Light",
                  description:
                    "Bright interface",
                  icon: Sun,
                },
                {
                  value: "system" as Theme,
                  label: "System",
                  description:
                    "Follow device",
                  icon: Monitor,
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.value}
                    onClick={() =>
                      updateSetting({
                        theme: item.value,
                      })
                    }
                    className={`rounded-2xl border p-4 text-left transition ${
                      settings.theme ===
                      item.value
                        ? "border-violet-500/50 bg-violet-500/10"
                        : "border-border bg-background hover:border-violet-500/30"
                    }`}
                  >

                    <div className="flex items-center justify-between">

                      <Icon className="h-5 w-5 text-violet-400" />

                      {settings.theme ===
                        item.value && (
                        <Check className="h-4 w-4 text-violet-400" />
                      )}

                    </div>

                    <p className="mt-4 text-sm font-semibold">
                      {item.label}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.description}
                    </p>

                  </button>
                );
              })}

            </div>

          </section>

          {/* ===================================================
              AI PREFERENCES
          =================================================== */}

          <section className="rounded-3xl border border-border bg-card p-6 shadow-xl">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10">
                <Bot className="h-6 w-6 text-blue-400" />
              </div>

              <div>
                <h3 className="text-lg font-semibold">
                  AI Preferences
                </h3>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Control how Dev AI responds.
                </p>
              </div>

            </div>

            <div className="mt-6">

              <p className="mb-3 text-sm font-semibold">
                Response style
              </p>

              <div className="grid gap-3">

                {[
                  {
                    value:
                      "concise" as ResponseStyle,
                    title: "Concise",
                    description:
                      "Short, direct answers with minimal explanation.",
                  },
                  {
                    value:
                      "balanced" as ResponseStyle,
                    title: "Balanced",
                    description:
                      "Useful explanations without unnecessary length.",
                  },
                  {
                    value:
                      "detailed" as ResponseStyle,
                    title: "Detailed",
                    description:
                      "Comprehensive answers with examples and deeper explanation.",
                  },
                ].map((item) => (

                  <button
                    key={item.value}
                    onClick={() =>
                      updateSetting({
                        responseStyle:
                          item.value,
                      })
                    }
                    className={`flex items-start justify-between rounded-2xl border p-4 text-left transition ${
                      settings.responseStyle ===
                      item.value
                        ? "border-blue-500/40 bg-blue-500/10"
                        : "border-border bg-background hover:border-blue-500/30"
                    }`}
                  >

                    <div className="pr-4">

                      <p className="text-sm font-semibold">
                        {item.title}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        {item.description}
                      </p>

                    </div>

                    {settings.responseStyle ===
                      item.value && (
                      <Check className="mt-1 h-4 w-4 shrink-0 text-blue-400" />
                    )}

                  </button>

                ))}

              </div>

            </div>

          </section>

          {/* ===================================================
              NOTIFICATIONS
          =================================================== */}

          <section className="rounded-3xl border border-border bg-card p-6 shadow-xl">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10">
                <Bell className="h-6 w-6 text-emerald-400" />
              </div>

              <div>
                <h3 className="text-lg font-semibold">
                  Notifications
                </h3>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Control important Dev AI updates.
                </p>
              </div>

            </div>

            <div className="mt-6">

              <div className="flex items-center justify-between rounded-2xl border border-border bg-background p-4">

                <div className="pr-4">

                  <p className="text-sm font-semibold">
                    Notifications
                  </p>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Receive important Dev AI updates.
                  </p>

                </div>

                <button
                  onClick={() =>
                    updateSetting({
                      notifications:
                        !settings.notifications,
                    })
                  }
                  className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                    settings.notifications
                      ? "bg-emerald-500"
                      : "bg-slate-600"
                  }`}
                >

                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                      settings.notifications
                        ? "left-6"
                        : "left-1"
                    }`}
                  />

                </button>

              </div>

            </div>

          </section>

          {/* ===================================================
              WORKSPACE
          =================================================== */}

          <section className="rounded-3xl border border-border bg-card p-6 shadow-xl">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10">
                <Settings className="h-6 w-6 text-amber-400" />
              </div>

              <div>
                <h3 className="text-lg font-semibold">
                  Workspace
                </h3>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Manage workspace behavior.
                </p>
              </div>

            </div>

            <div className="mt-6">

              <div className="flex items-center justify-between rounded-2xl border border-border bg-background p-4">

                <div className="pr-4">

                  <p className="text-sm font-semibold">
                    Auto-save
                  </p>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Automatically save workspace changes.
                  </p>

                </div>

                <button
                  onClick={() =>
                    updateSetting({
                      autoSave:
                        !settings.autoSave,
                    })
                  }
                  className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                    settings.autoSave
                      ? "bg-violet-500"
                      : "bg-slate-600"
                  }`}
                >

                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                      settings.autoSave
                        ? "left-6"
                        : "left-1"
                    }`}
                  />

                </button>

              </div>

            </div>

          </section>

          {/* ===================================================
              ACCOUNT
          =================================================== */}

          <section className="rounded-3xl border border-border bg-card p-6 shadow-xl">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/10">
                <User className="h-6 w-6 text-cyan-400" />
              </div>

              <div>
                <h3 className="text-lg font-semibold">
                  Account
                </h3>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Manage your account information.
                </p>
              </div>

            </div>

            <div className="mt-6">

              <button
                onClick={() =>
                  router.push("/profile")
                }
                className="flex w-full items-center justify-between rounded-2xl border border-border bg-background p-4 text-left transition hover:border-cyan-500/30"
              >

                <div>

                  <p className="text-sm font-semibold">
                    Profile
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    View and update your profile.
                  </p>

                </div>

                <ArrowLeft className="h-5 w-5 rotate-180 text-muted-foreground" />

              </button>

            </div>

          </section>

          {/* ===================================================
              SECURITY
          =================================================== */}

          <section className="rounded-3xl border border-border bg-card p-6 shadow-xl">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-500/10">
                <Shield className="h-6 w-6 text-red-400" />
              </div>

              <div>
                <h3 className="text-lg font-semibold">
                  Security
                </h3>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Keep your Dev AI account secure.
                </p>
              </div>

            </div>

            <div className="mt-6 space-y-3">

              {/* CURRENT PASSWORD */}

              <div className="relative">

                <input
                  type={
                    showCurrent
                      ? "text"
                      : "password"
                  }
                  value={currentPassword}
                  onChange={(e) =>
                    setCurrentPassword(
                      e.target.value
                    )
                  }
                  placeholder="Current password"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 pr-12 text-sm outline-none transition focus:border-violet-500"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowCurrent(
                      !showCurrent
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showCurrent ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>

              </div>

              {/* NEW PASSWORD */}

              <div className="relative">

                <input
                  type={
                    showNew
                      ? "text"
                      : "password"
                  }
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(
                      e.target.value
                    )
                  }
                  placeholder="New password"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 pr-12 text-sm outline-none transition focus:border-violet-500"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowNew(!showNew)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNew ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>

              </div>

              {/* CONFIRM PASSWORD */}

              <div className="relative">

                <input
                  type={
                    showConfirm
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  placeholder="Confirm new password"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 pr-12 text-sm outline-none transition focus:border-violet-500"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirm(
                      !showConfirm
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>

              </div>

              <button
                onClick={handleChangePassword}
                disabled={
                  changingPassword
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {changingPassword ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Changing password...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Change Password
                  </>
                )}

              </button>

            </div>

          </section>

        </div>

        {/* SAVE INDICATOR */}

        {saving && (
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Save className="h-4 w-4" />
            Saving changes...
          </div>
        )}

      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        Dev AI • Settings
      </footer>

    </main>
  );
}