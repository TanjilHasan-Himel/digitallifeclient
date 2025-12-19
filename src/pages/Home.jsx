import useTitle from "../hooks/useTitle";
import SectionTitle from "../components/shared/SectionTitle";

export default function Home() {
  useTitle("Home");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="rounded-3xl border bg-gradient-to-br from-slate-50 to-white p-8 md:p-12">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
          Turn Experiences into Lessons That Actually Help
        </h1>
        <p className="mt-4 text-slate-600 max-w-2xl">
          Explore public life lessons, save what resonates, and build your own collection of reflections.
          Upgrade anytime to unlock Premium lessons and publish Premium content.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/public-lessons" className="px-5 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:opacity-95">
            Browse Public Lessons
          </a>
          <a href="/dashboard/add-lesson" className="px-5 py-3 rounded-xl border font-semibold text-slate-800 hover:bg-slate-50">
            Add a Lesson
          </a>
        </div>
      </div>

      <div className="mt-10">
        <SectionTitle
          title="Why Learning From Life Matters"
          subtitle="Short lessons can change how we think, decide, and recover from mistakes."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { t: "Better Decisions", d: "Spot patterns early and avoid repeating the same mistakes." },
            { t: "Emotional Clarity", d: "Label feelings and respond with intention instead of impulse." },
            { t: "Career Growth", d: "Learn from setbacks and turn feedback into progress." },
            { t: "Healthier Relationships", d: "Communicate better by understanding real-life triggers." },
          ].map((x) => (
            <div key={x.t} className="rounded-2xl border bg-white p-5">
              <p className="font-bold text-slate-900">{x.t}</p>
              <p className="mt-2 text-sm text-slate-600">{x.d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
