// client/src/pages/LessonDetails.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosSecure from "../api/axiosSecure";
import useAuth from "../hooks/useAuth";
import useTitle from "../hooks/useTitle";

export default function LessonDetails() {
  useTitle("Lesson Details");
  const { id } = useParams();
  const navigate = useNavigate();
  const { me } = useAuth();

  const [lesson, setLesson] = useState(null);
  const [locked, setLocked] = useState(false);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    (async () => {
      setLoading(true);
      setLocked(false);

      try {
        const { data } = await axiosSecure.get(`/lessons/${id}`);
        if (!ignore) setLesson(data);

        // load comments
        const c = await axiosSecure.get(`/lessons/${id}/comments`);
        if (!ignore) setComments(c.data?.items || []);
      } catch (err) {
        const code = err?.response?.data?.code;
        if (err?.response?.status === 403 && code === "PREMIUM_LOCK") {
          if (!ignore) setLocked(true);
        } else {
          console.error(err?.message);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => (ignore = true);
  }, [id]);

  const submitComment = async (e) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;

    const { data } = await axiosSecure.post(`/lessons/${id}/comments`, { text: value });
    setComments((prev) => [data, ...prev]);
    setText("");
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  if (locked) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="border rounded-2xl p-6 bg-white">
          <h2 className="text-2xl font-bold">Premium lesson 🔒</h2>
          <p className="text-slate-600 mt-2">
            This lesson is Premium. Upgrade to view full details.
          </p>
          <button
            onClick={() => navigate("/pricing")}
            className="mt-5 px-5 py-2 rounded-lg bg-black text-white font-semibold hover:opacity-90"
          >
            Go to Pricing
          </button>
          <p className="mt-4 text-xs text-slate-500">
            Your plan: {me?.isPremium ? "Premium ✅" : "Free"}
          </p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <p className="text-red-600">Lesson not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="border rounded-2xl p-6 bg-white">
        <p className="text-xs text-slate-600 bg-slate-100 px-3 py-1 rounded-full inline-block">
          {lesson.category} • {lesson.tone} • {lesson.accessLevel || "Free"}
        </p>

        <h1 className="mt-4 text-3xl font-bold">{lesson.title}</h1>

        <p className="mt-3 text-slate-700 leading-relaxed whitespace-pre-line">
          {lesson.description}
        </p>

        <div className="mt-6 flex items-center justify-between text-sm text-slate-600">
          <span>By {lesson.creatorName || "Unknown"}</span>
          <span>{lesson.createdAt ? new Date(lesson.createdAt).toLocaleDateString() : ""}</span>
        </div>
      </div>

      {/* Comments */}
      <div className="mt-6 border rounded-2xl p-6 bg-white">
        <h2 className="text-xl font-bold">Comments</h2>

        <form onSubmit={submitComment} className="mt-4 flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a respectful comment..."
            className="flex-1 px-4 py-3 rounded-xl border"
          />
          <button className="px-5 py-3 rounded-xl bg-black text-white font-semibold hover:opacity-90">
            Post
          </button>
        </form>

        <div className="mt-5 space-y-3">
          {comments.length === 0 ? (
            <p className="text-sm text-slate-500">No comments yet.</p>
          ) : (
            comments.map((c) => (
              <div key={c._id} className="border rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{c.userName || "User"}</p>
                  <p className="text-xs text-slate-500">
                    {c.createdAt ? new Date(c.createdAt).toLocaleString() : ""}
                  </p>
                </div>
                <p className="mt-2 text-slate-700 text-sm">{c.text}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
