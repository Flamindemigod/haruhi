"use client";

import { ThreeCircles } from "react-loader-spinner";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <ThreeCircles
      height="100"
      width="100"
      color="var(--clr-primary)"
      wrapperStyle={{}}
      wrapperClass="fixed inset-0 flex flex-col justify-center items-center bg-gradient-to-br from-primary-200 to-secondary-400 z-[10000]"
      visible={true}
      ariaLabel="three-circles-rotating"
      outerCircleColor=""
      innerCircleColor=""
      middleCircleColor=""
    />
  );
}
