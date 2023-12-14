import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import cx from "classix";
import React, { Fragment, Key } from "react";

type Content = {
  lable?: string;
  content: React.ReactNode;
};

type Group = {
  type: "Group";
  content: Content[];
};

type Item = {
  type: "Item";
  content: Content[];
};

export interface Props {
  align?: "start" | "center" | "end";
  sideOffset?: number;
  arrow?: boolean;
  trigger: React.ReactNode;
  content: (Item | Group)[];
}

const renderItem = (content: Content, key?: Key) => {
  return (
    <Fragment key={key}>
      {!!content.lable ? (
        <DropdownMenu.Label
          className={cx(
            "flex items-center rounded-md px-2 py-2 text-base outline-none",
            "text-offWhite-900 hover:bg-offWhite-100 focus:bg-offWhite-100 dark:text-offWhite-200 dark:focus:bg-offWhite-900",
          )}
          asChild
        >
          {content.lable}
        </DropdownMenu.Label>
      ) : (
        <></>
      )}
      <DropdownMenu.Item
        className={cx(
          "flex cursor-pointer select-none items-center rounded-md px-2 py-2 text-base outline-none",
          "text-offWhite-900 hover:bg-offWhite-100 focus:bg-offWhite-100 dark:text-offWhite-200 dark:focus:bg-offWhite-900",
        )}
        asChild
      >
        {content.content}
      </DropdownMenu.Item>
    </Fragment>
  );
};

export default (props: Props) => (
  <DropdownMenu.Root>
    <DropdownMenu.Trigger asChild>{props.trigger}</DropdownMenu.Trigger>

    <DropdownMenu.Portal>
      <DropdownMenu.Content
        align={props.align}
        sideOffset={props.sideOffset}
        className={cx(
          "radix-side-top:animate-slide-up radix-side-bottom:animate-slide-down",
          "w-48 rounded-lg px-1.5 py-1 shadow-md md:w-36",
          "bg-white dark:bg-offWhite-800",
        )}
      >
        {props.content.map((item, idx) => {
          switch (item.type) {
            case "Item":
              return item.content.map((c, iidx) =>
                renderItem(c, `${idx}--${iidx}`),
              );
            case "Group":
              return (
                <DropdownMenu.Group key={idx}>
                  {item.content.map((c, iidx) => renderItem(c, iidx))}
                </DropdownMenu.Group>
              );
          }
        })}
        {props.arrow ? (
          <DropdownMenu.Arrow className="fill-white dark:fill-offWhite-800" />
        ) : (
          <></>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
);
