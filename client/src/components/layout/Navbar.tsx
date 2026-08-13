"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";

export default function Navbar() {
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // =====================================================
  // CHECK LOGIN STATUS
  // =====================================================

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkAuth();

    // Agar kisi aur tab/window mein login/logout ho
    // to navbar state refresh ho sake.
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  // =====================================================
  // GET STARTED
  // =====================================================

  const handleGetStarted = () => {
    router.push("/auth/login");
  };

  // =====================================================
  // PROFILE
  // =====================================================

  const handleProfile = () => {
    router.push("/profile");
  };

  return (
    <header className="relative z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

        {/* =================================================
            LOGO
        ================================================= */}

        <button
          onClick={() => router.push("/")}
          className="cursor-pointer"
        >
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Dev <span className="text-violet-500">AI</span>
          </h1>
        </button>

        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav className="hidden items-center gap-10 md:flex">

          <a
            href="#features"
            className="text-base font-medium text-slate-300 transition hover:text-violet-400"
          >
            Features
          </a>

          <a
            href="#how-it-works"
            className="text-base font-medium text-slate-300 transition hover:text-violet-400"
          >
            How It Works
          </a>

          <a
            href="#about"
            className="text-base font-medium text-slate-300 transition hover:text-violet-400"
          >
            About
          </a>

        </nav>

        {/* =================================================
            AUTH BUTTON
        ================================================= */}

        {isLoggedIn ? (
          <Button
            onClick={handleProfile}
            className="flex items-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 px-6 py-6 text-base text-violet-300 shadow-lg shadow-violet-900/10 transition hover:scale-[1.02] hover:border-violet-500/50 hover:bg-violet-500/20 hover:text-white"
          >
            <User className="h-5 w-5" />

            Profile
          </Button>
        ) : (
          <Button
            onClick={handleGetStarted}
            className="rounded-xl bg-violet-600 px-7 py-6 text-base text-white shadow-lg shadow-violet-900/20 transition hover:scale-[1.02] hover:bg-violet-700"
          >
            Get Started
          </Button>
        )}

      </div>
    </header>
  );
}