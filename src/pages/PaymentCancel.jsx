// client/src/pages/PaymentCancel.jsx
import { Link } from "react-router-dom";

export default function PaymentCancel() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="rounded-2xl border bg-white p-6">
        <h1 className="text-2xl font-bold">Payment Cancelled</h1>
        <p className="text-slate-600 mt-2">
          You cancelled the payment. You can try again anytime.
        </p>
        <div className="mt-4 flex gap-3">
          <Link className="px-4 py-2 rounded-lg bg-black text-white" to="/pricing">
            Back to Pricing
          </Link>
          <Link className="px-4 py-2 rounded-lg border" to="/public-lessons">
            Browse Lessons
          </Link>
        </div>
      </div>
    </div>
  );
}
