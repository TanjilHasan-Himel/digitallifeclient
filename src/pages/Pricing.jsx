import useAuth from "../hooks/useAuth";
import axiosSecure from "../api/axiosSecure";

export default function Pricing() {
  const { user } = useAuth();

  const handleUpgrade = async () => {
    try {
      if (!user) {
        alert("Please login first.");
        return;
      }

      const { data } = await axiosSecure.post("/stripe/create-checkout-session");

      if (data?.url) {
        window.location.href = data.url;
        return;
      }

      alert(data?.message || "Upgrade failed. Check server console / env.");
    } catch (err) {
      console.error("Upgrade error:", err);

      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Upgrade failed. Check server console / env.";

      alert(msg);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">Pricing</h1>
      <p className="text-slate-600 mt-2">Upgrade to Premium to unlock premium lessons.</p>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="rounded-2xl border bg-white p-6">
          <h2 className="text-xl font-semibold">Free</h2>
          <p className="text-slate-600 mt-2">Access free lessons & basic features.</p>
          <p className="text-3xl font-bold mt-6">৳0</p>
        </div>

        <div className="rounded-2xl border bg-white p-6">
          <h2 className="text-xl font-semibold">Premium</h2>
          <p className="text-slate-600 mt-2">Access premium lessons & premium features.</p>
          <p className="text-3xl font-bold mt-6">৳1500</p>

          <button
            onClick={handleUpgrade}
            className="mt-6 w-full px-5 py-3 rounded-xl bg-black text-white font-semibold hover:opacity-90"
          >
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
}
