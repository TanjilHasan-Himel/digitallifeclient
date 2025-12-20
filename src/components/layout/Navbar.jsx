import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";
import toast from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
import { axiosSecure } from "../../api/axiosSecure";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [me, setMe] = useState(null);
  const ref = useRef(null);
  const navigate = useNavigate();

  // fetch plan from mongo (single source of truth)
  useEffect(() => {
    const run = async () => {
      if (!user) return setMe(null);
      const res = await axiosSecure.get("/users/me");
      setMe(res.data);
    };
    run().catch(() => {});
  }, [user]);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out ✅");
      navigate("/");
    } catch (e) {
      toast.error("Logout failed");
    }
  };

  const isPremium = !!me?.isPremium;

  return (
    <header className="border-b bg-white">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="Digital Life Lessons" className="w-10 h-10 rounded-xl" />
          <div className="leading-tight">
            <h1 className="font-extrabold">Digital Life Lessons</h1>
            <p className="text-xs text-gray-500">Learn. Reflect. Grow.</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-4 text-sm">
          <NavLink to="/" className={({ isActive }) => (isActive ? "font-bold" : "text-gray-600")}>Home</NavLink>
          <NavLink to="/public-lessons" className={({ isActive }) => (isActive ? "font-bold" : "text-gray-600")}>Public Lessons</NavLink>

          {user && (
            <>
              <NavLink to="/dashboard/add-lesson" className={({ isActive }) => (isActive ? "font-bold" : "text-gray-600")}>Add Lesson</NavLink>
              <NavLink to="/dashboard/my-lessons" className={({ isActive }) => (isActive ? "font-bold" : "text-gray-600")}>My Lessons</NavLink>

              {!isPremium ? (
                <NavLink to="/pricing" className={({ isActive }) => (isActive ? "font-bold" : "text-gray-600")}>Upgrade</NavLink>
              ) : (
                <span className="text-xs px-2 py-1 rounded-full bg-black text-white">Premium ⭐</span>
              )}
            </>
          )}
        </nav>

        {!user ? (
          <div className="flex items-center gap-2">
            <Link to="/login" className="px-3 py-2 text-sm rounded-xl border hover:bg-gray-50">Login</Link>
            <Link to="/register" className="px-3 py-2 text-sm rounded-xl bg-black text-white hover:opacity-90">Signup</Link>
          </div>
        ) : (
          <div className="relative" ref={ref}>
            <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-2">
              <img
                src={user.photoURL || "/logo.png"}
                alt="avatar"
                className="w-10 h-10 rounded-full border object-cover"
              />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border bg-white shadow-lg p-2">
                <div className="px-3 py-2">
                  <p className="font-semibold text-sm">{user.displayName || "User"}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <div className="h-px bg-gray-100 my-1" />
                <Link to="/dashboard/profile" className="block px-3 py-2 rounded-xl hover:bg-gray-50 text-sm" onClick={() => setOpen(false)}>
                  Profile
                </Link>
                <Link to="/dashboard" className="block px-3 py-2 rounded-xl hover:bg-gray-50 text-sm" onClick={() => setOpen(false)}>
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 text-sm">
                  Log out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
