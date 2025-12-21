import { useState } from "react";
import toast from "react-hot-toast";
import axiosSecure from "../../api/axiosSecure";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";
import { CATEGORIES, TONES, VISIBILITY, ACCESS_LEVELS } from "../../constants/lessonOptions";

export default function AddLesson() {
  useTitle("Add Lesson");

  // ✅ compatible: যদি hook এ isPremium না থাকে, me থেকে ধরবে
  const auth = useAuth();
  const isPremium = typeof auth?.isPremium === "boolean" ? auth.isPremium : !!auth?.me?.isPremium;

  // ✅ constants থেকে options (fallback সহ)
  const categories =
    Array.isArray(CATEGORIES) && CATEGORIES.length
      ? CATEGORIES
      : ["Productivity", "Mindset", "Career", "Relationships", "Communication", "Health", "Finance", "Learning", "Leadership"];

  const tones =
    Array.isArray(TONES) && TONES.length
      ? TONES
      : ["Motivational", "Reflective", "Practical", "Calm", "Honest", "Empathetic", "Challenging"];

  const visibilityOptions =
    Array.isArray(VISIBILITY) && VISIBILITY.length ? VISIBILITY : ["Public", "Private"];

  const accessOptions =
    Array.isArray(ACCESS_LEVELS) && ACCESS_LEVELS.length ? ACCESS_LEVELS : ["Free", "Premium"];

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: categories[0] || "",
    tone: tones[0] || "",
    visibility: "Public",
    accessLevel: "Free",
  });

  const [saving, setSaving] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.title.trim().length < 8) return toast.error("Title কমপক্ষে 8 অক্ষর দাও");
    if (form.description.trim().length < 30) return toast.error("Description কমপক্ষে 30 অক্ষর লিখো");

    if (form.accessLevel === "Premium" && !isPremium) {
      return toast.error("Premium lesson publish করতে Upgrade লাগবে");
    }

    try {
      setSaving(true);

      const { data } = await axiosSecure.post("/lessons", {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        tone: form.tone,
        visibility: form.visibility,
        accessLevel: form.accessLevel,
      });

      if (data?.ok) {
        toast.success("Lesson created ✅");
        setForm((p) => ({
          ...p,
          title: "",
          description: "",
          visibility: "Public",
          accessLevel: "Free",
        }));
      } else {
        toast.error("Something went wrong");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err.message;
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-900">Add Lesson</h1>
      <p className="text-slate-600 mt-1">
        Write a real-life lesson with clear advice. No placeholder text.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 bg-white border rounded-2xl p-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={onChange}
            className="mt-1 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-slate-200"
            placeholder="Example: How I stopped procrastinating with a 10-minute rule"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            rows={6}
            className="mt-1 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-slate-200"
            placeholder="Write the story + what you learned + how someone can apply it..."
          />
          <p className="text-xs text-slate-500 mt-1">
            Tip: 3 parts লিখো—Situation → Lesson → Action steps.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={onChange}
              className="mt-1 w-full rounded-xl border px-4 py-3"
            >
              {categories.map((c) => (
                <option value={c} key={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Tone</label>
            <select
              name="tone"
              value={form.tone}
              onChange={onChange}
              className="mt-1 w-full rounded-xl border px-4 py-3"
            >
              {tones.map((t) => (
                <option value={t} key={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Visibility</label>
            <select
              name="visibility"
              value={form.visibility}
              onChange={onChange}
              className="mt-1 w-full rounded-xl border px-4 py-3"
            >
              {visibilityOptions.map((v) => (
                <option value={v} key={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Access Level</label>
            <select
              name="accessLevel"
              value={form.accessLevel}
              onChange={onChange}
              className="mt-1 w-full rounded-xl border px-4 py-3"
            >
              {accessOptions.map((a) => (
                <option key={a} value={a} disabled={a === "Premium" && !isPremium}>
                  {a} {a === "Premium" && !isPremium ? "(Upgrade required)" : ""}
                </option>
              ))}
            </select>

            {!isPremium && (
              <p className="text-xs text-slate-500 mt-1">
                Premium publish করতে Upgrade লাগবে — তবে Free lesson publish করতে পারবে।
              </p>
            )}
          </div>
        </div>

        <button
          disabled={saving}
          className="w-full rounded-xl bg-black text-white py-3 font-semibold hover:opacity-90 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Publish Lesson"}
        </button>
      </form>
    </div>
  );
}
