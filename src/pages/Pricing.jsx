import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axiosSecure from "../api/axiosSecure";

export default function Pricing() {
  const navigate = useNavigate();
  const { user, me } = useAuth();

  const handleUpgrade = async () => {
    try {
      if (!user) {
        toast.error("Please login first");
        navigate("/login", { replace: true, state: { from: { pathname: "/pricing" } } });
        return;
      }

      if (me?.isPremium) {
        toast("You already have Premium ⭐");
        return;
      }

      const { data } = await axiosSecure.post("/stripe/create-checkout-session");

      if (data?.url) {
        window.location.href = data.url;
        return;
      }

      toast.error(data?.message || "Upgrade failed. Check server console / env.");
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Upgrade failed";
      toast.error(msg);
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
          <ul className="mt-4 text-sm text-slate-700 space-y-2">
            <li>• Create up to 20 lessons</li>
            <li>• Public Free lessons only</li>
            <li>• Save to favorites</li>
            <li>• Basic listing priority</li>
            <li>• Community support</li>
            <li>• Ads may be shown</li>
          </ul>
        </div>

        <div className="rounded-2xl border bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Premium</h2>
            {me?.isPremium && <span className="text-amber-600 font-semibold">⭐ Active</span>}
          </div>
          <p className="text-slate-600 mt-2">Access premium lessons & premium features.</p>
          <p className="text-3xl font-bold mt-6">৳1500 <span className="text-sm font-normal">(one-time)</span></p>

          <ul className="mt-4 text-sm text-slate-700 space-y-2">
            <li>• Unlimited lessons</li>
            <li>• Create Premium lessons</li>
            <li>• View all Premium content</li>
            <li>• Priority listing + badge</li>
            <li>• Ad-free experience</li>
            <li>• Priority support</li>
            <li>• Early access features</li>
            <li>• Lifetime access</li>
          </ul>

          {!me?.isPremium ? (
            <button
              onClick={handleUpgrade}
              className="mt-6 w-full px-5 py-3 rounded-xl bg-black text-white font-semibold hover:opacity-90"
            >
              Upgrade to Premium
            </button>
          ) : (
            <button disabled className="mt-6 w-full px-5 py-3 rounded-xl border font-semibold text-slate-700">
              You are Premium ⭐
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
