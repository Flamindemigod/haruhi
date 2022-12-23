import * as SwitchPrimitive from "@radix-ui/react-switch";
import cx from "classnames";
import React from "react";

interface Props {
  checked: boolean;
  onChecked: any;
  disabled?: boolean;
}

const Switch = (props: Props) => {
  return (
    <SwitchPrimitive.Root
      disabled={props.disabled}
      checked={props.checked}
      onCheckedChange={props.onChecked}
      className={cx(
        "group",
        "radix-state-checked:bg-primary-500",
        "radix-state-unchecked:bg-offWhite-200 dark:radix-state-unchecked:bg-offWhite-800",
        "relative inline-flex h-[24px] w-[44px] flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
        "focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75"
      )}
    >
      <SwitchPrimitive.Thumb
        className={cx(
          "group-radix-state-checked:translate-x-5",
          "group-radix-state-unchecked:translate-x-0",
          "pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
        )}
      />
    </SwitchPrimitive.Root>
  );
};

export default Switch;
