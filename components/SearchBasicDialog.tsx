"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { MdSearch } from "react-icons/md";
import SearchBasic from "./SearchBasic";
import { Transition } from "@headlessui/react";
import cx from "classnames";
import { Fragment, useState } from "react";

const SearchBasicDialog = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
      <DialogPrimitive.Trigger asChild>
        <button className="btn | flex gap-2 items-center dark:text-white bg-black/25 dark:bg-black/75 border-white border">
          Search <MdSearch />
        </button>
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal forceMount>
        <Transition.Root show={isOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <DialogPrimitive.Overlay
              forceMount
              className="fixed inset-0 z-20 bg-white/75 dark:bg-black/75 grid place-items-center overflow-y-auto"
            >
              <DialogPrimitive.Content
                forceMount
                className={cx(
                  "z-50",
                  "w-[95vw] max-w-7xl rounded-lg p-4 md:w-full"
                )}
              >
                <SearchBasic setIsOpen={setIsOpen} />
              </DialogPrimitive.Content>
            </DialogPrimitive.Overlay>
          </Transition.Child>
        </Transition.Root>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export default SearchBasicDialog;
