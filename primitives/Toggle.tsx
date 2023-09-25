import * as TogglePrimitive from "@radix-ui/react-toggle";
import { ReactNode } from "react";

type Props = {
  ariaLabel?: string;
  className?: string;
  disabled?: boolean;
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  children?: ReactNode;
};

const Toggle = (props: Props) => {
  return (
    <TogglePrimitive.Root
      className={props.className}
      aria-label={props.ariaLabel}
      disabled={props.disabled}
      pressed={props.pressed}
      onPressedChange={props.onPressedChange}
    >
      {props.children}
    </TogglePrimitive.Root>
  );
};

export default Toggle;
