"use client";

import { SelectNonNullableFields } from "~/app/utils/typescript-utils";
import { CardMedia } from "../Card";
import Drawer from "~/primitives/Drawer";
import Image from "next/image";
import Background from "../Background";

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
      return (
        <div className="">
          <div className="relative isolate grid h-64 grid-cols-9 grid-rows-3 overflow-clip">
            <Background
              classes="col-span-full row-span-full blur-md"
              backgroundImage={props.data.bannerImage}
            />
            <div className="col-start-2 col-end-9 row-span-2 row-start-2 grid grid-flow-row-dense grid-cols-7 overflow-clip bg-black/20 backdrop-blur-lg">
              <div className="relative col-span-1 col-start-1 aspect-cover">
                <Image
                  fill
                  className="mt-auto"
                  src={props.data.coverImage.large!}
                  blurDataURL={props.data.coverImage.blurHash}
                  alt={`Cover of ${props.data.title.userPreferred}`}
                  draggable={false}
                  placeholder="blur"
                />
              </div>
              <div className="col-start-2 col-end-9 flex flex-col justify-center">
                <div className="text-xl font-medium">
                  {props.data.title.userPreferred}
                </div>
                <div className="text-lg">{props.data.title.english}</div>
              </div>
            </div>
          </div>
        </div>
      );
    case "Mobile":
      return <div> Media Editor</div>;
  }
};

const Editor = (props: Props) => {
  return (
    <Drawer
      control={props.control}
      modal
      className="w-full max-w-screen-lg"
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
