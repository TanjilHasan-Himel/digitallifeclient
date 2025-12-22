import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosSecure from "../api/axiosSecure";

export default function LessonDetails() {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [comments, setComments] = useState([]);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

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

  if (err) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-red-600">{err}</p>
        <Link to="/pricing" className="inline-block mt-4 px-4 py-2 bg-black text-white rounded">
          Upgrade
        </Link>
      </div>
    );
  }

  if (!lesson) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold">{lesson.title}</h1>
      <p className="text-slate-600 mt-2">
        {lesson.category} • {lesson.tone} • {lesson.accessLevel} • by {lesson.ownerName || "Unknown"}
      </p>

      <div className="mt-5 border rounded p-4 bg-white">
        <p className="whitespace-pre-wrap">{lesson.description}</p>
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
