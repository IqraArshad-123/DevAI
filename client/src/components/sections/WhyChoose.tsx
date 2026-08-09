"use client";

import {
  Bot,
  Zap,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const reasons = [
  {
    title: "Developer Focused",
    description:
      "Built specifically for developers to generate code, debug errors and learn faster.",
    icon: Bot,
  },
  {
    title: "Lightning Fast",
    description:
      "Receive accurate AI responses within seconds and stay productive.",
    icon: Zap,
  },
  {
    title: "Secure & Private",
    description:
      "Your conversations remain safe while you focus on building amazing projects.",
    icon: ShieldCheck,
  },
];

export default function WhyChoose() {
  const router = useRouter();

  const handleExplore = () => {
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
      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-violet-600/20 blur-[120px]" />

      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-fuchsia-600/20 blur-[120px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">

        {/* Left Side */}
        <div>

          <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
            ✨ Why Developers Love Dev AI
          </span>

          <h2 className="mt-8 text-5xl font-extrabold leading-tight text-white">
            Built to make every
            <span className="block text-violet-500">
              developer more productive.
            </span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            Dev AI isn't just another chatbot. It's your personal coding
            companion that helps you write better code, solve bugs faster and
            learn new technologies with confidence.
          </p>

          {/* Explore More Button */}
          <Button
            onClick={handleExplore}
            className="mt-8 bg-violet-600 text-white shadow-lg shadow-violet-900/30 transition hover:scale-[1.02] hover:bg-violet-700"
          >
            Explore More
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

        </div>

        {/* Right Side */}
        <div className="grid gap-6">

          {reasons.map((reason) => {
            const Icon = reason.icon;

            return (
              <div
                key={reason.title}
                className="group rounded-3xl border border-slate-800 bg-white/5 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-violet-500 hover:bg-white/10"
              >

                <div className="flex items-start gap-5">

                  <div className="rounded-2xl bg-violet-600/20 p-4 transition group-hover:scale-110">
                    <Icon className="h-8 w-8 text-violet-400" />
                  </div>

                  <div>

                    <h3 className="text-xl font-semibold text-white">
                      {reason.title}
                    </h3>

                    <p className="mt-3 text-slate-400">
                      {reason.description}
                    </p>

                  </div>

                </div>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}