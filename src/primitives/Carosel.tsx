'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import React, { forwardRef, useLayoutEffect, useState } from 'react';
import { useRef } from 'react';

interface Props {
  height: number | string;
  children?: React.ReactNode;
}

const Carosel = forwardRef<HTMLDivElement, Props>(
  ({ height = 195, children }, ref) => {
    const caroselTrack = useRef() as React.MutableRefObject<HTMLDivElement>;
    const [showLeftButton, setShowLeftButton] = useState(false);
    const [showRightButton, setShowRightButton] = useState(true);

    const scrollBack = () => {
      caroselTrack.current.scrollLeft -= window.innerWidth / 1.5;
    };
    const scrollForward = () => {
      caroselTrack.current.scrollLeft += window.innerWidth / 1.5;
    };

    useLayoutEffect(() => {
      setShowLeftButton(false);
      setShowRightButton(false);
      if (caroselTrack.current.scrollWidth - caroselTrack.current.clientWidth) {
        setShowLeftButton(false);
        setShowRightButton(true);
      }
    }, [children]);

    useLayoutEffect(() => {
      caroselTrack.current.addEventListener('scroll', () => {
        setShowLeftButton(true);
        setShowRightButton(true);
        if (caroselTrack.current.scrollLeft === 0) {
          setShowLeftButton(false);
        }
        if (
          caroselTrack.current.scrollLeft ===
            caroselTrack.current.scrollWidth -
              caroselTrack.current.clientWidth ||
          caroselTrack.current.scrollLeft + 1 ===
            caroselTrack.current.scrollWidth - caroselTrack.current.clientWidth
        ) {
          setShowRightButton(false);
        }
      });

      return caroselTrack.current.removeEventListener('scroll', () => {
        setShowLeftButton(true);
        setShowRightButton(true);
        if (caroselTrack.current.scrollLeft === 0) {
          setShowLeftButton(false);
        }
        if (
          caroselTrack.current.scrollLeft ===
            caroselTrack.current.scrollWidth -
              caroselTrack.current.clientWidth ||
          caroselTrack.current.scrollLeft + 1 ===
            caroselTrack.current.scrollWidth - caroselTrack.current.clientWidth
        ) {
          setShowRightButton(false);
        }
      });
    }, []);
    return (
      <div
        className='relative isolate flex items-center justify-center'
        ref={ref}
      >
        {showLeftButton && (
          <button
            aria-label='Carosel Button Go Back'
            onPointerUp={scrollBack}
            className='absolute  bottom-1/2 left-4 z-20 scale-[2.5] rounded-full bg-primary-500  bg-opacity-60 hover:bg-opacity-100'
          >
            <ChevronLeftIcon />
          </button>
        )}
        <div
          style={{ height }}
          className={`carosel_track | relative flex w-full snap-x items-center gap-4 overflow-x-auto overflow-y-hidden scroll-smooth`}
          ref={caroselTrack}
        >
          {children}
        </div>
        {showRightButton && (
          <button
            aria-label='Carosel Button Go Forward'
            onPointerUp={scrollForward}
            className='absolute bottom-1/2 right-4 z-20 scale-[2.5] rounded-full bg-primary-500 bg-opacity-60 hover:bg-opacity-100'
          >
            <ChevronRightIcon />
          </button>
        )}
      </div>
    );
  }
);

Carosel.displayName = 'Carosel';
export default Carosel;
