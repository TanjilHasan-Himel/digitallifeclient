import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axiosSecure from "../../api/axiosSecure";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";
import LoadingSpinner from "../../components/shared/LoadingSpinner";

export default function UpdateLesson() {
  useTitle("Update Lesson");
  const { id } = useParams();
  const navigate = useNavigate();
  const { isPremium } = useAuth();

  const categories = useMemo(
    () => ["Productivity", "Mindset", "Career", "Relationships", "Communication", "Health", "Finance", "Learning"],
    []
  );
  const tones = useMemo(() => ["Motivational", "Reflective", "Practical", "Calm", "Honest", "Empathetic"], []);

  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const { data } = await axiosSecure.get(`/lessons/${id}`);
      const l = data?.lesson;
      setForm({
        title: l.title,
        description: l.description,
        category: l.category,
        tone: l.tone,
        visibility: l.visibility,
        accessLevel: l.accessLevel,
      });
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
      navigate("/dashboard/my-lessons");
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form) return;

    if (form.title.trim().length < 8) return toast.error("Title কমপক্ষে 8 অক্ষর");
    if (form.description.trim().length < 30) return toast.error("Description কমপক্ষে 30 অক্ষর");

    if (form.accessLevel === "Premium" && !isPremium) {
      return toast.error("Premium set করতে Upgrade লাগবে");
    }

    try {
      setSaving(true);
      await axiosSecure.patch(`/lessons/${id}`, {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        tone: form.tone,
        visibility: form.visibility,
        accessLevel: form.accessLevel,
      });
      toast.success("Updated ✅");
      navigate("/dashboard/my-lessons");
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!form) return <LoadingSpinner />;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-900">Update Lesson</h1>

      <form onSubmit={handleSubmit} className="mt-6 bg-white border rounded-2xl p-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={onChange}
            className="mt-1 w-full rounded-xl border px-4 py-3"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            rows={6}
            className="mt-1 w-full rounded-xl border px-4 py-3"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Category</label>
            <select name="category" value={form.category} onChange={onChange} className="mt-1 w-full rounded-xl border px-4 py-3">
              {categories.map((c) => (
                <option value={c} key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Tone</label>
            <select name="tone" value={form.tone} onChange={onChange} className="mt-1 w-full rounded-xl border px-4 py-3">
              {tones.map((t) => (
                <option value={t} key={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Visibility</label>
            <select name="visibility" value={form.visibility} onChange={onChange} className="mt-1 w-full rounded-xl border px-4 py-3">
              <option value="Public">Public</option>
              <option value="Private">Private</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Access Level</label>
            <select name="accessLevel" value={form.accessLevel} onChange={onChange} className="mt-1 w-full rounded-xl border px-4 py-3">
              <option value="Free">Free</option>
              <option value="Premium" disabled={!isPremium}>Premium {isPremium ? "" : "(Upgrade required)"}</option>
            </select>
          </div>
        </div>

        <button disabled={saving} className="w-full rounded-xl bg-black text-white py-3 font-semibold disabled:opacity-60">
          {saving ? "Saving..." : "Update Lesson"}
        </button>
      </form>
    </div>
  );
}
