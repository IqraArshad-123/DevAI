import { Brain, MessageSquareText, Sparkles } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Ask Anything",
    description:
      "Ask programming questions, paste your code or describe any bug you're facing.",
    icon: MessageSquareText,
  },
  {
    number: "02",
    title: "AI Understands",
    description:
      "Dev AI analyzes your request and understands the context before generating a response.",
    icon: Brain,
  },
  {
    number: "03",
    title: "Get Smart Answers",
    description:
      "Receive optimized code, explanations and debugging suggestions instantly.",
    icon: Sparkles,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden bg-slate-950 py-28 px-6">

      {/* Background Glow */}
      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-violet-600/20 blur-[120px]" />
      <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-fuchsia-600/20 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">

        <div className="text-center">

          <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-5 py-2 text-sm text-violet-300">
            ⚡ Simple Workflow
          </span>

          <h2 className="mt-6 text-5xl font-extrabold text-white">
            How
            <span className="bg-linear-to-r from-violet-400 via-fuchsia-500 to-blue-400 bg-clip-text text-transparent">
              {" "}Dev AI{" "}
            </span>
            Works
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            Just three simple steps to boost your coding productivity using AI.
          </p>

        </div>

        <div className="relative mt-20 grid gap-8 lg:grid-cols-3">

          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-white/5 p-8 backdrop-blur-md transition-all duration-300 hover:-translate-y-3 hover:border-violet-500 hover:bg-white/10"
              >
                {/* Number */}
                <div className="absolute right-6 top-5 text-6xl font-extrabold text-white/5">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600/20 transition-all duration-300 group-hover:scale-110 group-hover:bg-violet-600/30">
                  <Icon className="h-8 w-8 text-violet-400" />
                </div>

                <h3 className="mt-8 text-2xl font-bold text-white">
                  {step.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-400">
                  {step.description}
                </p>

                {/* Bottom Glow */}
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-linear-to-r from-violet-500 to-fuchsia-500 transition-all duration-500 group-hover:w-full" />
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}