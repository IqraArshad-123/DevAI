"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleGetStarted = () => {
    const token = localStorage.getItem("token");

    if (token) {
      router.push("/dashboard");
    } else {
      router.push("/auth/login");
    }
  };

  return (
    <header className="relative z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

        {/* Logo */}
        <button
          onClick={() => router.push("/")}
          className="cursor-pointer"
        >
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Dev <span className="text-violet-500">AI</span>
          </h1>
        </button>

        {/* Navigation */}
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

        {/* Button */}
        <Button
          onClick={handleGetStarted}
          className="rounded-xl bg-violet-600 px-7 py-6 text-base text-white shadow-lg shadow-violet-900/20 transition hover:bg-violet-700 hover:scale-[1.02]"
        >
          Get Started
        </Button>

      </div>
    </header>
  );
}