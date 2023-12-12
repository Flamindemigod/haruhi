"use client";

import cx from "classix";
import Image from "next/image";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
const Avatar = () => {
  const { data: session, status } = useSession();
  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>
        {status == "loading" ? (
          <div
            className={
              "h-14 w-14 animate-pulse rounded-full bg-offWhite-900/50"
            }
          ></div>
        ) : (
          <Image
            src={session?.user.image || ""}
            alt={`Avatar of ${session?.user.name}`}
            width={56}
            height={56}
            className={
              "cursor-pointer rounded-full object-cover hover:animate-spin hover:motion-reduce:animate-none"
            }
          />
        )}
      </DropdownMenuPrimitive.Trigger>
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          align="end"
          sideOffset={5}
          className={cx(
            " radix-side-top:animate-slide-up radix-side-bottom:animate-slide-down",
            "w-48 rounded-lg px-1.5 py-1 shadow-md md:w-36",
            "bg-white dark:bg-offWhite-800",
          )}
        >
          <DropdownMenuPrimitive.Item
            className={cx(
              "flex cursor-pointer select-none items-center rounded-md px-2 py-2 text-base outline-none",
              "text-offWhite-400 hover:bg-offWhite-100 focus:bg-offWhite-100 dark:text-offWhite-500 dark:focus:bg-offWhite-900",
            )}
            asChild
          >
            <a href={"https://anilist.co/settings"}>
              <span className="flex-grow text-center text-offWhite-700 dark:text-offWhite-100">
                Anilist Settings
              </span>
            </a>
          </DropdownMenuPrimitive.Item>
          <DropdownMenuPrimitive.Item
            className={cx(
              "flex cursor-pointer select-none items-center rounded-md px-2 py-2 text-base outline-none",
              "text-offWhite-400 hover:bg-offWhite-100 focus:bg-offWhite-100 dark:text-offWhite-500 dark:focus:bg-offWhite-900",
            )}
            asChild
          >
            <Link href={"/prefrences"}>
              <span className="flex-grow text-center text-offWhite-700 dark:text-offWhite-100">
                Prefrences
              </span>
            </Link>
          </DropdownMenuPrimitive.Item>
          <DropdownMenuPrimitive.Item
            className={cx(
              "flex cursor-pointer select-none items-center rounded-md px-2 py-2 text-base outline-none",
              "text-offWhite-400 hover:bg-offWhite-100 focus:bg-offWhite-100 dark:text-offWhite-500 dark:focus:bg-offWhite-900",
            )}
            asChild
          >
            <button
              onClick={() => {
                signOut();
              }}
              className="flex w-full justify-center text-red-700 dark:text-red-400"
            >
              Logout
            </button>
          </DropdownMenuPrimitive.Item>
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
};

export default Avatar;
