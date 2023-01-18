"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function FixLoading() {
  const path = usePathname();
  const router = useRouter();

  useEffect(() => {
    const timeouts = [100, 500, 1000, 2000].map((t) =>
      setTimeout(() => router.replace(String(path)), t)
    );
    return () => {
      timeouts.forEach((t) => clearTimeout(t));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  return <></>;
}
