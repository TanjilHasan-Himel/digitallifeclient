import axiosSecure from "../../../api/axiosSecure";
import { useEffect, useState } from "react";

export default function ManageLessons() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flaggedOnly, setFlaggedOnly] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await axiosSecure.get(`/admin/lessons${flaggedOnly ? "?flagged=1" : ""}`);
      setRows(data?.lessons || []);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [flaggedOnly]);

  const setFeatured = async (id, featured) => {
    try {
      await axiosSecure.patch(`/admin/lessons/${id}`, { featured });
      await load();
    } catch (e) { alert(e?.response?.data?.message || "Update failed"); }
  };

  const deleteLesson = async (id) => {
    if (!confirm("Delete this lesson?")) return;
    try {
      await axiosSecure.delete(`/admin/lessons/${id}`);
      await load();
    } catch (e) { alert(e?.response?.data?.message || "Delete failed"); }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Lessons</h1>
        <label className="text-sm flex items-center gap-2">
          <input type="checkbox" checked={flaggedOnly} onChange={(e) => setFlaggedOnly(e.target.checked)} />
          Show flagged only
        </label>
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {(loading ? [] : rows).map((l) => (
          <div key={l._id} className="rounded-2xl border bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                  <span>{l.category}</span>
                  <span>•</span>
                  <span>{l.tone}</span>
                </div>
                <h3 className="mt-2 text-lg font-bold">{l.title}</h3>
                <p className="text-sm text-slate-600">Reports: {l.reportCount || 0}</p>
              </div>
              <div className="text-right">
                <button onClick={() => setFeatured(l._id, !l.featured)} className="rounded-lg border px-3 py-1 mr-2">
                  {l.featured ? "Unfeature" : "Feature"}
                </button>
                <button onClick={() => deleteLesson(l._id)} className="rounded-lg bg-red-600 text-white px-3 py-1">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
