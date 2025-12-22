import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import axiosSecure from "../api/axiosSecure";
import toast from "react-hot-toast";

export default function LessonDetails() {
  const { id } = useParams();
  const { me, user } = useAuth();
  const [lesson, setLesson] = useState(null);
  const [comments, setComments] = useState([]);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [reporting, setReporting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const viewsCount = useMemo(() => Math.floor(Math.random() * 10000), [id]);
  const [relByCategory, setRelByCategory] = useState([]);
  const [relByTone, setRelByTone] = useState([]);

  const loadAll = async () => {
    setErr("");
    setMsg("");
    try {
      const { data } = await axiosSecure.get(`/lessons/${id}`);
      setLesson(data);
      setIsLiked(Array.isArray(data.likes) ? data.likes.includes(me?.uid) : false);
      setLikesCount(data.likesCount || 0);

      const c = await axiosSecure.get(`/lessons/${id}/comments`);
      setComments(Array.isArray(c.data) ? c.data : []);

      // Related
      try {
        if (data?.category) {
          const rc = await axiosSecure.get(`/lessons/public?category=${encodeURIComponent(data.category)}&limit=6`);
          setRelByCategory((rc.data?.lessons || []).filter((x) => String(x._id) !== String(id)));
        }
        if (data?.tone) {
          const rt = await axiosSecure.get(`/lessons/public?tone=${encodeURIComponent(data.tone)}&limit=6`);
          setRelByTone((rt.data?.lessons || []).filter((x) => String(x._id) !== String(id)));
        }
      } catch {
        setRelByCategory([]);
        setRelByTone([]);
      }
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
    const reason = prompt("Report reason? (e.g. Inappropriate, Spam, Misleading)");
    if (!reason || !reason.trim()) return;
    try {
      setReporting(true);
      await axiosSecure.post(`/lessons/${id}/report`, { reason });
      toast.success("Reported. Thanks for helping keep the community safe.");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Report failed");
    } finally {
      setReporting(false);
    }
  };

  const toggleLike = async () => {
    try {
      const { data } = await axiosSecure.post(`/lessons/${id}/like`);
      setIsLiked(!!data.liked);
      setLikesCount(data.likesCount ?? 0);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Like failed");
    }
  };

  const toggleSave = async () => {
    try {
      const { data } = await axiosSecure.post("/favorites/toggle", { lessonId: id });
      setIsSaved(!!data.saved);
      toast.success(data.saved ? "Saved to favorites" : "Removed from favorites");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Save failed");
    }
  };

  const shareLesson = async () => {
    try {
      const shareData = {
        title: lesson?.title || "Life Lesson",
        text: "Check out this lesson I found on Digital Life Lessons",
        url: window.location.href,
      };
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard");
      }
    } catch {
      /* ignore */
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

      {/* Author / Creator Section */}
      <div className="mt-6 rounded-2xl border bg-white p-5">
        <h3 className="text-lg font-bold mb-3">About the Creator</h3>
        <div className="flex items-start gap-4">
          {lesson.ownerPhotoURL && (
            <img src={lesson.ownerPhotoURL} alt={lesson.ownerName} className="w-14 h-14 rounded-full object-cover" />
          )}
          <div className="flex-1">
            <p className="font-semibold text-slate-900">{lesson.ownerName || "Anonymous"}</p>
            <p className="text-sm text-slate-600">{lesson.ownerEmail}</p>
            <Link
              to={`/public-lessons?author=${lesson.ownerUid}`}
              className="mt-3 inline-block rounded-xl bg-slate-900 text-white px-4 py-2 hover:opacity-90 text-sm font-medium"
            >
              View all lessons by this author →
            </Link>
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-600">
        <div>Created: {lesson.createdAt ? new Date(lesson.createdAt).toLocaleString() : "—"}</div>
        <div>Last Updated: {lesson.updatedAt ? new Date(lesson.updatedAt).toLocaleString() : "—"}</div>
        <div>Visibility: {lesson.visibility}</div>
        <div>
          Estimated Reading Time: {Math.max(1, Math.ceil(((lesson.description || '').split(/\s+/).length)/200))} min
        </div>
        <div>❤ {likesCount} Likes</div>
        <div>👁️ {viewsCount.toLocaleString()} Views</div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
        {user && (
          <>
            <button onClick={toggleSave} className="rounded-xl border px-4 py-2 hover:bg-slate-50">
              {isSaved ? "Saved ✅" : "Save to Favorites"}
            </button>
            <button onClick={toggleLike} className="rounded-xl border px-4 py-2 hover:bg-slate-50">
              {isLiked ? "❤ Liked" : "❤ Like"}
            </button>
          </>
        )}
        <button onClick={shareLesson} className="rounded-xl border px-4 py-2 hover:bg-slate-50">
          Share
        </button>
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

      {/* Related by Category */}
      {relByCategory.length > 0 && (
        <div className="mt-10">
          <h3 className="text-lg font-bold">Similar in {lesson.category}</h3>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {relByCategory.slice(0, 6).map((r) => (
              <div key={r._id} className="rounded-xl border bg-white p-4">
                <div className="text-sm text-slate-600">{r.tone} • {r.accessLevel === 'Premium' ? '⚡ Premium' : 'Free'}</div>
                <Link className="font-semibold block mt-1" to={`/lessons/${r._id}`}>{r.title}</Link>
                <p className="text-slate-700 text-sm mt-1">{(r.description || '').slice(0, 120)}...</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related by Tone */}
      {relByTone.length > 0 && (
        <div className="mt-10">
          <h3 className="text-lg font-bold">More {lesson.tone} lessons</h3>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {relByTone.slice(0, 6).map((r) => (
              <div key={r._id} className="rounded-xl border bg-white p-4">
                <div className="text-sm text-slate-600">{r.category} • {r.accessLevel === 'Premium' ? '⚡ Premium' : 'Free'}</div>
                <Link className="font-semibold block mt-1" to={`/lessons/${r._id}`}>{r.title}</Link>
                <p className="text-slate-700 text-sm mt-1">{(r.description || '').slice(0, 120)}...</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
