import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import cx from "classnames";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  content: ReactNode;
  index?: number;
  className?: string;
}

const Tooltip = (props: Props) => {
  return (
    <TooltipPrimitive.TooltipProvider>
      <TooltipPrimitive.Root delayDuration={0}>
        <TooltipPrimitive.Trigger
          asChild
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          {props.children}
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Content
          onPointerDownOutside={(e) => {
            e.preventDefault();
          }}
          sideOffset={4}
          key={props.index}
          className={cx(
            "radix-side-top:animate-slide-down-fade",
            "radix-side-right:animate-slide-left-fade",
            "radix-side-bottom:animate-slide-up-fade",
            "radix-side-left:animate-slide-right-fade",
            "inline-flex items-center rounded-md px-4 py-2.5",
            "bg-white dark:bg-offWhite-500",
            props.className
          )}
        >
          <TooltipPrimitive.Arrow className="fill-current text-white dark:text-offWhite-500" />
          {props.content}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.TooltipProvider>
  );
};

export default Tooltip;
