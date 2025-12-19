import useTitle from "../../hooks/useTitle";

export default function Favorites() {
  useTitle("Favorites");

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-900">My Favorites</h1>
      <p className="mt-2 text-slate-600">Favorites will be connected to DB next.</p>
    </div>
  );
}
