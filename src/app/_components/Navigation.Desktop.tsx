"use client";

import { NavigationProps } from "./Navigation";
import Link from "next/link";
import Search from "./Search.Desktop";

export default (props: NavigationProps) => {
  return (
    <div className="flex items-center justify-between bg-green-300 px-2">
      <nav className="flex items-center gap-2 bg-red-400">
        <Link className="bg-offWhite-700 px-2 py-2" href={"/"}>
          Trending
        </Link>
        <Link className="bg-offWhite-700 px-2 py-2" href={"/"}>
          Search
        </Link>
        <Link className="bg-offWhite-700 px-2 py-2" href={"/"}>
          Seasonal
        </Link>
        <Link className="bg-offWhite-700 px-2 py-2" href={"/"}>
          Lists
        </Link>
      </nav>
      <Search />
    </div>
  );
};
