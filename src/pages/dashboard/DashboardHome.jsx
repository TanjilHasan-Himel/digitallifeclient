// client/src/pages/dashboard/DashboardHome.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import axiosSecure from "../../api/axiosSecure";
import LoadingSpinner from "../../components/shared/LoadingSpinner";

export default function DashboardHome() {
  const { user, loading } = useAuth();
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!user) return;

    (async () => {
      try {
        setErr("");
        const res = await axiosSecure.get("/dashboard/summary");
        setData(res.data);
      } catch (e) {
        console.error(e);
        setErr("Could not load dashboard summary.");
      }
    })();
  }, [user, loading]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
      <p className="text-slate-600 mt-1">
        Track your lessons, favorites, and weekly activity.
      </p>

      {err && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {err}
        </div>
      )}

      {!data ? (
        <div className="mt-8">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border bg-white p-5">
              <p className="text-sm text-slate-500">Total lessons created</p>
              <p className="mt-2 text-3xl font-bold">{data.totalLessons}</p>
            </div>

            <div className="rounded-xl border bg-white p-5">
              <p className="text-sm text-slate-500">Total saved (favorites)</p>
              <p className="mt-2 text-3xl font-bold">{data.totalSaved}</p>
            </div>

            <div className="rounded-xl border bg-white p-5">
              <p className="text-sm text-slate-500">Quick actions</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  to="/dashboard/add-lesson"
                  className="px-3 py-2 rounded-lg text-sm font-semibold bg-black text-white hover:opacity-90"
                >
                  Add Lesson
                </Link>
                <Link
                  to="/dashboard/my-lessons"
                  className="px-3 py-2 rounded-lg text-sm font-semibold border hover:bg-slate-50"
                >
                  My Lessons
                </Link>
                <Link
                  to="/dashboard/my-favorites"
                  className="px-3 py-2 rounded-lg text-sm font-semibold border hover:bg-slate-50"
                >
                  My Favorites
                </Link>
              </div>
            </div>
          </div>

          {/* Weekly chart (simple bars) */}
          <div className="mt-6 rounded-xl border bg-white p-5">
            <h2 className="text-lg font-semibold">Weekly activity</h2>
            <p className="text-sm text-slate-500 mt-1">
              Lessons created over the last 7 days.
            </p>

            <div className="mt-4 grid grid-cols-7 gap-2 items-end h-32">
              {data.weekly.map((d) => (
                <div key={d.day} className="flex flex-col items-center gap-2">
                  <div
                    className="w-full rounded-md bg-slate-900"
                    style={{
                      height: `${Math.max(6, d.count * 18)}px`,
                    }}
                    title={`${d.day}: ${d.count}`}
                  />
                  <span className="text-[10px] text-slate-500">
                    {d.day.slice(5)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent lessons */}
          <div className="mt-6 rounded-xl border bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Recently added lessons</h2>
              <Link
                to="/dashboard/my-lessons"
                className="text-sm font-semibold text-slate-900 hover:underline"
              >
                View all
              </Link>
            </div>

            {data.recentLessons.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">
                No lessons yet. Create your first one.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {data.recentLessons.map((l) => (
                  <div
                    key={l._id}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 rounded-lg border p-4"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">{l.title}</p>
                      <p className="text-sm text-slate-500">
                        {l.category} • {l.tone} • {l.accessLevel}
                      </p>
                    </div>
                    <Link
                      to={`/lessons/${l._id}`}
                      className="inline-flex justify-center px-3 py-2 rounded-lg text-sm font-semibold border hover:bg-slate-50"
                    >
                      Open
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
