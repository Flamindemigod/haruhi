"use client";

import { ReactNode, Ref, forwardRef, useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { useElementSize } from "../hooks/useElement";
import cx from "classix";
import { useMediaQuery } from "../hooks/useMediaQuery";
import Link from "next/link";

type Props = {
  className?: string;
  children: ReactNode;
  href?: string;
};

const Wrapper = forwardRef<
  HTMLDivElement | HTMLAnchorElement,
  { children: ReactNode; href?: string; className?: string }
>((props, ref) => {
  return (
    <>
      {!!props.href ? (
        <Link
          ref={ref as Ref<HTMLAnchorElement>}
          className={cx(props.className)}
          href={props.href}
        >
          {props.children}
        </Link>
      ) : (
        <div className={cx(props.className)} ref={ref as Ref<HTMLDivElement>}>
          {props.children}
        </div>
      )}
    </>
  );
});

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
  }, [containerWidth, textWidth, willOverflow]);

  return (
    <Wrapper
      href={props.href}
      ref={containerRef}
      className={cx(
        "grid grid-cols-1 grid-rows-1 overflow-hidden whitespace-nowrap text-base",
        props.className,
      )}
    >
      <Marquee
        pauseOnHover
        delay={2}
        speed={25}
        className={cx(
          willOverflow ? "" : "!hidden",
          "col-span-full row-span-full motion-reduce:!hidden [&>*]:!px-2 motion-reduce:[&>*]:!animate-none",
        )}
      >
        {props.children}
      </Marquee>
      <div className="col-span-full row-span-full">
        <span
          ref={textRef}
          aria-hidden={!(willOverflow || prefersNoMotion)}
          className={cx(willOverflow ? "motion-safe:opacity-0" : "")}
        >
          {props.children}
        </span>
      </div>
    </Wrapper>
  );
};
