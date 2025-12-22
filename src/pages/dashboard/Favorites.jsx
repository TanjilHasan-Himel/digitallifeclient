import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosSecure from "../../api/axiosSecure";

export default function Favorites() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setErr("");
        const { data } = await axiosSecure.get("/favorites/my");
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        setErr(e?.response?.data?.message || "Failed to load favorites");
      }
    })();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold">Favorites</h1>
      {err && <p className="mt-3 text-red-600">{err}</p>}

      <div className="mt-6 grid gap-4">
        {items.map((l) => (
          <div key={l._id} className="border dark:border-slate-700 rounded p-4 bg-white dark:bg-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-semibold dark:text-white">{l.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{l.category} • {l.tone}</p>
            </div>
            <Link className="px-3 py-2 border dark:border-slate-600 dark:text-white rounded hover:bg-slate-50 dark:hover:bg-slate-700" to={`/lessons/${l._id}`}>
              View
            </Link>
          </div>
        ))}
        {items.length === 0 && !err && <p className="text-slate-600">No favorites yet.</p>}
      </div>
    </div>
  );
}
