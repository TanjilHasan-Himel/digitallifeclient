import useTitle from "../hooks/useTitle";
import SectionTitle from "../components/shared/SectionTitle";

export default function PublicLessons() {
  useTitle("Public Lessons");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <SectionTitle
        title="Public Life Lessons"
        subtitle="Browse lessons shared by the community. Premium lessons will appear locked for Free users."
      />
      <div className="rounded-2xl border bg-white p-6 text-slate-700">
        Public lessons listing (search/filter/sort/pagination) — আমরা next step এ database দিয়ে dynamic করবো।
      </div>
    </div>
  );
}
