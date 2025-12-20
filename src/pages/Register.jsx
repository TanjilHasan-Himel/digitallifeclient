import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useTitle from "../hooks/useTitle";
import { useAuth } from "../providers/AuthProvider";
import axiosSecure from "../api/axiosSecure";


export default function Register() {
  useTitle("Register | Digital Life Lessons");
  const { createUser, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isStrongPassword = (pass) => pass.length >= 6;

  const handleRegister = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const photoURL = form.photoURL.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;

    if (!name || !email || !password) return toast.error("Name, Email, Password লাগবে।");
    if (!isStrongPassword(password)) return toast.error("Password কমপক্ষে 6 character হতে হবে।");

    try {
      setLoading(true);
      const res = await createUser(email, password);
      await updateUserProfile(name, photoURL);

      // sync user in mongo (token attaches automatically)
      await axiosSecure.post("/users/upsert", {
        uid: res.user.uid,
        email: res.user.email,
        name,
        photoURL,
      });

      toast.success("Account তৈরি হয়েছে ✅ এখন লগইন অবস্থায় আছো!");
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(err?.message || "Register failed");
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
            <h1 className="text-xl font-bold">Create Account</h1>
            <p className="text-sm text-gray-500">Start saving your real-life lessons.</p>
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <input
              name="name"
              type="text"
              placeholder="Your name"
              className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Photo URL (optional)</label>
            <input
              name="photoURL"
              type="text"
              placeholder="https://..."
              className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring"
            />
          </div>

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
              placeholder="Minimum 6 characters"
              className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring"
            />
          </div>

          <button
            disabled={loading}
            className="w-full rounded-xl bg-black text-white py-2 font-medium hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <Link className="font-semibold underline" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
