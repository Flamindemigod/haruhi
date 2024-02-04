"use client";

import * as RadioGroup from "@radix-ui/react-radio-group";
import cx from "classix";
import {
  MdSentimentVeryDissatisfied,
  MdSentimentVerySatisfied,
  MdSentimentNeutral,
} from "react-icons/md";
import { useUser } from "~/app/_contexts/User";
import median from "~/app/utils/median";

type Props = {
  value: number | undefined;
  setValue: (_: number) => void;
};

export default (props: Props) => {
  const user = useUser()!;
  switch (user.scoreFormat) {
    case "POINT_10_DECIMAL":
      return (
        <input
          className={cx(
            "text-md  block h-[42px] w-44 rounded-md p-2",
            "text-offWhite-700 placeholder:text-offWhite-500 dark:text-offWhite-100 dark:placeholder:text-offWhite-200",
            "border border-offWhite-400 focus-visible:border-transparent dark:border-offWhite-700 dark:bg-offWhite-700",
          )}
          id="mediaScore"
          type="number"
          step={"0.5"}
          value={props.value}
          onChange={(e) => {
            props.setValue(median([0, parseFloat(e.target.value), 10]));
          }}
        />
      );
    case "POINT_100":
      return (
        <input
          className={cx(
            "text-md  block h-[42px] w-44 rounded-md p-2",
            "text-offWhite-700 placeholder:text-offWhite-500 dark:text-offWhite-100 dark:placeholder:text-offWhite-200",
            "border border-offWhite-400 focus-visible:border-transparent dark:border-offWhite-700 dark:bg-offWhite-700",
          )}
          id="mediaScore"
          type="number"
          inputMode="numeric"
          value={props.value}
          onChange={(e) => {
            props.setValue(median([0, parseInt(e.target.value), 100]));
          }}
        />
      );
    case "POINT_10":
      return (
        <input
          className={cx(
            "text-md  block h-[42px] w-44 rounded-md p-2",
            "text-offWhite-700 placeholder:text-offWhite-500 dark:text-offWhite-100 dark:placeholder:text-offWhite-200",
            "border border-offWhite-400 focus-visible:border-transparent dark:border-offWhite-700 dark:bg-offWhite-700",
          )}
          id="mediaScore"
          type="number"
          inputMode="numeric"
          value={props.value}
          onChange={(e) => {
            props.setValue(median([0, parseInt(e.target.value), 10]));
          }}
        />
      );
    case "POINT_5":
      return (
        <input
          className={cx(
            "text-md  block h-[42px] w-44 rounded-md p-2",
            "text-offWhite-700 placeholder:text-offWhite-500 dark:text-offWhite-100 dark:placeholder:text-offWhite-200",
            "border border-offWhite-400 focus-visible:border-transparent dark:border-offWhite-700 dark:bg-offWhite-700",
          )}
          id="mediaScore"
          type="number"
          inputMode="decimal"
          value={props.value}
          onChange={(e) => {
            props.setValue(median([0, parseInt(e.target.value), 5]));
          }}
        />
      );
    case "POINT_3":
      return (
        <RadioGroup.Root
          aria-label="3 Point Rating Selector"
          onValueChange={(value) => {
            props.setValue(parseInt(value));
          }}
          asChild
        >
          <div className="flex h-[42px] w-44 flex-row items-center justify-center gap-2 py-1 ">
            <RadioGroup.Item
              className={cx(
                "peer relative h-8 w-8 rounded-full",
                // Setting the background in dark properly requires a workaround (see css/tailwind.css)
                "border border-transparent text-white",
                "radix-state-checked:bg-primary-500",
                "radix-state-unchecked:bg-offWhite-100 dark:radix-state-unchecked:bg-offWhite-700",
              )}
              value="1"
            >
              <RadioGroup.Indicator className="leading-0 absolute inset-0 flex items-center justify-center">
                <MdSentimentVeryDissatisfied size={48} />
              </RadioGroup.Indicator>
            </RadioGroup.Item>
            <RadioGroup.Item
              className={cx(
                "peer relative h-8 w-8 rounded-full",
                // Setting the background in dark properly requires a workaround (see css/tailwind.css)
                "border border-transparent text-white",
                "radix-state-checked:bg-primary-500",
                "radix-state-unchecked:bg-offWhite-100 dark:radix-state-unchecked:bg-offWhite-700",
              )}
              value="2"
            >
              <RadioGroup.Indicator className="leading-0 absolute inset-0 flex items-center justify-center">
                <MdSentimentNeutral size={48} />
              </RadioGroup.Indicator>
            </RadioGroup.Item>
            <RadioGroup.Item
              className={cx(
                "peer relative h-8 w-8 rounded-full",
                // Setting the background in dark properly requires a workaround (see css/tailwind.css)
                "border border-transparent text-white",
                "radix-state-checked:bg-primary-500",
                "radix-state-unchecked:bg-offWhite-100 dark:radix-state-unchecked:bg-offWhite-700",
              )}
              value="3"
            >
              <RadioGroup.Indicator className="leading-0 absolute inset-0 flex items-center justify-center">
                <MdSentimentVerySatisfied size={48} />
              </RadioGroup.Indicator>
            </RadioGroup.Item>
          </div>
        </RadioGroup.Root>
      );
  }
};
