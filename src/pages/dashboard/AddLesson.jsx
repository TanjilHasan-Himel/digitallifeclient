import useTitle from "../../hooks/useTitle";

export default function AddLesson() {
  useTitle("Add Lesson");

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-900">Add Lesson</h1>
      <p className="mt-2 text-slate-600">Form will be added next (title, category, tone, etc.).</p>
    </div>
  );
}
