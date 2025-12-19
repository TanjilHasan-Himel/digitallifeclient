export default function LoadingSpinner({ label = "Loading..." }) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900" />
      <p className="text-slate-600">{label}</p>
    </div>
  );
}
