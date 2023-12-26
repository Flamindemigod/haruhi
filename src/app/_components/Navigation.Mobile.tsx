"use client";

import { useEffect, useRef, useState } from "react";
import { NavigationProps } from "./Navigation";
import Search from "./Search.Mobile";
import { createPortal } from "react-dom";
import Link from "next/link";
import Dropdown, { Props as DropdownProps } from "~/primitives/Dropdown";
import cx from "classix";
import * as Portal from "@radix-ui/react-portal";

import {
  HomeIcon,
  ListBulletIcon,
  MixIcon,
  RocketIcon,
} from "@radix-ui/react-icons";

const DropDownProps: DropdownProps = {
  align: "center",
  sideOffset: 16,
  arrow: true,
  trigger: (
    <button
      className={cx(
        "relative flex w-full flex-col items-center justify-center p-2",
        "before:absolute before:inset-0 before:bg-gradient-to-l before:from-transparent before:via-offWhite-800/25 before:to-transparent before:blur-lg dark:before:via-offWhite-400/25",
      )}
    >
      <ListBulletIcon className="h-5 w-5" />
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
  // const ref = useRef<Element | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    //   ref.current = document.getElementById("bot-navigation");
    setMounted(true);
  }, []);
  return (
    <Portal.Root container={document?.getElementById("bot-navigation")}>
      <nav className="grid grid-cols-mNavContainer bg-offWhite-50 text-xs dark:bg-black">
        {!props.isUserAuth ? (
          <>
            <Link
              className={cx(
                "relative col-span-2 flex w-full flex-col items-center justify-center p-2",
                "before:absolute before:inset-0 before:bg-gradient-to-l before:from-transparent before:via-offWhite-800/25 before:to-transparent before:blur-lg dark:before:via-offWhite-400/25",
              )}
              href={"/"}
            >
              <RocketIcon className="h-5 w-5" />
              Trending
            </Link>
            <div className="col-start-[search-start] col-end-[search-end]"></div>
            <Link
              className={cx(
                "relative col-span-2 flex w-full flex-col items-center justify-center p-2",
                "before:absolute before:inset-0 before:bg-gradient-to-l before:from-transparent before:via-offWhite-800/25 before:to-transparent before:blur-lg dark:before:via-offWhite-400/25",
              )}
              href={"/seasonal"}
            >
              <MixIcon className="h-5 w-5" />
              Seasonal
            </Link>
          </>
        ) : (
          <>
            <Link
              className={cx(
                "relative flex w-full flex-col items-center justify-center p-2",
                "before:absolute before:inset-0 before:bg-gradient-to-l before:from-transparent before:via-offWhite-800/25 before:to-transparent before:blur-lg dark:before:via-offWhite-400/25",
              )}
              href={"/"}
            >
              <HomeIcon className="h-5 w-5" />
              Home
            </Link>
            <Link
              className={cx(
                "relative flex w-full flex-col items-center justify-center p-2",
                "before:absolute before:inset-0 before:bg-gradient-to-l before:from-transparent before:via-offWhite-800/25 before:to-transparent before:blur-lg dark:before:via-offWhite-400/25",
              )}
              href={"/trending"}
            >
              <RocketIcon className="h-5 w-5" />
              Trending
            </Link>
            <div className="col-start-[search-start] col-end-[search-end]"></div>
            <Link
              className={cx(
                "relative flex w-full flex-col items-center justify-center p-2",
                "before:absolute before:inset-0 before:bg-gradient-to-l before:from-transparent before:via-offWhite-800/25 before:to-transparent before:blur-lg dark:before:via-offWhite-400/25",
              )}
              href={"/seasonal"}
            >
              <MixIcon className="h-5 w-5" />
              Seasonal
            </Link>
            <Dropdown {...DropDownProps} />
          </>
        )}
      </nav>
      <Search className="absolute left-1/2 top-0 h-[3.5rem] w-[3.5rem] -translate-x-1/2 -translate-y-1/4" />
    </Portal.Root>
  );
};
