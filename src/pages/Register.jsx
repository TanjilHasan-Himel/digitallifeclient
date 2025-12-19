import useTitle from "../hooks/useTitle";

export default function Register() {
  useTitle("Register");
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="max-w-md rounded-2xl border bg-white p-6">
        <h1 className="text-2xl font-extrabold text-slate-900">Register</h1>
        <p className="mt-2 text-slate-600">Next: Firebase signup + validations.</p>
      </div>
    </div>
  );
}
