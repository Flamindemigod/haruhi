import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import cx from "classnames";
import React from "react";

interface Props {
  cardDirection?: "right" | "top" | "bottom" | "left";
  Trigger: React.ReactNode;
  Card: React.ReactNode;
}

const HoverCard = (props: Props) => {
  return (
    <HoverCardPrimitive.Root openDelay={0} closeDelay={0}>
      <HoverCardPrimitive.Trigger className="flex-shrink-0" asChild>
        {props.Trigger}
      </HoverCardPrimitive.Trigger>
      <HoverCardPrimitive.Content
        side={props.cardDirection}
        align="center"
        sideOffset={4}
        className={cx(
          "z-30 radix-side-top:animate-slide-up radix-side-bottom:animate-slide-down",
          "max-w-md rounded-lg p-4 md:w-full",
          "bg-offWhite-50 dark:bg-offWhite-800",
          "focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75"
        )}
      >
        <HoverCardPrimitive.Arrow className="fill-current text-white dark:text-offWhite-800" />
        {props.Card}
      </HoverCardPrimitive.Content>
    </HoverCardPrimitive.Root>
  );
};

export default HoverCard;
