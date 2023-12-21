"use client";

import Dialog, { Props as DialogProps } from "~/primitives/Dialog";

import useSearch from "../hooks/useSearch";
import { useRef } from "react";

import SearchResults from "./SearchResults";
export type Props = Pick<DialogProps, "open" | "onOpenChange">;

export default (props: Props) => {
  const dialogContentRef = useRef<HTMLDivElement>(null);
  const {
    render: searchRender,
    filter,
    searchString,
  } = useSearch(dialogContentRef);

  return (
    <Dialog
      contentRef={dialogContentRef}
      {...props}
      content={
        <>
          {searchRender}
          <div className="flex flex-col gap-4 rounded-md [&>*:nth-child(even)]:bg-emerald-400 [&>*:nth-child(odd)]:bg-red-500">
            <SearchResults filter={filter} searchString={searchString} />
          </div>
        </>
      }
    />
  );
};
