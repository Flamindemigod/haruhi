"use client";

import { SelectNonNullableFields } from "~/app/utils/typescript-utils";
import { CardMedia } from "../Card";
import Drawer from "~/primitives/Drawer";
import Image from "next/image";
import Background from "../Background";
import Select from "~/primitives/Select";
import { ListStatus, MediaList } from "~/types.shared/anilist";
import cx from "classix";
import { CaretDownIcon } from "@radix-ui/react-icons";
import Rating from "./Rating";

interface StatusSelectorProps {
  value: ListStatus | null;
  onValueChange: (val: ListStatus | null) => void;
}

const styles =
  "text-md rounded-md p-2 text-offWhite-700 placeholder:text-offWhite-500 dark:text-offWhite-100 dark:placeholder:text-offWhite-200 border border-offWhite-400 focus-visible:border-transparent dark:border-offWhite-700 dark:bg-offWhite-700 w-44 flex gap-2 items-center justify-center" as const;

const StatusSelector = (props: StatusSelectorProps) => {
  return (
    <Select
      {...props}
      trigger={
        <button className={cx(styles)}>
          {!props.value ? "Not on List" : props.value}
          <CaretDownIcon />
        </button>
      }
      side="bottom"
      align="center"
      triggerAriaLabel="Media Status Selector"
      values={[
        ...Object.values(ListStatus).map((v) => ({
          value: v,
          displayTitle: v,
        })),
        { displayTitle: "Not On List", value: null },
      ]}
      sideOffet={5}
      defaultValue={null}
    >
      {}
    </Select>
  );
};

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
              <div className="col-start-2 col-end-9 flex flex-col justify-center p-2 text-white">
                <div className="text-xl font-semibold">
                  {props.data.title.userPreferred}
                </div>
                <div className="text-lg">{props.data.title.english}</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 p-2 @container">
            <div className="w-full">
              <p>
                Make changes to your list entry of{" "}
                {props.data.title.userPreferred}.
              </p>
              <p>
                Click <span className="text-primary-400">Save</span> when you're
                done. Or <span className="text-red-600">Delete</span> to remove
                it from your lists.
              </p>
            </div>
            <form className="flex w-2/3 flex-wrap gap-2 rounded-md bg-black/20 p-2 @lg:max-w-lg @xl:max-w-xl @2xl:max-w-2xl">
              <fieldset>
                <label
                  htmlFor="Media Status Selector"
                  className="text-md font-medium text-offWhite-700 dark:text-offWhite-100"
                >
                  Status
                </label>
                <StatusSelector
                  value={props.data.mediaListEntry?.status ?? null}
                  onValueChange={(v) => {
                    console.error(
                      "TODO: Add Value Change Handler for Status Selector",
                    );
                  }}
                />
              </fieldset>
              <fieldset>
                <label
                  htmlFor="mediaScore"
                  className="text-md font-medium text-offWhite-700 dark:text-offWhite-100"
                >
                  Rating
                </label>
                <Rating
                  value={props.data.mediaListEntry?.score ?? undefined}
                  setValue={(v) => {
                    console.error(
                      "TODO: Add Value Change Handler for Status Selector",
                    );
                  }}
                />
              </fieldset>
            </form>
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
