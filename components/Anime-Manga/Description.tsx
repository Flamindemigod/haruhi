"use client";

import React, { useRef, useState } from "react";
import { useEffect } from "react";

const Description = ({ text }: { text: string }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [readMore, setReadMore] = useState(true);
  const descriptionContainer =
    useRef() as React.MutableRefObject<HTMLDivElement>;

  const toggleOpen = () => {
    setOpen((state) => !state);
  };

  useEffect(() => {
    if (descriptionContainer.current?.offsetHeight < 170) {
      setReadMore(false);
    }
  }, [text]);

  return (
    <div
      className={`description--container  |  before:from-gray-100 dark:before:from-offWhite-700 before:to-transparent before:bg-gradient-to-t ${
        readMore && "readMore"
      } p-8 mb-4 relative`}
      ref={descriptionContainer}
      data-open={open}
      onClick={toggleOpen}
    >
      <div
        className="description | text-md"
        dangerouslySetInnerHTML={{ __html: text }}
      />
    </div>
  );
};

export default Description;
