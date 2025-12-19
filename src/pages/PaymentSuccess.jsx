import useTitle from "../hooks/useTitle";

export default function PaymentSuccess() {
  useTitle("Payment Success");
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="rounded-2xl border bg-white p-6">
        <h1 className="text-2xl font-extrabold text-slate-900">Payment Successful ✅</h1>
        <p className="mt-2 text-slate-600">Premium will be activated after Stripe webhook updates MongoDB.</p>
      </div>
    </div>
  );
}
