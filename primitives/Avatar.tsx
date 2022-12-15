"use client";

import cx from "classnames";
import Image from "next/image";
import { useContext } from "react";
import { userContext } from "../app/UserContext";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
const Avatar = () => {
  const user = useContext(userContext);
  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>
        <Image
          src={user.userAvatar || ""}
          alt="Avatar"
          width={56}
          height={56}
          className={
            "object-cover rounded-full hover:animate-spin hover:motion-reduce:animate-none cursor-pointer"
          }
        />
      </DropdownMenuPrimitive.Trigger>
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          align="end"
          sideOffset={5}
          className={cx(
            " radix-side-top:animate-slide-up radix-side-bottom:animate-slide-down",
            "w-48 rounded-lg px-1.5 py-1 shadow-md md:w-36",
            "bg-white dark:bg-offWhite-800"
          )}
        >
          <DropdownMenuPrimitive.Item
            className={cx(
              "flex select-none items-center rounded-md px-2 py-2 text-base outline-none cursor-pointer",
              "text-offWhite-400 focus:bg-offWhite-100 hover:bg-offWhite-100 dark:text-offWhite-500 dark:focus:bg-offWhite-900"
            )}
            asChild
          >
            <a href={"https://anilist.co/settings"}>
              <span className="flex-grow text-offWhite-700 dark:text-offWhite-100 text-center">
                Anilist Settings
              </span>
            </a>
          </DropdownMenuPrimitive.Item>
          <DropdownMenuPrimitive.Item
            className={cx(
              "flex select-none items-center rounded-md px-2 py-2 text-base outline-none cursor-pointer",
              "text-offWhite-400 focus:bg-offWhite-100 hover:bg-offWhite-100 dark:text-offWhite-500 dark:focus:bg-offWhite-900"
            )}
            asChild
          >
            <Link href={"/prefrences"}>
              <span className="flex-grow text-offWhite-700 dark:text-offWhite-100 text-center">
                Prefrences
              </span>
            </Link>
          </DropdownMenuPrimitive.Item>
          <DropdownMenuPrimitive.Item
            className={cx(
              "flex select-none items-center rounded-md px-2 py-2 text-base outline-none cursor-pointer",
              "text-offWhite-400 focus:bg-offWhite-100 hover:bg-offWhite-100 dark:text-offWhite-500 dark:focus:bg-offWhite-900"
            )}
            asChild
          >
            <a href={"/api/logout"}>
              <span className="flex-grow text-red-700 dark:text-red-400 text-center">
                Logout
              </span>
            </a>
          </DropdownMenuPrimitive.Item>
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
};

export default Avatar;
