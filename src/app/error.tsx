"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Image
          draggable={false}
          className="p-4"
          src={"/haruhi-404.png"}
          alt="Haruhi Error"
          width={400}
          height={400}
        />
        <h2 className="text-xl">{`Something went wrong`}</h2>
      </div>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
}
