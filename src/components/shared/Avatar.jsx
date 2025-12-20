import { useMemo, useState } from "react";

export default function Avatar({ src, name = "User", size = 40 }) {
  const [imgError, setImgError] = useState(false);

  const initials = useMemo(() => {
    const parts = String(name).trim().split(" ").filter(Boolean);
    const first = parts[0]?.[0] || "U";
    const second = parts[1]?.[0] || "";
    return (first + second).toUpperCase();
  }, [name]);

  const showImage = src && !imgError;

  return (
    <div
      className="rounded-full border overflow-hidden flex items-center justify-center bg-gray-100 text-sm font-bold text-gray-700"
      style={{ width: size, height: size }}
      title={name}
    >
      {showImage ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
        />
      ) : (
        // fallback: initials (or you can show /logo.png)
        <span>{initials}</span>
      )}
    </div>
  );
}
