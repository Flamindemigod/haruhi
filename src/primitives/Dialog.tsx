import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Fragment, ReactNode, RefObject } from "react";
import { Transition } from "@headlessui/react";
import cx from "classix";
type Content = {
  title?: ReactNode;
  desc?: ReactNode;
};

export type Props = {
  open?: boolean;
  modal?: boolean;
  onOpenChange?: (open: boolean) => void;
  content?: Content;
  contentRef?: RefObject<HTMLDivElement>;
};

export default (props: Props) => (
  <DialogPrimitive.Root
    open={props.open}
    onOpenChange={props.onOpenChange}
    modal={props.modal}
  >
    <DialogPrimitive.Portal forceMount>
      <Transition.Root show={props.open}>
        <Transition.Child
          className={"relative"}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <DialogPrimitive.Overlay
            forceMount
            className="fixed inset-0 z-20 grid place-items-center overflow-y-auto bg-white/75 dark:bg-black/75"
          />
          <DialogPrimitive.Content
            ref={props.contentRef}
            forceMount
            className={cx(
              "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
              "w-[95vw] max-w-7xl rounded-lg p-4 md:w-full",
              "isolate shadow-xl",
            )}
          >
            <DialogPrimitive.Title asChild>
              {props.content?.title}
            </DialogPrimitive.Title>
            <DialogPrimitive.Description asChild>
              {props.content?.desc}
            </DialogPrimitive.Description>
            <DialogPrimitive.Close />
          </DialogPrimitive.Content>
        </Transition.Child>
      </Transition.Root>
    </DialogPrimitive.Portal>
  </DialogPrimitive.Root>
);
