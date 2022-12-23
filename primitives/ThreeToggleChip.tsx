"use client";
import cx from "classnames";
import { useEffect, useState } from "react";

type ChipState = "Enabled" | "Disabled" | null;

type Props = {
  initState: ChipState;
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
      props.onReset!();
      setState(null);
    }
  }, [props.reset]);

  return (
    <button
      className={cx(
        "p-2 rounded-md",
        state === "Enabled" && "bg-green-500 text-white",
        state === "Disabled" && "bg-red-500 text-white",
        state ??
          "bg-offWhite-200 text-black dark:bg-offWhite-600 dark:text-white"
      )}
      onClick={() => {
        switch (state) {
          case "Enabled":
            setState("Disabled");
            props.onChange("Disabled");
            break;
          case "Disabled":
            setState(null);
            props.onChange(null);
            break;
          case null:
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
