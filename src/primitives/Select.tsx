"use client";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import * as SelectPrimitive from "@radix-ui/react-select";
import cx from "classix";
import React, { ReactNode, useEffect } from "react";

type Value<T> = {
  displayTitle: string;
  value: T;
};

type Props<T> = {
  defaultValue: T;
  triggerAriaLabel: string;
  trigger: ReactNode;
  value: T;
  onValueChange: (val: T) => void;
  values: Value<T>[];
  buttonClass?: string;
  side?: "top" | "right" | "bottom" | "left";
};

const Select = <T,>(props: Props<T>) => {
  useEffect(() => {
    props.values.filter((value) => value.value === props.value).length === 0 &&
      props.onValueChange(props.defaultValue);
  }, [props.values]);

  return (
    <SelectPrimitive.Root
      defaultValue={String(props.defaultValue)}
      value={String(props.value)}
      onValueChange={(e) => {
        props.onValueChange(e as T);
      }}
    >
      <SelectPrimitive.Trigger asChild aria-label={props.triggerAriaLabel}>
        {props.trigger}
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Content
        className="z-[75]"
        position="popper"
        side={props.side}
      >
        <SelectPrimitive.ScrollUpButton className="flex items-center justify-center text-offWhite-700 dark:text-offWhite-300">
          <ChevronUpIcon />
        </SelectPrimitive.ScrollUpButton>
        <SelectPrimitive.Viewport className="relative z-[80] rounded-lg bg-white p-2 shadow-lg dark:bg-offWhite-800">
          {props.values.map((f, i) => (
            <SelectPrimitive.Item
              key={`${f}-${i}`}
              value={String(f.value)}
              className={cx(
                "relative flex items-center rounded-md px-8 py-2 text-sm font-medium text-offWhite-700 focus:bg-offWhite-100 dark:text-offWhite-300 dark:focus:bg-offWhite-900",
                "radix-disabled:opacity-50",
                // "select-none focus:outline-none",
              )}
            >
              <SelectPrimitive.ItemText>
                {f.displayTitle}
              </SelectPrimitive.ItemText>
              <SelectPrimitive.ItemIndicator className="absolute left-2 inline-flex items-center">
                <ArrowRightIcon className="text-primary-500" />
              </SelectPrimitive.ItemIndicator>
            </SelectPrimitive.Item>
          ))}
        </SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton className="flex items-center justify-center text-offWhite-700 dark:text-offWhite-300">
          <ChevronDownIcon />
        </SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Root>
  );
};

export default Select;
