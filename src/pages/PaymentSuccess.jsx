// client/src/pages/PaymentSuccess.jsx
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axiosSecure from "../api/axiosSecure";
import useAuth from "../hooks/useAuth";
import LoadingSpinner from "../components/shared/LoadingSpinner";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const { refreshMe } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        if (!sessionId) {
          setError("Missing session_id.");
          return;
        }
        await axiosSecure.post("/stripe/confirm", { sessionId });
        await refreshMe(); // ✅ now Navbar will show Premium ✅
      } catch (e) {
        setError(e?.response?.data?.message || "Payment confirm failed.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [sessionId, refreshMe]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="rounded-2xl border bg-white p-6">
        {error ? (
          <>
            <h1 className="text-2xl font-bold text-red-600">Payment Issue</h1>
            <p className="text-slate-600 mt-2">{error}</p>
            <div className="mt-4 flex gap-3">
              <Link className="px-4 py-2 rounded-lg border" to="/pricing">
                Back to Pricing
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-green-600">Payment Successful ✅</h1>
            <p className="text-slate-600 mt-2">
              Premium activated. Go to dashboard and test premium lessons access.
            </p>
            <div className="mt-4 flex gap-3">
              <Link className="px-4 py-2 rounded-lg bg-black text-white" to="/dashboard/profile">
                Go to Profile
              </Link>
              <Link className="px-4 py-2 rounded-lg border" to="/public-lessons">
                Browse Lessons
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
