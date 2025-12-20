import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { axiosPublic } from "../api/axiosSecure";
import useAuth from "../hooks/useAuth";
import useTitle from "../hooks/useTitle";
import LoadingSpinner from "../components/shared/LoadingSpinner";

export default function PublicLessons() {
  useTitle("Public Lessons");
  const { isPremium } = useAuth();

  const categories = useMemo(
    () => ["", "Productivity", "Mindset", "Career", "Relationships", "Communication", "Health", "Finance", "Learning"],
    []
  );
  const tones = useMemo(() => ["", "Motivational", "Reflective", "Practical", "Calm", "Honest", "Empathetic"], []);

  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [tone, setTone] = useState("");
  const [sort, setSort] = useState("newest");

  const [page, setPage] = useState(1);
  const limit = 9;

  const [data, setData] = useState({ items: [], totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const fetchLessons = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      q,
      category,
      tone,
      sort,
    });

    const res = await axiosPublic.get(`/lessons/public?${params.toString()}`);
    setData(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLessons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sort]);

  // reset page when filters change
  useEffect(() => {
    setPage(1);
    fetchLessons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, category, tone]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Public Lessons</h1>
          <p className="text-slate-600 mt-1">Browse real lessons shared by people.</p>
        </div>
        <Link to="/pricing" className="px-4 py-2 rounded-xl border hover:bg-slate-50 font-semibold">
          {isPremium ? "Premium ✅" : "Upgrade"}
        </Link>
      </div>

      {/* Filters */}
      <div className="mt-6 bg-white border rounded-2xl p-4 grid gap-3 sm:grid-cols-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="rounded-xl border px-3 py-2"
          placeholder="Search by title/description..."
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-xl border px-3 py-2">
          {categories.map((c) => (
            <option value={c} key={c}>
              {c ? c : "All categories"}
            </option>
          ))}
        </select>

        <select value={tone} onChange={(e) => setTone(e.target.value)} className="rounded-xl border px-3 py-2">
          {tones.map((t) => (
            <option value={t} key={t}>
              {t ? t : "All tones"}
            </option>
          ))}
        </select>

        <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-xl border px-3 py-2">
          <option value="newest">Newest</option>
          <option value="mostSaved">Most saved</option>
        </select>
      </div>

      {/* Grid */}
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {data.items.map((lesson) => {
          const locked = lesson.accessLevel === "Premium" && !isPremium;

          return (
            <div key={lesson._id} className="bg-white border rounded-2xl p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                  {lesson.category} • {lesson.tone}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${lesson.accessLevel === "Premium" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>
                  {lesson.accessLevel}
                </span>
              </div>

              <h3 className={`mt-3 font-bold text-lg text-slate-900 ${locked ? "blur-sm select-none" : ""}`}>
                {lesson.title}
              </h3>

              <p className={`mt-2 text-slate-600 text-sm ${locked ? "blur-sm select-none" : ""}`}>
                {lesson.description?.slice(0, 110)}...
              </p>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-xs text-slate-500">By {lesson.ownerName || "User"}</p>

                {locked ? (
                  <Link to="/pricing" className="px-3 py-2 rounded-xl bg-black text-white text-sm font-semibold">
                    Upgrade to unlock
                  </Link>
                ) : (
                  <Link to={`/lessons/${lesson._id}`} className="px-3 py-2 rounded-xl border text-sm font-semibold hover:bg-slate-50">
                    View details
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="mt-10 flex items-center justify-center gap-2">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-2 rounded-xl border disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-sm text-slate-600">
          Page <b>{page}</b> / {data.totalPages || 1}
        </span>

        <button
          disabled={page >= (data.totalPages || 1)}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-2 rounded-xl border disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
