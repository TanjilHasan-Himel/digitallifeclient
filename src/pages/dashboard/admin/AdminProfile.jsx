import useAuth from "../../../hooks/useAuth";
import { useState } from "react";
import axiosSecure from "../../../api/axiosSecure";

export default function AdminProfile() {
  const { user, me, updateUserProfile, refreshMe } = useAuth();
  const [name, setName] = useState(me?.name || user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(me?.photoURL || user?.photoURL || "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    try {
      setSaving(true);
      await updateUserProfile(name, photoURL);
      await axiosSecure.post("/users/upsert", {
        uid: user.uid,
        email: user.email,
        name,
        photoURL,
      });
      await refreshMe();
      alert("Profile updated");
    } catch (e) {
      alert(e?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold">Admin Profile</h1>
      <div className="mt-6 space-y-4">
        <div>
          <label className="text-sm font-medium">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2" />
        </div>
        <div>
          <label className="text-sm font-medium">Photo URL</label>
          <input value={photoURL} onChange={(e) => setPhotoURL(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2" />
        </div>
        <div className="rounded-xl border p-3">
          <p className="text-sm text-slate-600">Role</p>
          <p className="font-semibold">{me?.role || "user"}</p>
        </div>
        <button disabled={saving} onClick={save} className="rounded-xl bg-black text-white px-4 py-2">{saving ? "Saving..." : "Save"}</button>
      </div>
    </div>
  );
}
