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
} from "lucide-react";

type UserData = {
  name: string;
  email: string;
  plan?: string;
};

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/auth/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load profile");
        }

        setUser(data.user);
      } catch (error) {
        console.error("Profile Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/auth/login");
  };

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
                Dev <span className="text-violet-400">AI</span>
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
            Manage your Dev AI account and view your profile information.
          </p>
        </div>

        {/* Profile Card */}
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-black/20 backdrop-blur-xl">
          {/* Profile Header */}
          <div className="border-b border-white/10 bg-linear-to-r from-violet-600/10 via-transparent to-blue-500/10 p-8">
            <div className="flex flex-col items-center gap-5 sm:flex-row">
              {/* Avatar */}
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-linear-to-br from-violet-600 to-blue-500 text-3xl font-bold shadow-xl shadow-violet-900/30">
                {user?.name?.charAt(0).toUpperCase() || "U"}
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
              <button
                onClick={() => router.push("/chat")}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-violet-600 to-purple-600 px-5 py-3 font-semibold text-white shadow-lg shadow-violet-900/20 transition hover:scale-[1.01] hover:from-violet-500 hover:to-purple-500"
              >
                <MessageSquare className="h-5 w-5" />
                Start New Chat
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-3 font-medium text-red-300 transition hover:border-red-500/40 hover:bg-red-500/10"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 text-center text-sm text-slate-600">
        Dev AI • AI Powered Coding Assistant
      </footer>
    </main>
  );
}