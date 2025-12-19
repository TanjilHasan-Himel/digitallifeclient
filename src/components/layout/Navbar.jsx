import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";

const navClass = ({ isActive }) =>
  `px-3 py-2 rounded-lg text-sm font-medium transition ${
    isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
  }`;

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b bg-white/85 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Digital Life Lessons"
            className="h-10 w-10 rounded-xl object-cover"
          />
          <div className="leading-tight">
            <p className="font-extrabold text-slate-900 tracking-tight">
              Digital Life Lessons
            </p>
            <p className="text-xs text-slate-500">Learn. Reflect. Grow.</p>
          </div>
        </Link>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-2">
          <NavLink to="/" className={navClass} end>Home</NavLink>
          <NavLink to="/public-lessons" className={navClass}>Public Lessons</NavLink>
          <NavLink to="/dashboard/add-lesson" className={navClass}>Add Lesson</NavLink>
          <NavLink to="/dashboard/my-lessons" className={navClass}>My Lessons</NavLink>
          <NavLink to="/pricing/upgrade" className={navClass}>Upgrade</NavLink>
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2">
          {!user ? (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100">
                Login
              </Link>
              <Link to="/register" className="px-3 py-2 rounded-lg text-sm font-semibold bg-slate-900 text-white hover:opacity-95">
                Signup
              </Link>
            </div>
          ) : (
            <div className="relative group">
              <button className="flex items-center gap-2 rounded-full border px-2 py-1 hover:bg-slate-50">
                <img
                  src={user?.photoURL || "/logo.png"}
                  alt="User"
                  className="h-8 w-8 rounded-full object-cover"
                />
                <span className="hidden md:inline text-sm font-semibold text-slate-800">
                  {user?.displayName?.split(" ")[0] || "User"}
                </span>
              </button>

              {/* dropdown */}
              <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition absolute right-0 mt-2 w-56 rounded-2xl border bg-white shadow-lg p-2">
                <div className="px-3 py-2">
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {user?.displayName || "Logged In"}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                </div>
                <div className="h-px bg-slate-100 my-1" />
                <Link to="/dashboard/profile" className="block px-3 py-2 rounded-lg text-sm hover:bg-slate-50">
                  Profile
                </Link>
                <Link to="/dashboard" className="block px-3 py-2 rounded-lg text-sm hover:bg-slate-50">
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            </div>
          )}

          {/* Mobile menu hint */}
          <div className="md:hidden">
            <Link to="/public-lessons" className="px-3 py-2 rounded-lg text-sm font-semibold bg-slate-900 text-white">
              Explore
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
