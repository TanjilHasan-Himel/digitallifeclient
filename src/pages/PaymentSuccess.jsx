import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import axiosSecure from "../api/axiosSecure";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { refreshMe } = useAuth();
  const [status, setStatus] = useState("confirming");

  useEffect(() => {
    const sessionId = params.get("session_id");
    if (!sessionId) {
      setStatus("failed");
      return;
    }

    (async () => {
      try {
        await axiosSecure.post("/stripe/confirm", { session_id: sessionId });
        await refreshMe?.();
        setStatus("done");

        // auto redirect
        setTimeout(() => navigate("/dashboard"), 1200);
      } catch (e) {
        console.error(e);
        setStatus("failed");
      }
    })();
  }, [params, navigate, refreshMe]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold">Payment Status</h1>

      {status === "confirming" && (
        <p className="mt-3 text-slate-600">Confirming your payment...</p>
      )}

      {status === "done" && (
        <div className="mt-4 rounded-xl border bg-white p-5">
          <p className="text-green-700 font-semibold">Premium Activated ✅</p>
          <p className="text-slate-600 mt-1">Redirecting to dashboard...</p>
        </div>
      )}

      {status === "failed" && (
        <div className="mt-4 rounded-xl border bg-white p-5">
          <p className="text-red-600 font-semibold">
            Payment confirmation failed ❌
          </p>
          <p className="text-slate-600 mt-1">
            Please try again or contact support.
          </p>
          <button
            onClick={() => navigate("/pricing")}
            className="mt-4 px-4 py-2 rounded-lg bg-black text-white"
          >
            Back to Pricing
          </button>
        </div>
      )}
    </div>
  );
}
