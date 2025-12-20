import { useEffect, useState } from "react";
import { axiosSecure } from "../api/axiosSecure";
import { useAuth } from "../providers/AuthProvider";

export default function useSyncUser() {
  const { user } = useAuth();
  const [dbUser, setDbUser] = useState(null);

  useEffect(() => {
    const run = async () => {
      if (!user) {
        setDbUser(null);
        return;
      }

      // upsert
      await axiosSecure.post("/users/upsert", {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
      });

      // fetch me
      const res = await axiosSecure.get("/users/me");
      setDbUser(res.data);
    };

    run().catch(console.error);
  }, [user]);

  return { dbUser };
}
