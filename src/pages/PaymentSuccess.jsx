import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosSecure from "../api/axiosSecure";
import useAuth from "../hooks/useAuth"; // তোমার প্রোজেক্টে যেভাবে auth hook আছে, সেটা রাখো

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { refreshMe } = useAuth(); // refreshMe() => /users/me call করে Navbar update করবে

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const session_id = params.get("session_id");

        if (!session_id) {
          setErr("session_id missing in URL");
          setLoading(false);
          return;
        }

        // ✅ IMPORTANT: backend expects { session_id } in body
        await axiosSecure.post("/stripe/confirm", { session_id });

        // ✅ MongoDB is source of truth → refresh user plan from /users/me
        await refreshMe();

        setLoading(false);
        // চাইলে dashboard/profile এ পাঠাও
        navigate("/dashboard/profile", { replace: true });
      } catch (e) {
        const msg = e?.response?.data?.message || e.message || "Payment confirm failed";
        setErr(msg);
        setLoading(false);
      }
    };

    run();
  }, [location.search, navigate, refreshMe]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-lg">Confirming your payment…</p>
      </div>
    );
  }

  if (err) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="w-full max-w-xl rounded-xl border p-6">
          <h2 className="text-2xl font-bold text-red-600">Payment Issue</h2>
          <p className="mt-2 text-gray-700">{err}</p>
          <button
            onClick={() => navigate("/upgrade")}
            className="mt-4 px-4 py-2 rounded-lg bg-black text-white"
          >
            Back to Pricing
          </button>
        </div>
      </div>
    );
  }

  return null;
}
