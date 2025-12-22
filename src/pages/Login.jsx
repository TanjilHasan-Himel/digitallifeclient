import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth"
import axiosSecure from "../api/axiosSecure";

import useTitle from "../hooks/useTitle";
import { FaGoogle } from "react-icons/fa";

export default function Login() {
  useTitle("Login | Digital Life Lessons");
  const { loginUser, googleLogin } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/dashboard";

  const syncUser = async (firebaseUser) => {
    await axiosSecure.post("/users/upsert", {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      name: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
    });
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value.trim();
    const password = form.password.value;

    if (!email || !password) return toast.error("Email এবং Password দিন।");

    try {
      setLoading(true);
      const res = await loginUser(email, password);
      await syncUser(res.user);

      toast.success("Welcome back! লগইন সফল ✅");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setLoading(true);
      const res = await googleLogin();
      await syncUser(res.user);

      toast.success("Google login সফল ✅");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(err?.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <img src="/logo.png" alt="Digital Life Lessons" className="w-10 h-10 rounded-xl" />
          <div>
            <h1 className="text-xl font-bold">Login</h1>
            <p className="text-sm text-gray-500">Continue your lessons and reflections.</p>
          </div>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring"
            />
          </div>

          <button
            disabled={loading}
            className="w-full rounded-xl bg-black text-white py-2 font-medium hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="my-4 flex items-center gap-2">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-500">OR</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full rounded-xl border py-2 font-medium flex items-center justify-center gap-2 hover:bg-gray-50 disabled:opacity-60"
        >
          <FaGoogle /> Continue with Google
        </button>

        <p className="mt-4 text-sm text-gray-600">
          New here?{" "}
          <Link className="font-semibold underline" to="/register">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
