// client/src/pages/PublicLessons.jsx

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import axiosSecure from "../api/axiosSecure";
import useTitle from "../hooks/useTitle";



export default function PublicLessons() {
  useTitle("Public Lessons");
  const { me } = useAuth();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [tone, setTone] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ pages: 1 });

  const isPremiumUser = !!me?.isPremium;

  useEffect(() => {
    let ignore = false;

    (async () => {
      const { data } = await axiosSecure.get("/lessons/public", {
        params: { q, category, tone, sort, page, limit: 6 },
      });

      if (!ignore) {
        setItems(data?.items || []);
        setMeta({ pages: data?.pages || 1 });
      }
    })().catch(console.error);

    return () => (ignore = true);
  }, [q, category, tone, sort, page]);

  const canOpen = (lesson) => {
    if (lesson?.accessLevel !== "Premium") return true;
    return isPremiumUser;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Public Lessons</h1>
          <p className="text-slate-600 mt-1">Browse real lessons shared by people.</p>
        </div>

        <button
          onClick={() => navigate("/pricing")}
          className="px-4 py-2 rounded-lg border text-sm font-semibold hover:bg-slate-100"
        >
          Upgrade
        </button>
      </div>

      {/* Filters */}
      <div className="mt-6 border rounded-2xl p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            value={q}
            onChange={(e) => {
              setPage(1);
              setQ(e.target.value);
            }}
            placeholder="Search by title/description..."
            className="w-full px-4 py-3 rounded-xl border"
          />

          <select
            value={category}
            onChange={(e) => {
              setPage(1);
              setCategory(e.target.value);
            }}
            className="w-full px-4 py-3 rounded-xl border"
          >
            <option value="">All categories</option>
            <option value="Productivity">Productivity</option>
            <option value="Learning">Learning</option>
            <option value="Career">Career</option>
            <option value="Relationships">Relationships</option>
            <option value="Mindset">Mindset</option>
          </select>

          <select
            value={tone}
            onChange={(e) => {
              setPage(1);
              setTone(e.target.value);
            }}
            className="w-full px-4 py-3 rounded-xl border"
          >
            <option value="">All tones</option>
            <option value="Motivational">Motivational</option>
            <option value="Practical">Practical</option>
            <option value="Reflective">Reflective</option>
          </select>

          <select
            value={sort}
            onChange={(e) => {
              setPage(1);
              setSort(e.target.value);
            }}
            className="w-full px-4 py-3 rounded-xl border"
          >
            <option value="newest">Newest</option>
            <option value="mostSaved">Most saved</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
        {items.map((lesson) => {
          const locked = lesson.accessLevel === "Premium" && !isPremiumUser;

          return (
            <div key={lesson._id} className="border rounded-2xl p-5 bg-white relative overflow-hidden">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                  {lesson.category} • {lesson.tone}
                </p>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">
                  {lesson.accessLevel || "Free"}
                </span>
              </div>

              <h3 className={`mt-3 text-xl font-bold ${locked ? "blur-sm select-none" : ""}`}>
                {lesson.title}
              </h3>

              <p className={`mt-2 text-slate-600 ${locked ? "blur-sm select-none" : ""}`}>
                {(lesson.description || "").slice(0, 120)}
                {lesson.description?.length > 120 ? "..." : ""}
              </p>

              <p className="mt-4 text-xs text-slate-500">By {lesson.creatorName || "Unknown"}</p>

              <div className="mt-4 flex justify-end">
                {canOpen(lesson) ? (
                  <Link
                    to={`/lessons/${lesson._id}`}   // ✅ MUST match router
                    className="px-4 py-2 rounded-lg border text-sm font-semibold hover:bg-slate-100"
                  >
                    View details
                  </Link>
                ) : (
                  <button
                    onClick={() => navigate("/pricing")}
                    className="px-4 py-2 rounded-lg bg-black text-white text-sm font-semibold hover:opacity-90"
                  >
                    Upgrade to view
                  </button>
                )}
              </div>

              {locked && (
                <div className="absolute inset-0 pointer-events-none bg-white/40" />
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="mt-10 flex items-center justify-center gap-4">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 rounded-lg border disabled:opacity-40"
        >
          Prev
        </button>

        <p className="text-sm text-slate-600">
          Page {page} / {meta.pages}
        </p>

        <button
          disabled={page >= meta.pages}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 rounded-lg border disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
