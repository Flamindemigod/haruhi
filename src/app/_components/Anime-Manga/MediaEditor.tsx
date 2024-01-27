"use client";

import { SelectNonNullableFields } from "~/app/utils/typescript-utils";
import { CardMedia } from "../Card";
import Drawer from "~/primitives/Drawer";

type Props = {
  control: { open: boolean; onOpenChange: (e: boolean) => void };
  container?: HTMLElement;
  mode: "Desktop" | "Mobile";
  data: SelectNonNullableFields<
    CardMedia,
    keyof Omit<
      CardMedia,
      | "airingSchedule"
      | "mediaListEntry"
      | "averageScore"
      | "season"
      | "seasonYear"
      | "status"
      | "format"
    >
  >;
};

const ContentRender = (
  props: Omit<Props, "trigger" | "open" | "onOpenChange">,
) => {
  switch (props.mode) {
    case "Desktop":
      return <div>Media Editor</div>;
    case "Mobile":
      return <div> Media Editor</div>;
  }
};

const Editor = (props: Props) => {
  return (
    <Drawer
      control={props.control}
      modal
      side={(() => {
        switch (props.mode) {
          case "Desktop":
            return "right";
          case "Mobile":
            return "bottom";
        }
      })()}
      content={<ContentRender {...props} />}
    />
  );
};

export default (props: Props) => {
  return <Editor {...props} />;
};
