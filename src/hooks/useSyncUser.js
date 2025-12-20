import { useEffect, useState } from "react";
import axiosSecure from "../api/axiosSecure";

export default function useSyncUser(user) {
  const [me, setMe] = useState(null);
  const [loadingMe, setLoadingMe] = useState(true);

  useEffect(() => {
    let alive = true;

    const run = async () => {
      try {
        setLoadingMe(true);
        if (!user?.uid) {
          if (alive) setMe(null);
          return;
        }

        // 1) upsert
        await axiosSecure.post("/users/upsert", {
          uid: user.uid,
          email: user.email,
          name: user.displayName || "User",
          photoURL: user.photoURL || "",
        });

        // 2) get me
        const res = await axiosSecure.get("/users/me");
        if (alive) setMe(res.data);
      } catch (e) {
        if (alive) setMe(null);
        // optional: console.log(e?.response?.data || e.message);
      } finally {
        if (alive) setLoadingMe(false);
      }
    };

    run();
    return () => {
      alive = false;
    };
  }, [user?.uid]); // ✅ only when user changes

  return { me, loadingMe };
}
