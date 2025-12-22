import { useEffect, useState } from "react";
import useTitle from "../hooks/useTitle";
import SectionTitle from "../components/shared/SectionTitle";
import HeroSlider from "../components/shared/HeroSlider";
import axiosSecure from "../api/axiosSecure";

export default function Home() {
  useTitle("Home");
  const [featured, setFeatured] = useState([]);
  const [mostSaved, setMostSaved] = useState([]);
  const [contributors, setContributors] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const f = await axiosSecure.get("/lessons/featured");
        setFeatured(f.data?.lessons || []);
      } catch {}
      try {
        const m = await axiosSecure.get("/lessons/most-saved");
        setMostSaved(m.data?.lessons || []);
      } catch {}
      try {
        const a = await axiosSecure.get("/admin/summary").catch(() => ({ data: { activeContrib: [] } }));
        setContributors(a.data?.activeContrib || []);
      } catch {}
    })();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <HeroSlider />

      {/* Featured Lessons */}
      <div className="mt-12">
        <SectionTitle title="Featured Life Lessons" subtitle="Handpicked insights from our community" />
        {featured.length === 0 ? (
          <div className="rounded-2xl border dark:border-slate-700 bg-white dark:bg-slate-800 p-8 text-slate-600 dark:text-slate-400">No featured lessons yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featured.map((l) => (
              <a key={l._id} href={`/lessons/${l._id}`} className="rounded-2xl border dark:border-slate-700 bg-white dark:bg-slate-800 p-5 block hover:bg-slate-50 dark:hover:bg-slate-700">
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-700 px-3 py-1 text-xs text-slate-700 dark:text-slate-300">
                  <span>{l.category}</span>
                  <span>•</span>
                  <span>{l.tone}</span>
                </div>
                <h3 className="mt-3 text-xl font-bold text-slate-900 dark:text-white">{l.title}</h3>
                <p className="mt-2 text-slate-700 dark:text-slate-300">{(l.description || "").slice(0, 120)}...</p>
              </a>
            ))}
          </div>
        )}
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
            <div key={x.t} className="rounded-2xl border dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
              <p className="font-bold text-slate-900 dark:text-white">{x.t}</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{x.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Contributors */}
      <div className="mt-12">
        <SectionTitle title="Top Contributors of the Week" subtitle="Most active sharers in the last 7 days" />
        {contributors.length === 0 ? (
          <div className="rounded-2xl border dark:border-slate-700 bg-white dark:bg-slate-800 p-8 text-slate-600 dark:text-slate-400">No activity yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {contributors.map((c) => (
              <div key={c._id} className="rounded-2xl border dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
                <p className="text-sm text-slate-500 dark:text-slate-400">User</p>
                <p className="text-xl font-bold dark:text-white">{c.name || c._id}</p>
                <p className="mt-1 text-slate-600 dark:text-slate-400">Lessons: {c.count}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Most Saved Lessons */}
      <div className="mt-12">
        <SectionTitle title="Most Saved Lessons" subtitle="Community favorites right now" />
        {mostSaved.length === 0 ? (
          <div className="rounded-2xl border dark:border-slate-700 bg-white dark:bg-slate-800 p-8 text-slate-600 dark:text-slate-400">No data yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mostSaved.map((l) => (
              <a key={l._id} href={`/lessons/${l._id}`} className="rounded-2xl border dark:border-slate-700 bg-white dark:bg-slate-800 p-5 block hover:bg-slate-50 dark:hover:bg-slate-700">
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-700 px-3 py-1 text-xs text-slate-700 dark:text-slate-300">
                  <span>{l.category}</span>
                  <span>•</span>
                  <span>{l.tone}</span>
                </div>
                <h3 className="mt-3 text-xl font-bold text-slate-900 dark:text-white">{l.title}</h3>
                <p className="mt-2 text-slate-700 dark:text-slate-300">{(l.description || "").slice(0, 120)}...</p>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
