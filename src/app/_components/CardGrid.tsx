"use client";

import { useEffect } from "react";
import Card, { Props as CardProps } from "./Card";
import { useInView } from "react-intersection-observer";
import { ThreeCircles } from "react-loader-spinner";

export interface Props extends Omit<CardProps, "data"> {
  data: CardProps["data"][];
  onReachBottom: () => void;
  isFetching: boolean;
  fallback: string;
}

const CardGrid = (props: Props) => {
  const { ref, inView } = useInView({
    threshold: 0,
  });
  useEffect(() => {
    if (inView) {
      props.onReachBottom();
    }
  }, [inView]);
  return (
    <>
      <div className="cardGrid | grid w-full grid-cols-3 place-items-center gap-2 p-2 md:grid-cols-5 lg:grid-cols-7 2xl:grid-cols-9">
        {props.data.map((m, i) => {
          if (i === props.data.length - 1) {
            return (
              <Card fullWidth key={i} ref={ref} data={m} type={props.type} />
            );
          }
          return <Card fullWidth data={m} key={i} type={props.type} />;
        })}
        {props.isFetching && (
          <div className="col-span-full flex h-32 w-full items-center justify-center gap-4 rounded-md bg-black/20 py-2 sm:h-48 md:h-64">
            <ThreeCircles
              height="50%"
              color="var(--clr-primary)"
              wrapperClass="items-center justify-center flex-shrink p-2 h-32"
              visible={true}
              ariaLabel="three-circles-rotating"
            />
            <span className="p-2 text-lg font-medium text-primary-500 md:text-xl">
              {props.fallback}
            </span>
          </div>
        )}
      </div>
    </>
  );
};

export default CardGrid;
