// Assigement 11/digital-life-lessons/client/src/pages/PaymentSuccess.jsx
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axiosSecure from "../api/axiosSecure";
import useAuth from "../hooks/useAuth";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");

  const { refreshMe } = useAuth();
  const [status, setStatus] = useState("processing");

  useEffect(() => {
    const run = async () => {
      try {
        if (!sessionId) {
          setStatus("failed");
          return;
        }

        await axiosSecure.post("/stripe/confirm", { sessionId });
        await refreshMe?.();
        setStatus("success");
      } catch (e) {
        console.error(e);
        setStatus("failed");
      }
    };

    run();
  }, [sessionId, refreshMe]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {status === "processing" && (
        <div className="rounded-2xl border bg-white p-6">
          <h1 className="text-2xl font-bold">Payment Processing…</h1>
          <p className="text-slate-600 mt-2">Please wait.</p>
        </div>
      )}

      {status === "success" && (
        <div className="rounded-2xl border bg-white p-6">
          <h1 className="text-2xl font-bold">Payment Successful ✅</h1>
          <p className="text-slate-600 mt-2">You are Premium now.</p>

          <Link
            to="/dashboard"
            className="inline-block mt-6 px-5 py-3 rounded-xl bg-black text-white font-semibold"
          >
            Go to Dashboard
          </Link>
        </div>
      )}

      {status === "failed" && (
        <div className="rounded-2xl border bg-white p-6">
          <h1 className="text-2xl font-bold text-red-600">Payment Failed ❌</h1>
          <p className="text-slate-600 mt-2">Try again from Pricing page.</p>

          <Link
            to="/pricing"
            className="inline-block mt-6 px-5 py-3 rounded-xl border font-semibold"
          >
            Back to Pricing
          </Link>
        </div>
      )}
    </div>
  );
}
