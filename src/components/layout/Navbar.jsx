import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";
import Avatar from "../shared/Avatar";

export default function Navbar() {
  const navigate = useNavigate();

  // যদি তোমার provider এ নাম `logout` হয়, তাও কাজ করবে
  const { user, me, logoutUser, logout, loading } = useAuth();

  const isPremium = !!me?.isPremium;

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition ${
      isActive ? "bg-black text-white" : "text-slate-700 hover:bg-slate-100"
    }`;

  const handleLogout = async () => {
    try {
      // logoutUser থাকলে সেটাই, না থাকলে logout
      await (logoutUser ? logoutUser() : logout?.());
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
      // চাইলে এখানে toast দিতে পারো
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Digital Life Lessons"
            className="h-8 w-8 rounded"
          />
          <div className="leading-tight">
            <p className="font-semibold text-slate-900">Digital Life Lessons</p>
            <p className="text-xs text-slate-500">Learn. Reflect. Grow.</p>
          </div>
        </Link>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-2">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>

          <NavLink to="/public-lessons" className={navLinkClass}>
            Public Lessons
          </NavLink>

          {/* Dashboard links only when logged in */}
          {user && (
            <>
              <NavLink to="/dashboard/add-lesson" className={navLinkClass}>
                Add Lesson
              </NavLink>
              <NavLink to="/dashboard/my-lessons" className={navLinkClass}>
                My Lessons
              </NavLink>
              <NavLink to="/dashboard/favorites" className={navLinkClass}>
                Favorites
              </NavLink>
            </>
          )}

          <NavLink to="/pricing" className={navLinkClass}>
            {isPremium ? "Premium ✅" : "Upgrade"}
          </NavLink>
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">
          {loading ? (
            <span className="text-sm text-slate-500">Loading...</span>
          ) : user ? (
            <div className="flex items-center gap-3">
              <Link to="/dashboard/profile" className="flex items-center gap-2">
                <Avatar
                  src={user?.photoURL}
                  alt={user?.displayName || "User"}
                />
                <span className="hidden sm:block text-sm text-slate-700">
                  {user?.displayName || "User"}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg text-sm font-semibold border hover:bg-slate-100"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg text-sm font-semibold border hover:bg-slate-100"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-black text-white hover:opacity-90"
              >
                Signup
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
