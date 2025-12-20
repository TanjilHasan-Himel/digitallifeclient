import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axiosSecure from "../../api/axiosSecure";
import useTitle from "../../hooks/useTitle";
import LoadingSpinner from "../../components/shared/LoadingSpinner";

export default function Favorites() {
  useTitle("Favorites");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await axiosSecure.get("/favorites/my");
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

  const removeFav = async (id) => {
    try {
      await axiosSecure.post(`/lessons/${id}/favorite`);
      toast.success("Removed ✅");
      setItems((p) => p.filter((x) => x._id !== id));
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold text-slate-900">Favorites</h1>
      <p className="text-slate-600 mt-1">Saved lessons you can revisit anytime.</p>

      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.length === 0 ? (
          <div className="text-slate-600">No favorites yet.</div>
        ) : (
          items.map((l) => (
            <div key={l._id} className="bg-white border rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                  {l.category} • {l.tone}
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-800">
                  Saved
                </span>
              </div>

              <h3 className="mt-3 font-bold text-slate-900">{l.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{l.description?.slice(0, 110)}...</p>

              <div className="mt-4 flex items-center justify-between">
                <Link to={`/lessons/${l._id}`} className="px-3 py-2 rounded-xl border text-sm font-semibold hover:bg-slate-50">
                  View
                </Link>
                <button
                  onClick={() => removeFav(l._id)}
                  className="px-3 py-2 rounded-xl bg-black text-white text-sm font-semibold hover:opacity-90"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
