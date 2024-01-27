"use client";
import React from "react";
import cx from "classix";
import { Drawer } from "vaul";

interface Props {
  control?: { open: boolean; onOpenChange: (e: boolean) => void };
  trigger?: React.ReactNode;
  content: React.ReactNode;
  close?: React.ReactNode;
  className?: string;
  closeThreshold?: number;
  scrollLockTimeout?: number;
  snapPoints?: number[];
  modal?: boolean;
  container?: HTMLElement;
  side?: "top" | "left" | "right" | "bottom";
}

export default ({
  trigger,
  content,
  className,
  close,
  container,
  control,
  ...rootProps
}: Props) => {
  return (
    <Drawer.Root
      {...rootProps}
      open={control?.open}
      onOpenChange={control?.onOpenChange}
      direction={rootProps.side}
      // shouldScaleBackground
    >
      <Drawer.Trigger>{trigger}</Drawer.Trigger>
      <Drawer.Portal container={container}>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content
          className={cx(
            "fixed z-50",
            "rounded-lg px-2 py-8",
            "flex flex-col",
            rootProps.side == "top" && "left-0 right-0 top-0",
            rootProps.side == "bottom" && "bottom-0 left-0 right-0",
            rootProps.side == "right" && "bottom-0 right-0 top-0",
            rootProps.side == "left" && "bottom-0 left-0 top-0",
            "bg-white dark:bg-offWhite-800",
            "focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75",
            className,
          )}
        >
          {close && <Drawer.Close>{close}</Drawer.Close>}
          {content}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
