"use client";

import { NavigationProps } from "./Navigation";
import Link from "next/link";

export default (props: NavigationProps) => {
  return (
    <div className="flex w-full items-center justify-between px-2">
      <nav className="flex items-center gap-2 bg-red-400">
        <ul>
          <li>
            <Link className="rounded-md bg-offWhite-700 px-2 py-2" href={"/"}>
              Trending
            </Link>
          </li>
          <li>
            <Link className="rounded-md bg-offWhite-700 px-2 py-2" href={"/"}>
              Search
            </Link>
          </li>
          <li>
            <Link className="rounded-md bg-offWhite-700 px-2 py-2" href={"/"}>
              Seasonal
            </Link>
          </li>
          <li>
            <Link className="rounded-md bg-offWhite-700 px-2 py-2" href={"/"}>
              Lists
            </Link>
          </li>
        </ul>
      </nav>
      <div>Search</div>
    </div>
  );
};
