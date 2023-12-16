"use client";
import cx from "classix";
import { useEffect, useState } from "react";

type ChipState = "Enabled" | "Disabled" | undefined;

type Props = {
  initState?: ChipState;
  className?: string;
  text: string;
  reset?: boolean;
  onReset?: () => void;
  onChange: (state: ChipState) => void;
};

const ThreeToggleChip = (props: Props) => {
  const [state, setState] = useState<ChipState>(props.initState);

  useEffect(() => {
    if (props.reset) {
      if (!!props.onReset) {
        props.onReset();
      }
      setState(undefined);
    }
  }, [props.reset]);

  return (
    <button
      className={cx(
        "rounded-md p-2",
        state === "Enabled" && "bg-green-500 text-white",
        state === "Disabled" && "bg-red-500 text-white",
        state ??
          "bg-offWhite-200 text-black dark:bg-offWhite-600 dark:text-white",
      )}
      onClick={() => {
        switch (state) {
          case "Enabled":
            setState("Disabled");
            props.onChange("Disabled");
            break;
          case "Disabled":
            setState(undefined);
            props.onChange(undefined);
            break;
          case undefined:
            setState("Enabled");
            props.onChange("Enabled");
            break;
          default:
            break;
        }
      }}
    >
      {props.text}
    </button>
  );
};

export default ThreeToggleChip;
