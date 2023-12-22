import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Image
          draggable={false}
          className="p-4"
          src={"/haruhi-404.png"}
          alt="Not Found Image"
          width={400}
          height={400}
        />
        <h2 className="text-xl">404: Page Not Found</h2>
      </div>
      <p>Maybe one day Haruhi will think it up</p>
      <Link href="/" className="text-indigo-500 underline">
        Return Home
      </Link>
    </div>
  );
}
