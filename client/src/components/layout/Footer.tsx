import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative border-t border-slate-800 bg-slate-950">

      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-600/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 py-16">

        <div className="grid gap-12 md:grid-cols-4">

          {/* Logo */}
          <div>

            <Link href="/" className="inline-block">
              <h2 className="text-3xl font-bold text-white">
                Dev
                <span className="text-violet-500">
                  AI
                </span>
              </h2>
            </Link>

            <p className="mt-4 leading-7 text-slate-400">
              AI Powered Coding Assistant built for developers to write better
              code faster.
            </p>

          </div>

          {/* Quick Links */}
          <div>

            <h3 className="text-lg font-semibold text-white">
              Quick Links
            </h3>

            <div className="mt-5 flex flex-col gap-3">

              <Link
                href="/"
                className="text-slate-400 transition hover:text-violet-400"
              >
                Home
              </Link>

              <Link
                href="/#features"
                className="text-slate-400 transition hover:text-violet-400"
              >
                Features
              </Link>

              <Link
                href="/#how-it-works"
                className="text-slate-400 transition hover:text-violet-400"
              >
                How It Works
              </Link>

              <Link
                href="/chat"
                className="text-slate-400 transition hover:text-violet-400"
              >
                Dashboard
              </Link>

            </div>

          </div>

          {/* Resources */}
          <div>

            <h3 className="text-lg font-semibold text-white">
              Resources
            </h3>

            <div className="mt-5 flex flex-col gap-3">

              <Link
                href="/chat"
                className="text-slate-400 transition hover:text-violet-400"
              >
                Documentation
              </Link>

              <Link
                href="/privacy"
                className="text-slate-400 transition hover:text-violet-400"
              >
                Privacy Policy
              </Link>

              <Link
                href="/terms"
                className="text-slate-400 transition hover:text-violet-400"
              >
                Terms & Conditions
              </Link>

            </div>

          </div>

          {/* Social */}
          <div>

            <h3 className="text-lg font-semibold text-white">
              Follow Us
            </h3>

            <div className="mt-5 flex flex-wrap gap-3">

              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-violet-500 hover:bg-violet-600 hover:text-white"
              >
                GitHub
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-violet-500 hover:bg-violet-600 hover:text-white"
              >
                LinkedIn
              </a>

              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-violet-500 hover:bg-violet-600 hover:text-white"
              >
                X
              </a>

            </div>

          </div>

        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-slate-800 pt-8 text-center text-slate-500">
          © 2025 Dev AI. Built with ❤️ using Next.js, TypeScript & AI.
        </div>

      </div>

    </footer>
  );
}