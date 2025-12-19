import { NavLink, Outlet } from "react-router-dom";

const linkClass = ({ isActive }) =>
  `block rounded-lg px-3 py-2 text-sm font-medium ${
    isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
  }`;

export default function DashboardLayout() {
  return (
    <div className="min-h-[calc(100vh-120px)]">
      <div className="mx-auto max-w-6xl px-4 py-8 grid grid-cols-1 md:grid-cols-12 gap-6">
        <aside className="md:col-span-3">
          <div className="rounded-2xl border bg-white p-4">
            <p className="text-xs font-semibold text-slate-500">DASHBOARD</p>
            <nav className="mt-3 space-y-1">
              <NavLink to="/dashboard" className={linkClass} end>Overview</NavLink>
              <NavLink to="/dashboard/add-lesson" className={linkClass}>Add Lesson</NavLink>
              <NavLink to="/dashboard/my-lessons" className={linkClass}>My Lessons</NavLink>
              <NavLink to="/dashboard/my-favorites" className={linkClass}>Favorites</NavLink>
              <NavLink to="/dashboard/profile" className={linkClass}>Profile</NavLink>
            </nav>
          </div>
        </aside>

        <section className="md:col-span-9">
          <div className="rounded-2xl border bg-white p-5 md:p-6">
            <Outlet />
          </div>
        </section>
      </div>
    </div>
  );
}
