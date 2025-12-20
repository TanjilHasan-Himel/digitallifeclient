import { NavLink, Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";

const linkClass = ({ isActive }) =>
  `block px-4 py-3 rounded-lg text-sm font-medium transition ${
    isActive ? "bg-black text-white" : "text-slate-700 hover:bg-slate-100"
  }`;

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="md:col-span-3">
          <div className="bg-white border rounded-2xl p-4">
            <p className="text-xs font-semibold tracking-widest text-slate-500 mb-3">
              DASHBOARD
            </p>

            <nav className="space-y-2">
              <NavLink to="/dashboard" end className={linkClass}>
                Overview
              </NavLink>
              <NavLink to="/dashboard/add-lesson" className={linkClass}>
                Add Lesson
              </NavLink>
              <NavLink to="/dashboard/my-lessons" className={linkClass}>
                My Lessons
              </NavLink>
              <NavLink to="/dashboard/favorites" className={linkClass}>
                Favorites
              </NavLink>
              <NavLink to="/dashboard/profile" className={linkClass}>
                Profile
              </NavLink>
            </nav>
          </div>
        </aside>

        {/* Main */}
        <main className="md:col-span-9">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
