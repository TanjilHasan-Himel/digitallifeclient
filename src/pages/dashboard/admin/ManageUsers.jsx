import axiosSecure from "../../../api/axiosSecure";
import { useEffect, useState } from "react";

export default function ManageUsers() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await axiosSecure.get("/admin/users");
      setRows(data || []);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateRole = async (uid, role) => {
    try {
      await axiosSecure.patch(`/admin/users/${uid}/role`, { role });
      await load();
      alert("Role updated");
    } catch (e) {
      alert(e?.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Manage Users</h1>
      <div className="mt-6 overflow-x-auto rounded-xl border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Total Lessons</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {(loading ? [] : rows).map((u) => (
              <tr key={u.uid} className="border-t">
                <td className="px-4 py-3">{u.name || "User"}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">{u.role}</td>
                <td className="px-4 py-3">{u.totalLessons || 0}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => updateRole(u.uid, "user")} className="rounded-lg border px-3 py-1">Make User</button>
                    <button onClick={() => updateRole(u.uid, "admin")} className="rounded-lg bg-black text-white px-3 py-1">Make Admin</button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-slate-600" colSpan={5}>No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
