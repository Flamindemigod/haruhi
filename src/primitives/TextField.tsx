import { TextField } from "@radix-ui/themes";
import cx from "classix";
import { HTMLAttributes, ReactNode } from "react";

type Props = {
  icon?: {
    icon: ReactNode;
    color?:
      | "tomato"
      | "red"
      | "ruby"
      | "crimson"
      | "pink"
      | "plum"
      | "purple"
      | "violet"
      | "iris"
      | "indigo"
      | "blue"
      | "cyan"
      | "teal"
      | "jade"
      | "green"
      | "grass"
      | "brown"
      | "orange"
      | "sky"
      | "mint"
      | "lime"
      | "yellow"
      | "amber"
      | "gold"
      | "bronze"
      | "gray";
    gap?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
  };
  placeholder: string;
  color?:
    | "tomato"
    | "red"
    | "ruby"
    | "crimson"
    | "pink"
    | "plum"
    | "purple"
    | "violet"
    | "iris"
    | "indigo"
    | "blue"
    | "cyan"
    | "teal"
    | "jade"
    | "green"
    | "grass"
    | "brown"
    | "orange"
    | "sky"
    | "mint"
    | "lime"
    | "yellow"
    | "amber"
    | "gold"
    | "bronze"
    | "gray";
  size?: "1" | "2" | "3";
  variant?: "classic" | "surface" | "soft";
  radius?: "none" | "small" | "medium" | "large" | "full";
  value?: string;
  rootClasses?: string;
  className?: string;
  onValueChange?: (val: string) => void;
};

export default (props: Props) => {
  return (
    <TextField.Root
      size={props.size}
      variant={props.variant}
      color={props.color}
      className={cx("flex items-center", props.rootClasses)}
      radius={props.radius}
    >
      {!!props.icon ? (
        <TextField.Slot color={props.icon.color} gap={props.icon.gap}>
          {props.icon.icon}
        </TextField.Slot>
      ) : (
        <></>
      )}
      <TextField.Input
        placeholder={props.placeholder}
        value={props.value}
        className={props.className}
        onInput={(e) => {
          if (!props.onValueChange) {
            return;
          }
          props.onValueChange(e.currentTarget.value);
        }}
      />
    </TextField.Root>
  );
};
