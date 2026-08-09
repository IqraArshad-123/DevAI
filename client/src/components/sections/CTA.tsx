"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CTA() {
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
    <section className="relative overflow-hidden px-6 py-24">

      {/* Background Glow */}
      <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/20 blur-[140px]" />

      <div className="relative mx-auto max-w-5xl rounded-[40px] border border-violet-500/20 bg-linear-to-br from-slate-900 via-slate-950 to-black px-8 py-20 text-center shadow-[0_0_80px_rgba(139,92,246,0.18)]">

        {/* Badge */}
        <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-5 py-2 text-sm text-violet-300">
          Ready to Build?
        </span>

        {/* Heading */}
        <h2 className="mt-8 text-5xl font-extrabold text-white">
          Start Building with{" "}
          <span className="text-violet-500">
            Dev AI
          </span>
        </h2>

        {/* Description */}
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
          Generate code, fix bugs, explain concepts and become a smarter
          developer with AI.
        </p>

        {/* Button */}
        <div className="mt-10">

          <Button
            onClick={handleGetStarted}
            className="rounded-xl bg-violet-600 px-8 py-6 text-lg text-white shadow-lg shadow-violet-900/30 transition hover:scale-[1.02] hover:bg-violet-700"
          >
            Get Started Free
          </Button>

        </div>

      </div>

    </section>
  );
}