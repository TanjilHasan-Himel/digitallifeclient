import useTitle from "../../hooks/useTitle";

export default function MyLessons() {
  useTitle("My Lessons");

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-900">My Lessons</h1>
      <p className="mt-2 text-slate-600">Your lesson table will load from MongoDB next.</p>
    </div>
  );
}
