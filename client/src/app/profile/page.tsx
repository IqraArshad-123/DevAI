"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  ShieldCheck,
  ArrowLeft,
  LogOut,
  Sparkles,
  MessageSquare,
  Pencil,
  Save,
  X,
  Image as ImageIcon,
} from "lucide-react";

type UserData = {
  name: string;
  email: string;
  plan?: "free" | "pro" | string;
  avatar?: string;
};

const API_URL = "http://localhost:5000/api/auth/me";

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<UserData | null>(null);

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // FETCH PROFILE
  // =====================================================

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/auth/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Safely handle JSON
        const contentType = response.headers.get("content-type");

        if (!contentType?.includes("application/json")) {
          const text = await response.text();

          console.error("Profile API returned non-JSON:", text);

          throw new Error(
            `Server returned ${response.status} instead of JSON`
          );
        }

        const data = await response.json();

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
          router.replace("/auth/login");
          return;
        }

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load profile"
          );
        }

        if (!data.user) {
          throw new Error("User data was not returned by server");
        }

        setUser(data.user);

        setName(data.user.name || "");
        setAvatar(data.user.avatar || "");
      } catch (error) {
        console.error("Profile Error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load your profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  // =====================================================
  // START EDITING
  // =====================================================

  const handleEdit = () => {
    if (!user) return;

    setName(user.name || "");
    setAvatar(user.avatar || "");

    setError("");
    setSuccess("");

    setEditing(true);
  };

  // =====================================================
  // CANCEL EDITING
  // =====================================================

  const handleCancel = () => {
    if (!user) return;

    setName(user.name || "");
    setAvatar(user.avatar || "");

    setError("");
    setSuccess("");

    setEditing(false);
  };

  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const handleSave = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/auth/login");
      return;
    }

    const trimmedName = name.trim();
    const trimmedAvatar = avatar.trim();

    // ===================================================
    // VALIDATE NAME
    // ===================================================

    if (trimmedName.length < 2) {
      setError("Name must contain at least 2 characters.");
      return;
    }

    if (trimmedName.length > 50) {
      setError("Name cannot exceed 50 characters.");
      return;
    }

    // ===================================================
    // START SAVING
    // ===================================================

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(API_URL, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          name: trimmedName,
          avatar: trimmedAvatar,
        }),
      });

      // =================================================
      // SAFELY HANDLE RESPONSE
      // =================================================

      const contentType = response.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        const text = await response.text();

        console.error("Update Profile API returned:", text);

        throw new Error(
          `Server returned ${response.status} instead of JSON`
        );
      }

      const data = await response.json();

      // =================================================
      // AUTH ERROR
      // =================================================

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");

        router.replace("/auth/login");

        return;
      }

      // =================================================
      // API ERROR
      // =================================================

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update profile"
        );
      }

      // =================================================
      // UPDATE LOCAL STATE
      // =================================================

      if (!data.user) {
        throw new Error(
          "Profile updated but user data was not returned."
        );
      }

      setUser(data.user);

      setName(data.user.name || "");
      setAvatar(data.user.avatar || "");

      setSuccess("Profile updated successfully.");

      setEditing(false);
    } catch (error) {
      console.error("Update Profile Error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("token");

    router.replace("/auth/login");
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050816] text-white">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-violet-600 to-blue-500 text-2xl shadow-lg shadow-violet-600/30">
            ✦
          </div>

          <p className="mt-4 text-sm text-slate-400">
            Loading your profile...
          </p>
        </div>
      </main>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      {/* Background Glow */}

      <div className="pointer-events-none fixed left-0 top-0 h-96 w-96 rounded-full bg-violet-600/10 blur-[140px]" />

      <div className="pointer-events-none fixed bottom-0 right-0 h-96 w-96 rounded-full bg-blue-600/10 blur-[140px]" />

      {/* Navbar */}

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050816]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-violet-600 to-blue-500 text-xl shadow-lg shadow-violet-600/20">
              ✦
            </div>

            <div className="text-left">
              <h1 className="text-lg font-bold">
                Dev{" "}
                <span className="text-violet-400">
                  AI
                </span>
              </h1>

              <p className="text-xs text-slate-500">
                Developer Workspace
              </p>
            </div>
          </button>

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

      <section className="relative mx-auto max-w-4xl px-6 py-12">
        {/* Heading */}

        <div className="mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
            <Sparkles className="h-4 w-4" />
            Account
          </div>

          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            My Profile
          </h2>

          <p className="mt-3 text-slate-400">
            Manage your Dev AI account and view your
            profile information.
          </p>
        </div>

        {/* Error */}

        {error && (
          <div className="mb-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Success */}

        {success && (
          <div className="mb-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-300">
            {success}
          </div>
        )}

        {/* Profile Card */}

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-black/20 backdrop-blur-xl">
          {/* Profile Header */}

          <div className="border-b border-white/10 bg-linear-to-r from-violet-600/10 via-transparent to-blue-500/10 p-8">
            <div className="flex flex-col items-center gap-5 sm:flex-row">
              {/* Avatar */}

              <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-linear-to-br from-violet-600 to-blue-500 text-3xl font-bold shadow-xl shadow-violet-900/30">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display =
                        "none";
                    }}
                  />
                ) : (
                  user?.name?.charAt(0).toUpperCase() ||
                  "U"
                )}
              </div>

              <div className="text-center sm:text-left">
                <p className="text-sm text-violet-400">
                  Developer Account
                </p>

                <h3 className="mt-1 text-3xl font-bold">
                  {user?.name || "User"}
                </h3>

                <p className="mt-2 text-slate-400">
                  {user?.email || "No email available"}
                </p>
              </div>
            </div>
          </div>

          {/* =================================================
              EDIT MODE
          ================================================= */}

          {editing ? (
            <div className="space-y-6 p-8">
              {/* Name */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Full Name
                </label>

                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/10 px-4 py-3 transition focus-within:border-violet-500/50">
                  <User className="h-5 w-5 shrink-0 text-violet-400" />

                  <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    maxLength={50}
                    placeholder="Enter your name"
                    className="w-full bg-transparent text-white outline-none placeholder:text-slate-600"
                  />
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  2–50 characters
                </p>
              </div>

              {/* Email */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Email
                </label>

                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 opacity-70">
                  <Mail className="h-5 w-5 shrink-0 text-blue-400" />

                  <input
                    type="email"
                    value={user?.email || ""}
                    readOnly
                    className="w-full bg-transparent text-slate-400 outline-none"
                  />
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Email changes will be added later
                  with verification.
                </p>
              </div>

              {/* Avatar URL */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Avatar URL
                </label>

                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/10 px-4 py-3 transition focus-within:border-violet-500/50">
                  <ImageIcon className="h-5 w-5 shrink-0 text-fuchsia-400" />

                  <input
                    type="url"
                    value={avatar}
                    onChange={(e) =>
                      setAvatar(e.target.value)
                    }
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full bg-transparent text-white outline-none placeholder:text-slate-600"
                  />
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Paste an image URL. File uploads will
                  be added later.
                </p>
              </div>

              {/* Buttons */}

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-violet-600 to-purple-600 px-5 py-3 font-semibold text-white shadow-lg shadow-violet-900/20 transition hover:scale-[1.01] hover:from-violet-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                >
                  <Save className="h-5 w-5" />

                  {saving ? "Saving..." : "Save Changes"}
                </button>

                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/10 hover:text-white disabled:opacity-50"
                >
                  <X className="h-5 w-5" />

                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Information */}

              <div className="grid gap-5 p-8 sm:grid-cols-2">
                {/* Name */}

                <div className="rounded-2xl border border-white/10 bg-black/10 p-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-violet-500/10 p-3">
                      <User className="h-5 w-5 text-violet-400" />
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-500">
                        Full Name
                      </p>

                      <p className="mt-1 font-medium text-white">
                        {user?.name || "Not available"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Email */}

                <div className="rounded-2xl border border-white/10 bg-black/10 p-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-blue-500/10 p-3">
                      <Mail className="h-5 w-5 text-blue-400" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-wider text-slate-500">
                        Email
                      </p>

                      <p className="mt-1 truncate font-medium text-white">
                        {user?.email || "Not available"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Plan */}

                <div className="rounded-2xl border border-white/10 bg-black/10 p-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-fuchsia-500/10 p-3">
                      <Sparkles className="h-5 w-5 text-fuchsia-400" />
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-500">
                        Plan
                      </p>

                      <p className="mt-1 font-medium capitalize text-white">
                        {user?.plan || "Free"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status */}

                <div className="rounded-2xl border border-white/10 bg-black/10 p-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-emerald-500/10 p-3">
                      <ShieldCheck className="h-5 w-5 text-emerald-400" />
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-500">
                        Account Status
                      </p>

                      <div className="mt-1 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />

                        <p className="font-medium text-emerald-400">
                          Active
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}

              <div className="border-t border-white/10 p-8">
                <div className="flex flex-col gap-3 sm:flex-row">
                  {/* Edit */}

                  <button
                    onClick={handleEdit}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 px-5 py-3 font-semibold text-violet-300 transition hover:border-violet-500/50 hover:bg-violet-500/20 hover:text-white"
                  >
                    <Pencil className="h-5 w-5" />

                    Edit Profile
                  </button>

                  {/* New Chat */}

                  <button
                    onClick={() => router.push("/chat")}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-violet-600 to-purple-600 px-5 py-3 font-semibold text-white shadow-lg shadow-violet-900/20 transition hover:scale-[1.01] hover:from-violet-500 hover:to-purple-500"
                  >
                    <MessageSquare className="h-5 w-5" />

                    Start New Chat
                  </button>

                  {/* Logout */}

                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-3 font-medium text-red-300 transition hover:border-red-500/40 hover:bg-red-500/10"
                  >
                    <LogOut className="h-5 w-5" />

                    Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Footer */}

      <footer className="border-t border-white/10 py-6 text-center text-sm text-slate-600">
        Dev AI • AI Powered Coding Assistant
      </footer>
    </main>
  );
}