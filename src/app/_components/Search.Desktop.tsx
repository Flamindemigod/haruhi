"use client";

import { useHotkeys } from "react-hotkeys-hook";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import Search from "./Search";
import { useState } from "react";

export default () => {
  let [open, setOpen] = useState<boolean>(false);
  useHotkeys("ctrl+k", (e) => {
    e.preventDefault();
    setOpen(true);
  });
  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
        }}
        className="inline-flex items-center gap-2 rounded-md bg-offWhite-100 p-2 dark:bg-offWhite-900"
      >
        <span className="inline-flex items-center">
          Search...
          <MagnifyingGlassIcon />
        </span>
        <span className="rounded-sm bg-offWhite-200 px-1 font-mono tracking-tighter dark:bg-offWhite-600">
          Ctrl+K
        </span>
      </button>
      <Search open={open} onOpenChange={setOpen} />
    </>
  );
};
