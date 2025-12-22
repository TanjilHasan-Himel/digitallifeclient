// client/src/pages/PublicLessons.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axiosSecure from "../api/axiosSecure";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import { CATEGORIES, TONES } from "../constants/lessonOptions";
import LoadingSpinner from "../components/shared/LoadingSpinner";

export default function PublicLessons() {
  const { user, me } = useAuth();

  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [tone, setTone] = useState("");
  const [sort, setSort] = useState("newest");

  const [page, setPage] = useState(1);
  const limit = 6;

  const [loading, setLoading] = useState(true);
  const [lessons, setLessons] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const [favSet, setFavSet] = useState(new Set());

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (category) params.set("category", category);
    if (tone) params.set("tone", tone);
    if (sort) params.set("sort", sort);
    params.set("page", String(page));
    params.set("limit", String(limit));
    return params.toString();
  }, [q, category, tone, sort, page]);

  const loadFavorites = async () => {
    if (!user) return;
    try {
      const { data } = await axiosSecure.get("/favorites/my");
      const ids = new Set((data.lessons || []).map((l) => String(l._id)));
      setFavSet(ids);
    } catch {
      setFavSet(new Set());
    }
  };

  const loadLessons = async () => {
    setLoading(true);
    try {
      const { data } = await axiosSecure.get(`/lessons/public?${queryString}`);
      setLessons(data.lessons || []);
      setTotalPages(data.totalPages || 1);
    } catch {
      setLessons([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLessons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString]);

  useEffect(() => {
    loadFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  const toggleFavorite = async (lessonId) => {
    try {
      const { data } = await axiosSecure.post("/favorites/toggle", { lessonId });
      setFavSet((prev) => {
        const next = new Set(prev);
        if (data.saved) next.add(String(lessonId));
        else next.delete(String(lessonId));
        return next;
      });
    } catch (e) {
      toast.error(e?.response?.data?.message || "Favorite failed");
    }
  };

  const onFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Public Lessons</h1>
          <p className="mt-2 text-slate-600">
            Browse real lessons shared by people.
            {!me?.isPremium && (
              <span className="block mt-1 text-amber-600 text-sm font-medium">
                ⚡ Upgrade to Premium to access all premium lessons
              </span>
            )}
          </p>
        </div>
        {!me?.isPremium && (
          <Link to="/pricing" className="rounded-xl bg-amber-500 text-white px-4 py-2 hover:bg-amber-600">
            ⚡ Upgrade
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="mt-6 grid grid-cols-1 gap-3 rounded-2xl border bg-white p-4 md:grid-cols-4">
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          placeholder="Search by title/description..."
          className="rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
        />

        <select
          value={category}
          onChange={onFilterChange(setCategory)}
          className="rounded-xl border px-4 py-3"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select value={tone} onChange={onFilterChange(setTone)} className="rounded-xl border px-4 py-3">
          <option value="">All tones</option>
          {TONES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select value={sort} onChange={onFilterChange(setSort)} className="rounded-xl border px-4 py-3">
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="popular">Most saved</option>
        </select>
      </div>

      {/* List */}
      <div className="mt-8">
        {loading ? (
          <LoadingSpinner />
        ) : lessons.length === 0 ? (
          <div className="rounded-2xl border bg-white p-10 text-center text-slate-600">
            No public lessons found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {lessons.map((l) => {
              const isSaved = favSet.has(String(l._id));
              const locked = l.locked ?? (l.accessLevel === "Premium" && !me?.isPremium);
              return (
                <div key={l._id} className="relative rounded-2xl border bg-white p-5 overflow-hidden">
                  {locked && (
                    <div className="absolute inset-0 backdrop-blur-sm bg-white/50 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl">🔒</div>
                        <p className="mt-2 font-semibold">Premium Lesson – Upgrade to view</p>
                        <Link to="/pricing" className="mt-3 inline-block rounded-xl bg-amber-500 text-white px-4 py-2 hover:bg-amber-600">Upgrade</Link>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                        <span>{l.category}</span>
                        <span>•</span>
                        <span>{l.tone}</span>
                        <span>•</span>
                        <span className={l.accessLevel === "Premium" ? "text-amber-600 font-semibold" : ""}>
                          {l.accessLevel === "Premium" ? "⚡ Premium" : "Free"}
                        </span>
                      </div>

                      <h3 className="mt-3 text-xl font-bold text-slate-900 truncate">
                        {l.title}
                      </h3>

                      <p className="mt-2 text-slate-700">
                        {locked ? "This is premium content." : (l.description || "").slice(0, 140) + "..."}
                      </p>

                      <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
                        <span>By {l.ownerName || "Unknown"}</span>
                        <span>{l.createdAt ? new Date(l.createdAt).toLocaleDateString() : ""}</span>
                      </div>
                    </div>

                    {user ? (
                      <button
                        onClick={() => toggleFavorite(String(l._id))}
                        className="shrink-0 rounded-xl bg-black px-4 py-2 text-white"
                      >
                        {isSaved ? "Saved ✅" : "Save"}
                      </button>
                    ) : null}
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Link
                      to={`/lessons/${l._id}`}
                      className="rounded-xl border px-4 py-2 hover:bg-slate-50"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-10 flex items-center justify-center gap-3">
        <button
          className="rounded-xl border px-4 py-2 disabled:opacity-50"
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </button>

        <span className="text-slate-600">
          Page {page} / {totalPages}
        </span>

        <button
          className="rounded-xl border px-4 py-2 disabled:opacity-50"
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
