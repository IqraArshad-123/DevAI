export default function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden px-6 py-24"
    >
      {/* Background Glow */}
      <div className="absolute left-0 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[120px]" />

      <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-blue-500/10 blur-[120px]" />

      {/* Content */}
      <div className="relative mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">

          <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-5 py-2 text-sm font-medium text-violet-300">
            ✨ About Dev AI
          </span>

          <h2 className="mt-7 text-5xl font-extrabold leading-tight text-white">
            Your Personal
            <span className="bg-linear-to-r from-violet-400 via-fuchsia-500 to-blue-400 bg-clip-text text-transparent">
              {" "}AI Coding Companion
            </span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            Dev AI is designed to help developers write better code,
            understand difficult concepts, debug problems and learn
            programming faster with the power of Artificial Intelligence.
          </p>

        </div>

        {/* Cards */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">

          {/* Card 1 */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-violet-500/40 hover:bg-white/10">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600/20 text-2xl">
              🤖
            </div>

            <h3 className="mt-6 text-xl font-bold text-white">
              AI Powered
            </h3>

            <p className="mt-3 leading-7 text-slate-400">
              Get intelligent answers, code suggestions and explanations
              whenever you need help.
            </p>

          </div>

          {/* Card 2 */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-violet-500/40 hover:bg-white/10">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/20 text-2xl">
              ⚡
            </div>

            <h3 className="mt-6 text-xl font-bold text-white">
              Built for Developers
            </h3>

            <p className="mt-3 leading-7 text-slate-400">
              From debugging errors to learning new technologies, Dev AI
              keeps your development workflow simple and fast.
            </p>

          </div>

          {/* Card 3 */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-violet-500/40 hover:bg-white/10">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-fuchsia-500/20 text-2xl">
              🚀
            </div>

            <h3 className="mt-6 text-xl font-bold text-white">
              Learn & Build Faster
            </h3>

            <p className="mt-3 leading-7 text-slate-400">
              Turn your ideas into working solutions and improve your coding
              skills with an AI assistant available whenever you need it.
            </p>

          </div>

        </div>

      </div>
    </section>
  );
}