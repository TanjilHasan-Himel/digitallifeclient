import { useState } from "react";
import axiosSecure from "../../api/axiosSecure";
import { CATEGORIES, TONES } from "../../constants/lessonOptions";

export default function AddLesson() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    const form = e.target;
    const payload = {
      title: form.title.value.trim(),
      description: form.description.value.trim(),
      category: form.category.value,
      tone: form.tone.value,
      visibility: form.visibility.value,
      accessLevel: form.accessLevel.value,
    };

    try {
      const { data } = await axiosSecure.post("/lessons", payload);
      if (data?.ok) {
        setMsg("Lesson created ✅");
        form.reset();
      } else {
        setMsg("Lesson create failed ❌");
      }
    } catch (err) {
      setMsg(err?.response?.data?.message || "Create failed ❌");
      console.log("AddLesson error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold">Add Lesson</h1>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
        <input name="title" className="border p-3 rounded" placeholder="Lesson title" required />
        <textarea name="description" className="border p-3 rounded min-h-[140px]" placeholder="Lesson description" required />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select name="category" className="border p-3 rounded" required>
            <option value="">Select category</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <select name="tone" className="border p-3 rounded" required>
            <option value="">Select tone</option>
            {TONES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select name="visibility" className="border p-3 rounded" defaultValue="Public">
            <option value="Public">Public</option>
            <option value="Private">Private</option>
          </select>

          <select name="accessLevel" className="border p-3 rounded" defaultValue="Free">
            <option value="Free">Free</option>
            <option value="Premium">Premium</option>
          </select>
        </div>

        <button disabled={loading} className="bg-black text-white py-3 rounded font-semibold">
          {loading ? "Saving..." : "Create Lesson"}
        </button>

        {msg && <p className="text-sm">{msg}</p>}
      </form>
    </div>
  );
}
