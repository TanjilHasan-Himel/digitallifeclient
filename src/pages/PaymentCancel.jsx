import { useNavigate } from "react-router-dom";

export default function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold">Payment Cancelled</h1>

      <div className="mt-4 rounded-xl border bg-white p-5">
        <p className="text-slate-700">
          Your payment was cancelled. You can try again anytime.
        </p>

        <button
          onClick={() => navigate("/pricing")}
          className="mt-4 px-4 py-2 rounded-lg bg-black text-white"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
