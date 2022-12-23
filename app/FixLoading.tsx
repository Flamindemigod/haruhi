"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function FixLoading() {
  const path = usePathname();
  const router = useRouter();

  useEffect(() => {
    const timeouts = [100].map((t) =>
      setTimeout(() => router.replace(String(path)), t)
    );
    return () => {
      timeouts.forEach((t) => clearTimeout(t));
    };
  }, [path]);

  return <></>;
}
