import { Link } from "react-router-dom";
import useTitle from "../hooks/useTitle";

export default function NotFound() {
  useTitle("404");

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-3xl border bg-white p-8 text-center">
        <p className="text-6xl font-extrabold text-slate-900">404</p>
        <p className="mt-2 text-slate-600">This page doesn’t exist. Let’s get you back on track.</p>
        <Link to="/" className="inline-block mt-6 px-5 py-3 rounded-xl bg-slate-900 text-white font-semibold">
          Go Home
        </Link>
      </div>
    </div>
  );
}
