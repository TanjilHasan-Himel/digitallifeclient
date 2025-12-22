import { useEffect, useState } from "react";

const slides = [
  {
    title: "Capture Lessons, Grow Faster",
    desc: "Turn daily experiences into shareable wisdom.",
  },
  {
    title: "Learn From Real People",
    desc: "Browse public lessons that resonate and inspire.",
  },
  {
    title: "Unlock Premium Insights",
    desc: "Upgrade to access premium lessons and features.",
  },
];

export default function HeroSlider() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % slides.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-slate-50 to-white">
      <div className="p-10 min-h-[220px]">
        <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900">{slides[i].title}</h2>
        <p className="mt-3 text-slate-600 max-w-2xl">{slides[i].desc}</p>
        <div className="mt-6 flex gap-3">
          <a href="/public-lessons" className="px-5 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:opacity-95">
            Explore Lessons
          </a>
          <a href="/dashboard/add-lesson" className="px-5 py-3 rounded-xl border font-semibold text-slate-800 hover:bg-slate-50">
            Share a Lesson
          </a>
        </div>
      </div>
      <Dots index={i} total={slides.length} onSelect={setI} />
    </div>
  );
}

function Dots({ index, total, onSelect }) {
  return (
    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
      {Array.from({ length: total }).map((_, k) => (
        <button
          key={k}
          onClick={() => onSelect(k)}
          className={`h-2 rounded-full transition-all ${index === k ? "w-8 bg-slate-900" : "w-2 bg-slate-300"}`}
        />
      ))}
    </div>
  );
}
