import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axiosSecure from "../../api/axiosSecure";
import useTitle from "../../hooks/useTitle";
import LoadingSpinner from "../../components/shared/LoadingSpinner";

export default function MyLessons() {
  useTitle("My Lessons");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await axiosSecure.get("/lessons/my");
      setItems(data?.items || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    const ok = confirm("Delete this lesson? This cannot be undone.");
    if (!ok) return;

    try {
      await axiosSecure.delete(`/lessons/${id}`);
      toast.success("Deleted ✅");
      setItems((p) => p.filter((x) => x._id !== id));
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-5xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Lessons</h1>
          <p className="text-slate-600 mt-1">Manage your lessons (edit / delete / view).</p>
        </div>
        <Link
          to="/dashboard/add-lesson"
          className="px-4 py-2 rounded-xl bg-black text-white font-semibold hover:opacity-90"
        >
          + Add Lesson
        </Link>
      </div>

      <div className="mt-6 bg-white border rounded-2xl overflow-hidden">
        <div className="grid grid-cols-12 gap-2 px-4 py-3 text-xs font-semibold text-slate-600 bg-slate-50">
          <div className="col-span-5">Title</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-2">Visibility</div>
          <div className="col-span-1">Likes</div>
          <div className="col-span-1">Saves</div>
          <div className="col-span-1 text-right">Action</div>
        </div>

        {items.length === 0 ? (
          <div className="p-6 text-slate-600">No lessons yet. Create your first one.</div>
        ) : (
          items.map((l) => (
            <div key={l._id} className="grid grid-cols-12 gap-2 px-4 py-4 border-t items-center">
              <div className="col-span-5">
                <p className="font-semibold text-slate-900">{l.title}</p>
                <p className="text-xs text-slate-500">
                  {l.tone} • {l.accessLevel}
                </p>
              </div>

              <div className="col-span-2 text-sm text-slate-700">{l.category}</div>

              <div className="col-span-2">
                <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                  {l.visibility}
                </span>
              </div>

              <div className="col-span-1 text-sm text-slate-700">{l.likesCount || 0}</div>
              <div className="col-span-1 text-sm text-slate-700">{l.favoritesCount || 0}</div>

              <div className="col-span-1 flex justify-end gap-2">
                <Link
                  to={`/lessons/${l._id}`}
                  className="px-3 py-2 rounded-xl border text-sm font-semibold hover:bg-slate-50"
                >
                  View
                </Link>
                <Link
                  to={`/dashboard/update-lesson/${l._id}`}
                  className="px-3 py-2 rounded-xl border text-sm font-semibold hover:bg-slate-50"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(l._id)}
                  className="px-3 py-2 rounded-xl bg-black text-white text-sm font-semibold hover:opacity-90"
                >
                  Del
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
