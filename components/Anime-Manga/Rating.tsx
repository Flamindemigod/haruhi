import cx from "classnames";
import * as RadioGroup from "@radix-ui/react-radio-group";
import {
  MdSentimentVeryDissatisfied,
  MdSentimentVerySatisfied,
  MdSentimentNeutral,
} from "react-icons/md";
import { median } from "../../utils/median";
type Props = {
  ratingType: string | undefined;
  value: number;
  setValue: (_: number) => void;
};

const Rating = (props: Props) => {
  switch (props.ratingType) {
    case "POINT_100":
      return (
        <input
          className={cx(
            "text-md  block rounded-md p-2 w-44 h-[42px]",
            "text-offWhite-700 placeholder:text-offWhite-500 dark:text-offWhite-100 dark:placeholder:text-offWhite-200",
            "border border-offWhite-400 focus-visible:border-transparent dark:border-offWhite-700 dark:bg-offWhite-700"
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
    case "POINT_10_DECIMAL":
      return (
        <input
          className={cx(
            "text-md  block rounded-md p-2 w-44 h-[42px]",
            "text-offWhite-700 placeholder:text-offWhite-500 dark:text-offWhite-100 dark:placeholder:text-offWhite-200",
            "border border-offWhite-400 focus-visible:border-transparent dark:border-offWhite-700 dark:bg-offWhite-700"
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
    case "POINT_10":
      return (
        <input
          className={cx(
            "text-md  block rounded-md p-2 w-44 h-[42px]",
            "text-offWhite-700 placeholder:text-offWhite-500 dark:text-offWhite-100 dark:placeholder:text-offWhite-200",
            "border border-offWhite-400 focus-visible:border-transparent dark:border-offWhite-700 dark:bg-offWhite-700"
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
            "text-md  block rounded-md p-2 w-44 h-[42px]",
            "text-offWhite-700 placeholder:text-offWhite-500 dark:text-offWhite-100 dark:placeholder:text-offWhite-200",
            "border border-offWhite-400 focus-visible:border-transparent dark:border-offWhite-700 dark:bg-offWhite-700"
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
          <div className="flex flex-row gap-2 items-center py-1 w-44 h-[42px] justify-center ">
            <RadioGroup.Item
              className={cx(
                "peer relative w-8 h-8 rounded-full",
                // Setting the background in dark properly requires a workaround (see css/tailwind.css)
                "border border-transparent text-white",
                "radix-state-checked:bg-primary-500",
                "radix-state-unchecked:bg-offWhite-100 dark:radix-state-unchecked:bg-offWhite-700"
              )}
              value="1"
            >
              <RadioGroup.Indicator className="absolute inset-0 flex items-center justify-center leading-0">
                <MdSentimentVeryDissatisfied size={48} />
              </RadioGroup.Indicator>
            </RadioGroup.Item>
            <RadioGroup.Item
              className={cx(
                "peer relative w-8 h-8 rounded-full",
                // Setting the background in dark properly requires a workaround (see css/tailwind.css)
                "border border-transparent text-white",
                "radix-state-checked:bg-primary-500",
                "radix-state-unchecked:bg-offWhite-100 dark:radix-state-unchecked:bg-offWhite-700"
              )}
              value="2"
            >
              <RadioGroup.Indicator className="absolute inset-0 flex items-center justify-center leading-0">
                <MdSentimentNeutral size={48} />
              </RadioGroup.Indicator>
            </RadioGroup.Item>
            <RadioGroup.Item
              className={cx(
                "peer relative w-8 h-8 rounded-full",
                // Setting the background in dark properly requires a workaround (see css/tailwind.css)
                "border border-transparent text-white",
                "radix-state-checked:bg-primary-500",
                "radix-state-unchecked:bg-offWhite-100 dark:radix-state-unchecked:bg-offWhite-700"
              )}
              value="3"
            >
              <RadioGroup.Indicator className="absolute inset-0 flex items-center justify-center leading-0">
                <MdSentimentVerySatisfied size={48} />
              </RadioGroup.Indicator>
            </RadioGroup.Item>
          </div>
        </RadioGroup.Root>
      );
  }
  return <></>;
};

export default Rating;
