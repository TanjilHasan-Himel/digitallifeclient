import { useEffect, useState } from "react";
import axiosSecure from "../../api/axiosSecure";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import { Link } from "react-router-dom";

export default function MyLessons() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [lessons, setLessons] = useState([]);

  const load = async () => {
    try {
      setErr("");
      setLoading(true);

      // ✅ IMPORTANT: no uid param, no id param
      const { data } = await axiosSecure.get("/lessons/my");
      setLessons(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setErr(e?.response?.data?.message || "Could not load my lessons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    const ok = confirm("Delete this lesson?");
    if (!ok) return;

    try {
      await axiosSecure.delete(`/lessons/${id}`);
      await load();
      alert("Lesson deleted ✅");
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "Delete failed");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Lessons</h1>
          <p className="text-slate-600">Manage your lessons (edit / delete / view).</p>
        </div>

        <Link to="/dashboard/add-lesson" className="rounded-xl bg-black px-4 py-2 text-white">
          + Add Lesson
        </Link>
      </div>

      {err && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-red-700">
          {err}
        </div>
      )}

      <div className="mt-6 overflow-x-auto rounded-xl border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Visibility</th>
              <th className="px-4 py-3 text-left">Access</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {lessons.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-slate-600" colSpan={5}>
                  No lessons yet. Create your first one.
                </td>
              </tr>
            ) : (
              lessons.map((l) => (
                <tr key={l._id} className="border-t">
                  <td className="px-4 py-3 font-medium">{l.title}</td>
                  <td className="px-4 py-3">{l.category}</td>
                  <td className="px-4 py-3">{l.visibility}</td>
                  <td className="px-4 py-3">{l.accessLevel}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/lessons/${l._id}`}
                        className="rounded-lg border px-3 py-1"
                      >
                        View
                      </Link>

                      <Link
                        to={`/dashboard/update-lesson/${l._id}`}
                        className="rounded-lg border px-3 py-1"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => handleDelete(l._id)}
                        className="rounded-lg bg-red-600 px-3 py-1 text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
