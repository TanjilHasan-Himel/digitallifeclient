import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axiosSecure from "../api/axiosSecure";
import useAuth from "../hooks/useAuth";
import useTitle from "../hooks/useTitle";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import Avatar from "../components/shared/Avatar";

export default function LessonDetails() {
  useTitle("Lesson Details");
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isPremium } = useAuth();

  const [lesson, setLesson] = useState(null);
  const [locked, setLocked] = useState(false);

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  const load = async () => {
    setLocked(false);
    setLesson(null);

    try {
      const { data } = await axiosSecure.get(`/lessons/${id}`);
      setLesson(data.lesson);

      const c = await axiosSecure.get(`/lessons/${id}/comments`);
      setComments(c.data?.items || []);
    } catch (err) {
      const code = err?.response?.data?.code;
      if (code === "PREMIUM_LOCK") {
        setLocked(true);
        return;
      }
      toast.error(err?.response?.data?.message || err.message);
      navigate("/public-lessons");
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const toggleLike = async () => {
    try {
      const { data } = await axiosSecure.post(`/lessons/${id}/like`);
      setLesson((p) => ({ ...p, likesCount: data.likesCount }));
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    }
  };

  const toggleFavorite = async () => {
    try {
      const { data } = await axiosSecure.post(`/lessons/${id}/favorite`);
      setLesson((p) => ({ ...p, favoritesCount: data.favoritesCount }));
      toast.success(data.favorited ? "Saved ✅" : "Removed ✅");
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    }
  };

  const submitReport = async () => {
    const reason = prompt("Report reason (min 10 characters):");
    if (!reason) return;
    try {
      await axiosSecure.post(`/lessons/${id}/report`, { reason });
      toast.success("Reported ✅");
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    }
  };

  const addComment = async () => {
    const text = commentText.trim();
    if (text.length < 3) return toast.error("Comment too short");
    try {
      await axiosSecure.post(`/lessons/${id}/comments`, { text });
      setCommentText("");
      const c = await axiosSecure.get(`/lessons/${id}/comments`);
      setComments(c.data?.items || []);
      toast.success("Comment added ✅");
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    }
  };

  if (locked) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white border rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-slate-900">Premium lesson locked 🔒</h1>
          <p className="text-slate-600 mt-2">
            You’re logged in as a Free user. Upgrade to Premium to read this lesson.
          </p>
          <div className="mt-5 flex gap-3">
            <Link to="/pricing" className="px-4 py-2 rounded-xl bg-black text-white font-semibold">
              Go to Pricing
            </Link>
            <Link to="/public-lessons" className="px-4 py-2 rounded-xl border font-semibold">
              Back
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!lesson) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white border rounded-2xl p-7">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar src={lesson.ownerPhoto} alt={lesson.ownerName} />
            <div>
              <p className="font-semibold text-slate-900">{lesson.ownerName || "User"}</p>
              <p className="text-xs text-slate-500">
                {lesson.category} • {lesson.tone} • {lesson.accessLevel}
              </p>
            </div>
          </div>
          <div className="text-xs text-slate-500">
            {lesson.createdAt ? new Date(lesson.createdAt).toLocaleString() : ""}
          </div>
        </div>

        <h1 className="mt-5 text-3xl font-bold text-slate-900">{lesson.title}</h1>
        <p className="mt-3 text-slate-700 leading-relaxed whitespace-pre-line">{lesson.description}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          <button onClick={toggleLike} className="px-4 py-2 rounded-xl border font-semibold hover:bg-slate-50">
            👍 Like ({lesson.likesCount || 0})
          </button>
          <button onClick={toggleFavorite} className="px-4 py-2 rounded-xl border font-semibold hover:bg-slate-50">
            ⭐ Save ({lesson.favoritesCount || 0})
          </button>
          <button onClick={submitReport} className="px-4 py-2 rounded-xl bg-black text-white font-semibold hover:opacity-90">
            Report
          </button>

          {!isPremium && (
            <Link to="/pricing" className="px-4 py-2 rounded-xl border font-semibold">
              Upgrade
            </Link>
          )}
        </div>
      </div>

      {/* Comments */}
      <div className="mt-6 bg-white border rounded-2xl p-6">
        <h2 className="text-lg font-bold text-slate-900">Comments</h2>

        <div className="mt-4 flex gap-2">
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="flex-1 rounded-xl border px-4 py-3"
            placeholder="Write a helpful comment..."
          />
          <button onClick={addComment} className="px-4 py-3 rounded-xl bg-black text-white font-semibold">
            Post
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {comments.length === 0 ? (
            <p className="text-slate-600">No comments yet.</p>
          ) : (
            comments.map((c) => (
              <div key={c._id} className="border rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <Avatar src={c.photoURL} alt={c.name} />
                  <div>
                    <p className="font-semibold text-slate-900">{c.name || "User"}</p>
                    <p className="text-xs text-slate-500">
                      {c.createdAt ? new Date(c.createdAt).toLocaleString() : ""}
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-slate-700">{c.text}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
