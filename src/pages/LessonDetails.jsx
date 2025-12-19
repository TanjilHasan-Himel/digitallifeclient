import useTitle from "../hooks/useTitle";

export default function LessonDetails() {
  useTitle("Lesson Details");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="rounded-2xl border bg-white p-6">
        <h1 className="text-2xl font-extrabold text-slate-900">Lesson Details</h1>
        <p className="mt-2 text-slate-600">
          This page is protected. Next we will load lesson data from MongoDB and apply Free vs Premium access rules.
        </p>
      </div>
    </div>
  );
}
