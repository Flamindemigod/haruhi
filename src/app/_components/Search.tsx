"use client";

import Dialog, { Props as DialogProps } from "~/primitives/Dialog";

import useSearch from "../hooks/useSearch";
import { useRef } from "react";
import { api } from "~/trpc/react";
import { AnimeFilter } from "~/types.shared/anilist";
export type Props = Pick<DialogProps, "open" | "onOpenChange">;

export default (props: Props) => {
  const dialogContentRef = useRef<HTMLDivElement>(null);
  const {
    render: searchRender,
    filter,
    searchString,
  } = useSearch(dialogContentRef);
  const { data } = api.anilist.search.useQuery({
    searchString,
    filters: filter,
  });
  console.log("Rendeder");
  return (
    <Dialog
      contentRef={dialogContentRef}
      {...props}
      content={
        <>
          {searchRender}
          {searchString}
          {JSON.stringify(data)}
          {/* <div className="h-80 w-full bg-green-200"></div>
          <div className="h-80 w-full bg-red-200"></div>
          <div className="h-80 w-full bg-blue-200"></div> */}
        </>
      }
    />
  );
};
