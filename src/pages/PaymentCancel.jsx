// Assigement 11/digital-life-lessons/client/src/pages/PaymentCancel.jsx
import { Link } from "react-router-dom";

export default function PaymentCancel() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="rounded-2xl border bg-white p-6">
        <h1 className="text-2xl font-bold">Payment Canceled</h1>
        <p className="text-slate-600 mt-2">No worries — you can upgrade anytime.</p>

        <Link
          to="/pricing"
          className="inline-block mt-6 px-5 py-3 rounded-xl bg-black text-white font-semibold"
        >
          Back to Pricing
        </Link>
      </div>
    </div>
  );
}
