import useTitle from "../hooks/useTitle";

export default function Pricing() {
  useTitle("Upgrade");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="rounded-2xl border bg-white p-6">
        <h1 className="text-2xl font-extrabold text-slate-900">Upgrade to Premium</h1>
        <p className="mt-2 text-slate-600">
          Next: Stripe checkout (৳1500 one-time) and webhook will mark your account Premium.
        </p>
      </div>
    </div>
  );
}
