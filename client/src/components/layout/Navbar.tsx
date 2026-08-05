import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/70 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8">

        {/* Logo */}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Dev <span className="text-violet-500">AI</span>
          </h1>
        </div>

        {/* Navigation */}
        <nav className="hidden items-center gap-10 md:flex">

          <a
            href="#"
            className="text-base font-medium text-slate-300 transition hover:text-violet-400"
          >
            Features
          </a>

          <a
            href="#"
            className="text-base font-medium text-slate-300 transition hover:text-violet-400"
          >
            How It Works
          </a>

          <a
            href="#"
            className="text-base font-medium text-slate-300 transition hover:text-violet-400"
          >
            About
          </a>

        </nav>

        {/* Button */}
        <Button className="rounded-xl bg-violet-600 px-7 py-6 text-base hover:bg-violet-700">
          Get Started
        </Button>

      </div>
    </header>
  );
}