"use client";
import cx from "classix";
import { useEffect, useState } from "react";
import { TernaryState } from "~/types.shared/anilist";

type Props = {
  initState: TernaryState;
  className?: string;
  text: string;
  reset?: boolean;
  onReset?: () => void;
  onChange: (state: TernaryState) => void;
};

const ThreeToggleChip = (props: Props) => {
  const [state, setState] = useState<TernaryState>(props.initState);

  useEffect(() => {
    if (props.reset) {
      if (!!props.onReset) {
        props.onReset();
      }
      setState(TernaryState.none);
    }
  }, [props.reset]);

  return (
    <button
      className={cx(
        "rounded-md p-2",
        state === TernaryState.true && "bg-green-500 text-white",
        state === TernaryState.false && "bg-red-500 text-white",
        state === TernaryState.none &&
          "bg-offWhite-200 text-black dark:bg-offWhite-600 dark:text-white",
      )}
      onClick={() => {
        switch (state) {
          case TernaryState.true:
            setState(TernaryState.false);
            props.onChange(TernaryState.false);
            break;
          case TernaryState.false:
            setState(TernaryState.none);
            props.onChange(TernaryState.none);
            break;
          case TernaryState.none:
            setState(TernaryState.true);
            props.onChange(TernaryState.true);
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
