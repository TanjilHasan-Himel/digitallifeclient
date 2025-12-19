import useTitle from "../hooks/useTitle";

export default function PaymentCancel() {
  useTitle("Payment Cancelled");
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="rounded-2xl border bg-white p-6">
        <h1 className="text-2xl font-extrabold text-slate-900">Payment Cancelled</h1>
        <p className="mt-2 text-slate-600">No worries — you can upgrade anytime from the Upgrade page.</p>
      </div>
    </div>
  );
}
