import { useEffect, useState } from "react";
import axiosSecure from "../../api/axiosSecure";
import LoadingSpinner from "../../components/shared/LoadingSpinner";

export default function DashboardHome() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        setLoading(true);
        setErr("");
        const res = await axiosSecure.get("/dashboard/summary");
        if (!ignore) setData(res.data || {});
      } catch (e) {
        console.error(e);
        if (!ignore) setErr("Could not load dashboard summary.");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>
      <p className="text-slate-600 mt-1">Track your lessons, favorites, and weekly activity.</p>

      {err ? (
        <div className="mt-5 p-4 border border-red-200 bg-red-50 text-red-700 rounded-xl">
          {err}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard title="My Lessons" value={data?.myLessons ?? 0} />
          <StatCard title="Public Lessons" value={data?.publicLessons ?? 0} />
          <StatCard title="Premium Lessons" value={data?.premiumLessons ?? 0} />
          <StatCard title="Weekly Lessons" value={data?.weeklyLessons ?? 0} />
          <StatCard title="Favorites" value={data?.favorites ?? 0} />
          <StatCard title="Comments" value={data?.comments ?? 0} />
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}
