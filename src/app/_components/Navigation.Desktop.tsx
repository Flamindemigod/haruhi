"use client";

import { NavigationProps } from "./Navigation";
import Link from "next/link";
import Search from "./Search.Desktop";
import Dropdown, { Props as DropdownProps } from "~/primitives/Dropdown";

const DropDownProps: DropdownProps = {
  align: "center",
  sideOffset: 16,
  arrow: true,
  trigger: (
    <button className="cursor-pointer border-l border-primary-400 px-2">
      Lists
    </button>
  ),
  content: [
    {
      type: "Item",
      content: [
        {
          content: (
            <Link className="flex items-center justify-center" href={"/anime"}>
              Anime
            </Link>
          ),
          lable: "Anime List",
        },
        {
          content: (
            <Link className="flex items-center justify-center" href={"/manga"}>
              Manga
            </Link>
          ),
          lable: "Manga List",
        },
      ],
    },
  ],
};

export default (props: NavigationProps) => {
  return (
    <div className="flex items-center justify-between px-2">
      <nav className="flex items-center rounded-md bg-offWhite-100 py-2 dark:bg-offWhite-700">
        {!props.isUserAuth ? (
          <>
            <Link className="border-r border-primary-400 px-2" href={"/"}>
              Trending
            </Link>
            <Link
              className="border-l border-primary-400 px-2"
              href={"/seasonal"}
            >
              Seasonal
            </Link>
          </>
        ) : (
          <>
            <Link
              className="border-r border-primary-400 px-2"
              href={"/trending"}
            >
              Trending
            </Link>
            <Link
              className="border-x border-primary-400 px-2"
              href={"/seasonal"}
            >
              Seasonal
            </Link>
            <Dropdown {...DropDownProps} />
          </>
        )}
      </nav>
      <Search />
    </div>
  );
};
