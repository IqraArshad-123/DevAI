import { FEATURES } from "@/constants/features";

export default function Features() {
  return (
    <section className="px-6 py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto">

        <h2 className="text-4xl font-bold text-center text-white">
          Powerful Features
        </h2>

        <p className="mt-4 text-center text-slate-400 max-w-2xl mx-auto">
          Everything you need to become a more productive developer.
        </p>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-slate-700 bg-slate-950 p-6 transition hover:border-violet-500 hover:-translate-y-2"
            >
              <div className="text-5xl">
                {feature.icon}
              </div>

              <h3 className="mt-5 text-2xl font-semibold text-white">
                {feature.title}
              </h3>

              <p className="mt-3 text-slate-400">
                {feature.description}
              </p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}