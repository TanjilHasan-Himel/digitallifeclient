import useAuth from "../../hooks/useAuth";
import LoadingSpinner from "../../components/shared/LoadingSpinner";

export default function Profile() {
  const auth = useAuth();

  if (!auth) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-xl font-semibold text-red-600">AuthProvider not found</h2>
        <p className="text-slate-600 mt-2">
          main.jsx এ RouterProvider কে AuthProvider দিয়ে wrap করতে হবে + useAuth hook ঠিক থাকতে হবে।
        </p>
      </div>
    );
  }

  const { user, me, loading } = auth;

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold">Profile</h1>

      <div className="mt-5 rounded-xl border bg-white p-5">
        <p className="text-slate-700">
          <span className="font-semibold">Name:</span> {user?.displayName || "User"}
        </p>
        <p className="text-slate-700">
          <span className="font-semibold">Email:</span> {user?.email}
        </p>
        <p className="text-slate-700">
          <span className="font-semibold">Role:</span> {me?.role || "user"}
        </p>
        <p className="text-slate-700">
          <span className="font-semibold">Premium:</span> {me?.isPremium ? "Yes ✅" : "No ❌"}
        </p>
      </div>
    </div>
  );
}
