import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Avatar from "../shared/Avatar";
import { useTheme } from "../../providers/ThemeProvider";



export default function Navbar() {
  const navigate = useNavigate();
  const { isDark, toggle } = useTheme();
  // যদি তোমার provider এ নাম `logout` হয়, তাও কাজ করবে
  const { user, me, logoutUser, logout, loading } = useAuth();

  const isPremium = !!me?.isPremium;

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition ${
      isActive ? "bg-black dark:bg-white text-white dark:text-black" : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
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
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b dark:border-slate-700">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Digital Life Lessons"
            className="h-8 md:h-9 lg:h-10 w-auto rounded object-contain transition-transform duration-200 hover:scale-105"
            loading="lazy"
          />
          <div className="leading-tight">
            <p className="font-semibold text-slate-900 dark:text-white">Digital Life Lessons</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Learn. Reflect. Grow.</p>
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
              {me?.role === "admin" && (
                <NavLink to="/dashboard/admin" className={navLinkClass}>
                  Admin
                </NavLink>
              )}
            </>
          )}

          {!isPremium && (
            <NavLink to="/pricing" className={navLinkClass}>
              Upgrade
            </NavLink>
          )}
          {isPremium && (
            <span className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700">
              Premium ✅
            </span>
          )}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? "☀️" : "🌙"}
          </button>

          {loading ? (
            <span className="text-sm text-slate-500">Loading...</span>
          ) : user ? (
            <div className="flex items-center gap-3">
              <Link to="/dashboard/profile" className="flex items-center gap-2">
                <Avatar
                  src={user?.photoURL}
                  alt={user?.displayName || "User"}
                />
                <span className="hidden sm:block text-sm text-slate-700 dark:text-slate-300">
                  {user?.displayName || "User"}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg text-sm font-semibold border dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-white"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg text-sm font-semibold border dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-white"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-black dark:bg-white text-white dark:text-black hover:opacity-90"
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
