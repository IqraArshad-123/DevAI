import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative flex min-h-[calc(100vh-64px)] items-center justify-center overflow-hidden bg-slate-950 px-6">

      {/* Background Glow */}
      <div className="absolute -left-24 top-20 h-80 w-80 rounded-full bg-violet-600/20 blur-[120px]" />
      <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-[150px]" />
      <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-500/10 blur-[120px]" />

      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl text-center">

        <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-5 py-2 text-sm font-medium text-violet-300 backdrop-blur-md">
           AI Powered Coding Assistant
        </span>

        <h1 className="mt-8 text-6xl font-extrabold leading-tight text-white md:text-7xl">
          Build Faster with{" "}
          <span className="bg-linear-to-r from-violet-400 via-fuchsia-500 to-blue-400 bg-clip-text text-transparent">
            Dev AI
          </span>
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-slate-300">
          Dev AI helps developers generate code, debug errors, explain complex
          concepts, and boost productivity with the power of Artificial
          Intelligence.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button className="bg-violet-600 px-8 py-6 text-base hover:bg-violet-700">
            Start Chatting
          </Button>

          <Button
            variant="outline"
            className="border-slate-700 bg-white/5 px-8 py-6 text-base text-white hover:bg-slate-800"
          >
            Learn More
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-16 flex flex-wrap justify-center gap-10 text-center">
          <div>
            <h3 className="text-3xl font-bold text-violet-400">10K+</h3>
            <p className="text-slate-400">Developers</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-violet-400">99%</h3>
            <p className="text-slate-400">Accuracy</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-violet-400">24/7</h3>
            <p className="text-slate-400">AI Support</p>
          </div>
        </div>

      </div>
    </section>
  );
}