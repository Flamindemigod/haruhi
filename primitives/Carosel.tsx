"use client";

import React, { useEffect, useState } from "react";
import { useRef } from "react";

interface Props {
  width: string;
  height: number | string;
  children?: React.ReactNode;
}

const Carosel = ({ width = "100vw", height = 195, children }: Props) => {
  const caroselTrack = useRef() as React.MutableRefObject<HTMLDivElement>;
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  const scrollBack = () => {
    caroselTrack.current.scrollLeft -= window.innerWidth / 1.5;
  };
  const scrollForward = () => {
    caroselTrack.current.scrollLeft += window.innerWidth / 1.5;
  };

  useEffect(() => {
    setShowLeftButton(false);
    setShowRightButton(false);
    if (caroselTrack.current.scrollWidth - caroselTrack.current.clientWidth) {
      setShowLeftButton(false);
      setShowRightButton(true);
    }
  }, [children]);

  useEffect(() => {
    caroselTrack.current.addEventListener("scroll", () => {
      setShowLeftButton(true);
      setShowRightButton(true);
      if (caroselTrack.current.scrollLeft === 0) {
        setShowLeftButton(false);
      }
      if (
        caroselTrack.current.scrollLeft ===
          caroselTrack.current.scrollWidth - caroselTrack.current.clientWidth ||
        caroselTrack.current.scrollLeft + 1 ===
          caroselTrack.current.scrollWidth - caroselTrack.current.clientWidth
      ) {
        setShowRightButton(false);
      }
    });

    return caroselTrack.current.removeEventListener("scroll", () => {
      setShowLeftButton(true);
      setShowRightButton(true);
      if (caroselTrack.current.scrollLeft === 0) {
        setShowLeftButton(false);
      }
      if (
        caroselTrack.current.scrollLeft ===
          caroselTrack.current.scrollWidth - caroselTrack.current.clientWidth ||
        caroselTrack.current.scrollLeft + 1 ===
          caroselTrack.current.scrollWidth - caroselTrack.current.clientWidth
      ) {
        setShowRightButton(false);
      }
    });
  }, []);
  return (
    <div className="relative isolate flex justify-center items-center">
      {showLeftButton && (
        <button
          aria-label="Carosel Button Go Back"
          onClick={scrollBack}
          className="absolute  bottom-1/2 left-4 z-20 bg-primary-500 bg-opacity-60 hover:bg-opacity-100  rounded-full scale-[2.5]"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
      )}
      <div
        style={{ width, height }}
        className={`scroll-smooth relative flex overflow-x-auto overflow-y-hidden gap-4 items-center `}
        ref={caroselTrack}
      >
        {children}
      </div>
      {showRightButton && (
        <button
          aria-label="Carosel Button Go Forward"
          onClick={scrollForward}
          className="absolute bottom-1/2 right-4 z-20 bg-primary-500 bg-opacity-60 hover:bg-opacity-100 rounded-full scale-[2.5]"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
      )}
    </div>
  );
};

export default Carosel;
