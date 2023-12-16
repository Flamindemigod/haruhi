"use client";

import { Transition } from "@headlessui/react";
import * as PopoverPrimitives from "@radix-ui/react-popover";
import cx from "classix";
import { ReactNode, RefObject, useState } from "react";

type Props = {
  modal?: boolean;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  align?: "start" | "center" | "end";
  alignOffset?: number;
  arrow?: boolean;
  trigger: ReactNode;
  anchor?: ReactNode;
  content: ReactNode;
  closeIcon: ReactNode;
  container?: RefObject<HTMLDivElement>;
  contentClass?: string;
};

export default (props: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <PopoverPrimitives.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitives.Trigger asChild>
        {props.trigger}
      </PopoverPrimitives.Trigger>
      {!!props.anchor ? (
        <PopoverPrimitives.Anchor></PopoverPrimitives.Anchor>
      ) : (
        <></>
      )}
      <PopoverPrimitives.Portal forceMount container={props.container?.current}>
        {/* <Transition.Root show={open}>
        <Transition.Child
          className={"relative z-[100]"}
          enter="ease-out duration-300"
          enterFrom="opacity-0 -translate-y-full"
          enterTo="opacity-100 translate-y-0"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 -translate-y-full"
        > */}
        <PopoverPrimitives.Content
          collisionPadding={5}
          onPointerDown={(e) => {
            console.log(e.currentTarget);
            e.stopPropagation();
          }}
          side={props.side}
          sideOffset={props.sideOffset}
          align={props.align}
          alignOffset={props.alignOffset}
          className={cx(
            "rounded-lg px-1.5 py-1 shadow-md ",
            "bg-white dark:bg-offWhite-800",
            "z-[100] w-screen max-w-lg",
            "relative",
            "group/popover flex flex-row",
            "max-h-radix-popover-content-available-height",
            props.contentClass,
          )}
        >
          {props.content}
          <PopoverPrimitives.Close asChild>
            {props.closeIcon}
          </PopoverPrimitives.Close>
          {props.arrow ? (
            <PopoverPrimitives.Arrow className="fill-white dark:fill-offWhite-800" />
          ) : (
            <></>
          )}
        </PopoverPrimitives.Content>
        {/* </Transition.Child>
      </Transition.Root> */}
      </PopoverPrimitives.Portal>
    </PopoverPrimitives.Root>
  );
};
