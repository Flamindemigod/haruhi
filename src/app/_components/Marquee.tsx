"use client";

import { ReactNode, useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { useElementSize } from "../hooks/useElement";
import cx from "classix";
import { useMediaQuery } from "../hooks/useMediaQuery";

type Props = {
  className?: string;
  children: ReactNode;
};

export default (props: Props) => {
  const [textRef, { width: textWidth }] = useElementSize();
  const [containerRef, { width: containerWidth }] = useElementSize();
  const [willOverflow, setWillOverflow] = useState<boolean>(false);
  const prefersNoMotion = useMediaQuery("(prefers-reduced-motion)");

  useEffect(() => {
    if (containerWidth <= textWidth) {
      setWillOverflow(true);
    } else {
      setWillOverflow(false);
    }
  }, [containerWidth, textWidth]);

  return (
    <div
      ref={containerRef}
      className="h-10 overflow-hidden whitespace-nowrap p-2 text-xl"
    >
      <div className="relative">
        <Marquee
          pauseOnHover
          delay={2}
          speed={25}
          className={cx(
            willOverflow ? "" : "!hidden",
            "motion-reduce:!hidden [&>*]:!px-2 motion-reduce:[&>*]:!animate-none",
          )}
        >
          {props.children}
        </Marquee>
        <div className="absolute inset-0 ">
          <span
            ref={textRef}
            aria-hidden={!(willOverflow || prefersNoMotion)}
            className={cx(willOverflow ? "motion-safe:opacity-0" : "")}
          >
            {props.children}
          </span>
        </div>
      </div>
    </div>
  );
};
