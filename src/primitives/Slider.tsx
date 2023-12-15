import * as SliderPrimitive from "@radix-ui/react-slider";
import cx from "classix";
import { useState } from "react";
import Tooltip from "./Tooltip";

interface Props {
  defaultValue?: number[];
  max: number;
  step: number;
  min: number;
  value: number[];
  onChange: (value: number[]) => void;
  ariaLabel: string;
  id?: string;
  trackClasses?: string;
  thumbClasses?: string;
}

const Slider = (props: Props) => {
  const [value, setValue] = useState<number[]>(props.value);
  return (
    <SliderPrimitive.Root
      id={props.id}
      defaultValue={props.defaultValue}
      max={props.max}
      min={props.min}
      value={value}
      onValueChange={setValue}
      onValueCommit={props.onChange}
      step={props.step}
      aria-label={props.ariaLabel}
      className="relative flex h-5 w-full touch-none items-center"
    >
      <SliderPrimitive.Track
        className={cx(
          "relative h-1 w-full grow rounded-full bg-black/30 dark:bg-white/20",
        )}
      >
        <SliderPrimitive.Range
          className={cx(
            "absolute h-full rounded-full bg-primary-600 dark:bg-white",
            props.trackClasses,
          )}
        />
      </SliderPrimitive.Track>
      <Tooltip content={<div>{value[0]}</div>} index={value[0]}>
        <SliderPrimitive.Thumb
          className={cx(
            "block h-5 w-5 rounded-full bg-primary-500 dark:bg-white",
            "focus:outline-none focus-visible:ring focus-visible:ring-primary-600 focus-visible:ring-opacity-75",
            props.thumbClasses,
          )}
        />
      </Tooltip>
      <Tooltip content={<div>{value[1]}</div>} index={value[1]}>
        <SliderPrimitive.Thumb
          className={cx(
            "block h-5 w-5 rounded-full bg-primary-500 dark:bg-white",
            "focus:outline-none focus-visible:ring focus-visible:ring-primary-600 focus-visible:ring-opacity-75",
            props.thumbClasses,
          )}
        />
      </Tooltip>
    </SliderPrimitive.Root>
  );
};

export default Slider;
