import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import axiosSecure from "../api/axiosSecure";

export default function LessonDetails() {
  const { id } = useParams();
  const { me } = useAuth();
  const [lesson, setLesson] = useState(null);
  const [comments, setComments] = useState([]);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [reporting, setReporting] = useState(false);

  const loadAll = async () => {
    setErr("");
    setMsg("");
    try {
      const { data } = await axiosSecure.get(`/lessons/${id}`);
      setLesson(data);

      const c = await axiosSecure.get(`/lessons/${id}/comments`);
      setComments(Array.isArray(c.data) ? c.data : []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load details");
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const postComment = async (e) => {
    e.preventDefault();
    setMsg("");
    const text = e.target.text.value.trim();
    if (!text) return;

    try {
      await axiosSecure.post(`/lessons/${id}/comments`, { text });
      e.target.reset();
      setMsg("Comment posted ✅");
      loadAll();
    } catch (e) {
      setMsg(e?.response?.data?.message || "Comment failed ❌");
    }
  };

  const reportLesson = async () => {
    if (!lesson) return;
    const reason = prompt("Report reason?");
    if (!reason || !reason.trim()) return;
    try {
      setReporting(true);
      await axiosSecure.post(`/lessons/${id}/report`, { reason });
      alert("Reported. Thanks for helping keep the community safe.");
    } catch (e) {
      alert(e?.response?.data?.message || "Report failed");
    } finally {
      setReporting(false);
    }
  };

  if (err) {
    const isPremiumError = err.toLowerCase().includes("premium");
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className={`rounded-2xl border p-8 text-center ${isPremiumError ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200"}`}>
          <div className="text-5xl mb-4">{isPremiumError ? "⚡" : "❌"}</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {isPremiumError ? "Premium Content" : "Access Denied"}
          </h2>
          <p className={`mb-6 ${isPremiumError ? "text-amber-700" : "text-red-600"}`}>{err}</p>
          {isPremiumError && (
            <div className="mb-6 text-slate-700">
              <p className="font-medium mb-2">Upgrade to Premium to unlock:</p>
              <ul className="text-left max-w-xs mx-auto space-y-2">
                <li>✅ Access all premium lessons</li>
                <li>✅ Create premium content</li>
                <li>✅ Priority support</li>
              </ul>
            </div>
          )}
          <Link to="/pricing" className="inline-block px-6 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 font-semibold">
            {isPremiumError ? "⚡ Upgrade to Premium" : "Go to Pricing"}
          </Link>
        </div>
      </div>
    );
  }

  if (!lesson) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{lesson.title}</h1>
          <p className="text-slate-600 mt-2">
            {lesson.category} • {lesson.tone} • 
            <span className={lesson.accessLevel === "Premium" ? "text-amber-600 font-semibold" : ""}>
              {lesson.accessLevel === "Premium" ? "⚡ Premium" : "Free"}
            </span> • by {lesson.ownerName || "Unknown"}
          </p>
        </div>
      </div>

      <div className="mt-5 border rounded p-4 bg-white">
        <p className="whitespace-pre-wrap">{lesson.description}</p>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        {me?.uid && me?.uid !== lesson.ownerUid && (
          <button disabled={reporting} onClick={reportLesson} className="rounded-xl border px-4 py-2 hover:bg-slate-50">
            {reporting ? "Reporting..." : "Report lesson"}
          </button>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold">Comments</h2>

        <form onSubmit={postComment} className="mt-4 flex gap-2">
          <input name="text" className="border p-3 rounded flex-1" placeholder="Write a comment..." />
          <button className="px-4 py-3 bg-black text-white rounded">Post</button>
        </form>
        {msg && <p className="mt-2 text-sm">{msg}</p>}

        <div className="mt-5 space-y-3">
          {comments.map((c) => (
            <div key={c._id} className="border rounded p-3 bg-white">
              <p className="text-sm text-slate-600">{c.name || "User"}</p>
              <p>{c.text}</p>
            </div>
          ))}
          {comments.length === 0 && <p className="text-slate-600">No comments yet.</p>}
        </div>
      </div>
    </div>
  );
}
