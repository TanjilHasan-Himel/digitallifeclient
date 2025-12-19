export default function SectionTitle({ title, subtitle }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-2 text-slate-600 max-w-2xl">{subtitle}</p>
      ) : null}
    </div>
  );
}
