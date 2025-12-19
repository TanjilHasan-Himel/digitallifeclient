import useTitle from "../../hooks/useTitle";

export default function DashboardHome() {
  useTitle("Dashboard");

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-900">Dashboard Overview</h1>
      <p className="mt-2 text-slate-600">
        Router is working ✅ Next: Firebase Auth + Mongo Sync + Lessons CRUD.
      </p>
    </div>
  );
}
