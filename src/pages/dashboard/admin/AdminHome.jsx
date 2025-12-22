import axiosSecure from "../../../api/axiosSecure";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../../components/shared/LoadingSpinner";

export default function AdminHome() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get("/admin/summary");
        setData(res.data);
      } catch (e) {
        setErr("Failed to load admin summary");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold">Admin Overview</h1>
      {err ? (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">{err}</div>
      ) : (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat title="Total Users" value={data?.totalUsers ?? 0} />
          <Stat title="Total Public Lessons" value={data?.totalPublic ?? 0} />
          <Stat title="Flagged Lessons" value={data?.totalFlagged ?? 0} />
          <Stat title="Today's New Lessons" value={data?.todaysNew ?? 0} />
        </div>
      )}

      <div className="mt-10">
        <h2 className="text-xl font-semibold">Most Active Contributors</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(data?.activeContrib || []).map((c) => (
            <div key={c._id} className="rounded-2xl border bg-white p-5">
              <p className="text-sm text-slate-500">User</p>
              <p className="text-lg font-bold">{c.name || c._id}</p>
              <p className="text-slate-600">Lessons: {c.count}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}
