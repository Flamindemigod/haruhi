"use client";
import { Transition } from "@headlessui/react";
import React, { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import cx from "classnames";
import Link from "next/link";
const NavDrawer = () => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen} modal={false}>
      <DialogPrimitive.Trigger asChild>
        <button
          className="btn text-white bg-black bg-opacity-30 p-2 px-4 font-medium hover:scale-105 hover:-rotate-12 target:rotate-12 transition-all"
          aria-aria-label="Navigation"
        >
          <svg
            style={{ scale: "1.5" }}
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
      </DialogPrimitive.Trigger>
      <Transition.Root show={open}>
        <DialogPrimitive.Portal forceMount>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="-translate-x-full scale-70"
            enterTo="translate-x-0 scale-100"
            leave="ease-in duration-200"
            leaveFrom="translate-x-0 scale-100"
            leaveTo="-translate-x-full scale-70"
          >
            <DialogPrimitive.DialogContent
              forceMount
              style={{ width: "80vw" }}
              className={cx(
                "fixed z-50 block",
                "max-w-[15rem] rounded-lg p-4",
                "top-0 left-0 bottom-0",
                "bg-white dark:bg-offWhite-800",
                "focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75"
              )}
            >
              <DialogPrimitive.Title className="text-xl font-medium text-offWhite-900 dark:text-offWhite-100">
                Haruhi
              </DialogPrimitive.Title>
              <nav
                className="text-offWhite-900 dark:text-offWhite-100"
                aria-label="Navigation"
                style={{ marginTop: "2rem" }}
              >
                <ul className="grid gap-6">
                  <li className="p-2">
                    <Link
                      onClick={() => {
                        setOpen(false);
                      }}
                      className="w-full block focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75"
                      href={"/"}
                    >
                      Home
                    </Link>
                  </li>
                  <li className="p-2">
                    <Link
                      onClick={() => {
                        setOpen(false);
                      }}
                      className="w-full block focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75"
                      href={"/anime"}
                    >
                      Anime Lists
                    </Link>
                  </li>
                  <li className="p-2">
                    <Link
                      onClick={() => {
                        setOpen(false);
                      }}
                      className="w-full block focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75"
                      href={"/manga"}
                    >
                      Manga Lists
                    </Link>
                  </li>
                  <li className="p-2">
                    <Link
                      onClick={() => {
                        setOpen(false);
                      }}
                      className="w-full block focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75 "
                      href={"/seasonal"}
                    >
                      Seasonal
                    </Link>
                  </li>
                </ul>
              </nav>

              <DialogPrimitive.Close
                className={cx(
                  "absolute top-3.5 right-3.5 inline-flex items-center justify-center rounded-full p-1",
                  "focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75"
                )}
              >
                <div className="h-4 w-4 text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-400">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
              </DialogPrimitive.Close>
            </DialogPrimitive.DialogContent>
          </Transition.Child>
        </DialogPrimitive.Portal>
      </Transition.Root>
    </DialogPrimitive.Root>
  );
};

export default NavDrawer;
