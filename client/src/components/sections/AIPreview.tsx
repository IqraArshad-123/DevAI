"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AIPreview() {
  const router = useRouter();

  const handleTryAI = () => {
    const token = localStorage.getItem("token");

    if (token) {
      router.push("/dashboard");
    } else {
      router.push("/auth/login");
    }
  };

  return (
    <section className="px-6 py-24">

      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">

        {/* Left Side */}
        <div>

          <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
            🤖 AI in Action
          </span>

          <h2 className="mt-6 text-5xl font-bold text-white">
            See Dev AI
            <span className="text-violet-500"> Working Live</span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            Ask coding questions, get instant answers, generate code,
            debug errors and learn programming with AI.
          </p>

          <Button
            onClick={handleTryAI}
            className="mt-8 bg-violet-600 text-white hover:bg-violet-700"
          >
            Try Dev AI
          </Button>

        </div>

        {/* Right Side */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">

          <div className="flex items-center gap-2 border-b border-slate-800 pb-4">

            <div className="h-3 w-3 rounded-full bg-red-500" />
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <div className="h-3 w-3 rounded-full bg-green-500" />

            <p className="ml-4 text-sm text-slate-400">
              Dev AI Chat
            </p>

          </div>

          <div className="mt-6 flex justify-end">
            <div className="max-w-sm rounded-2xl bg-violet-600 px-5 py-3 text-white">
              How do I create an API in Next.js?
            </div>
          </div>

          <div className="mt-6">
            <div className="max-w-md rounded-2xl bg-slate-800 px-5 py-4 text-slate-300">

              You can create an API inside the
              <span className="text-violet-400"> app/api </span>
              folder.

              <div className="mt-4 rounded-xl bg-black p-4 font-mono text-sm text-green-400">
                {`export async function GET() {
  return Response.json({
    message: "Hello"
  })
}`}
              </div>

            </div>
          </div>

        </div>

      </div>

    </section>
  );
}