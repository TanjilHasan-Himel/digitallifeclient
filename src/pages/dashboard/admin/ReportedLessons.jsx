import axiosSecure from "../../../api/axiosSecure";
import { useEffect, useState } from "react";

export default function ReportedLessons() {
  const [rows, setRows] = useState([]);
  const [details, setDetails] = useState([]);
  const [openId, setOpenId] = useState(null);

  const load = async () => {
    const { data } = await axiosSecure.get("/admin/reports");
    setRows(data || []);
  };

  useEffect(() => { load(); }, []);

  const openModal = async (lessonId) => {
    setOpenId(lessonId);
    const { data } = await axiosSecure.get(`/admin/reports/${lessonId}`);
    setDetails(data || []);
  };

  const closeModal = () => { setOpenId(null); setDetails([]); };

  const ignoreReports = async (lessonId) => {
    if (!confirm("Ignore all reports for this lesson?")) return;
    await axiosSecure.delete(`/admin/reports/${lessonId}`);
    await load();
    closeModal();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Reported/Flagged Lessons</h1>
      <div className="mt-6 overflow-x-auto rounded-xl border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="px-4 py-3 text-left">Lesson Id</th>
              <th className="px-4 py-3 text-left">Reports</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r._id} className="border-t">
                <td className="px-4 py-3">{r._id}</td>
                <td className="px-4 py-3">{r.count}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openModal(r._id)} className="rounded-lg border px-3 py-1">View</button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-slate-600" colSpan={3}>No reported lessons.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {openId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6">
            <h3 className="text-lg font-bold">Reports for {openId}</h3>
            <div className="mt-4 space-y-3 max-h-[50vh] overflow-auto">
              {details.map((d, i) => (
                <div key={i} className="rounded-xl border p-3">
                  <p className="text-sm text-slate-600">Reason</p>
                  <p>{d.reason}</p>
                </div>
              ))}
              {details.length === 0 && <p className="text-slate-600">No details.</p>}
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => ignoreReports(openId)} className="rounded-lg border px-3 py-1">Ignore All</button>
              <button onClick={closeModal} className="rounded-lg bg-black text-white px-3 py-1">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
