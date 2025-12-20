import { useCallback, useEffect, useState } from "react";
import axiosSecure from "../api/axiosSecure";

export default function useSyncUser(user) {
  const [me, setMe] = useState(null);
  const [meLoading, setMeLoading] = useState(true);

  const refetchMe = useCallback(async () => {
    if (!user) {
      setMe(null);
      setMeLoading(false);
      return;
    }

    setMeLoading(true);

    // 1) Upsert
    await axiosSecure.post("/users/upsert", {
      uid: user.uid,
      email: user.email,
      name: user.displayName || "User",
      photoURL: user.photoURL || "",
    });

    // 2) Get me
    const { data } = await axiosSecure.get("/users/me");
    setMe(data);
    setMeLoading(false);
  }, [user]);

  useEffect(() => {
    refetchMe().catch(() => setMeLoading(false));
  }, [refetchMe]);

  return { me, meLoading, refetchMe };
}
