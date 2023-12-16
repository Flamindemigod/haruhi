"use client";

import Dialog, { Props as DialogProps } from "~/primitives/Dialog";

import useSearch from "../hooks/useSearch";
import { useRef } from "react";
export type Props = Pick<DialogProps, "open" | "onOpenChange">;

export default (props: Props) => {
  const dialogContentRef = useRef<HTMLDivElement>(null);
  const { render: searchRender } = useSearch(dialogContentRef);
  return (
    <Dialog
      contentRef={dialogContentRef}
      {...props}
      content={
        <>
          {searchRender}

          {/* <div className="h-80 w-full bg-green-200"></div>
          <div className="h-80 w-full bg-red-200"></div>
          <div className="h-80 w-full bg-blue-200"></div> */}
        </>
      }
    />
  );
};
