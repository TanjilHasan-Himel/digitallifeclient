import useTitle from "../../hooks/useTitle";
import { useAuth } from "../../providers/AuthProvider";

export default function Profile() {
  useTitle("Profile");
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-900">Profile</h1>
      <div className="mt-4 rounded-2xl border bg-white p-4">
        <p className="text-sm text-slate-600">Name: <span className="font-semibold text-slate-900">{user?.displayName || "N/A"}</span></p>
        <p className="text-sm text-slate-600">Email: <span className="font-semibold text-slate-900">{user?.email || "N/A"}</span></p>
      </div>
    </div>
  );
}
