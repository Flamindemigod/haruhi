"use client";
import { Transition } from "@headlessui/react";
import React, { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import cx from "classix";
import { ArrowLeftIcon, Cross2Icon } from "@radix-ui/react-icons";

interface Props {
  trigger: React.ReactNode;
  content: React.ReactNode;
  className?: string;
  side?: "left" | "right";
}

const Drawer = (props: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen} modal={false}>
      <DialogPrimitive.Trigger asChild>{props.trigger}</DialogPrimitive.Trigger>
      <Transition.Root show={open}>
        <DialogPrimitive.Portal forceMount>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom={
              props.side == "left"
                ? "-translate-x-full scale-70"
                : "translate-x-full scale-70"
            }
            enterTo="translate-x-0 scale-100"
            leave="ease-in duration-200"
            leaveFrom="translate-x-0 scale-100"
            leaveTo={
              props.side == "left"
                ? "-translate-x-full scale-70"
                : "translate-x-full scale-70"
            }
          >
            <DialogPrimitive.DialogContent
              onInteractOutside={(e) => {
                console.log(e.currentTarget);
                e.preventDefault();
              }}
              forceMount
              className={cx(
                "fixed z-50",
                "rounded-lg px-2 py-8",
                "flex flex-col",
                props.side == "left"
                  ? "bottom-0 left-0 top-0"
                  : "bottom-0 right-0 top-0",
                "bg-white dark:bg-offWhite-800",
                "focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75",
                props.className,
              )}
            >
              <DialogPrimitive.Close
                className={cx(
                  props.side === "left" ? "float-right" : "float-left",
                  // "absolute top-3.5 inline-flex items-center justify-center rounded-full p-1",
                  "h-8 w-8 rounded-lg dark:bg-white/20",
                  "focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75",
                  "text-primary-500 hover:text-primary-700 dark:text-primary-500 dark:hover:text-primary-400",
                )}
              >
                <ArrowLeftIcon className="h-full w-full" />
              </DialogPrimitive.Close>
              {props.content}
            </DialogPrimitive.DialogContent>
          </Transition.Child>
        </DialogPrimitive.Portal>
      </Transition.Root>
    </DialogPrimitive.Root>
  );
};

export default Drawer;
