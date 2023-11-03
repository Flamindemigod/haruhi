import Image from "next/image";
import { ImageFrame } from "../../utils/decrypt";
import cx from "classnames";
import { useEffect, useRef, useState } from "react";
import { MangaChapter } from "./Reader";
import { useElementSize } from "../../utils/useElementSize";
import Selector from "./Selector";
import {  MdArrowBackIos, MdArrowForwardIos, MdFullscreen, MdFullscreenExit, MdShuffle, MdSkipNext, MdSkipPrevious } from "react-icons/md";
import Toggle from "../../primitives/Toggle";
import {useSwipeable} from "react-swipeable"
import { median } from "../../utils/median";
import screenfull from "screenfull";

type ReadingMode = "RTL" | "TTB";
type PageMode = "single" | "double";

type Props = {
  frames: ImageFrame[];
  chapterList: MangaChapter[];
  chapterIndex: number;
  changeToChapter?: (chapterIndex: number) => void;
  onPageChange?: (page: number) => void;
};

const ChapterControls = (props: Props) => (
  <div className="flex justify-center items-center p-2">
    <button
      className="btn | flex justify-center dark:text-white disabled:text-gray-500 dark:disabled:text-gray-500"
      disabled={props.chapterList.length <= props.chapterIndex + 1}
      onClick={() => {
        props.changeToChapter!(props.chapterIndex + 1);
      }}
    >
      <MdSkipPrevious size={24} />
    </button>
    <Selector
      chapterList={props.chapterList}
      value={props.chapterIndex}
      onValueChange={props.changeToChapter!}
    />
    <button
      className="btn | flex justify-center dark:text-white disabled:text-gray-500 dark:disabled:text-gray-500"
      disabled={props.chapterIndex <= 1}
      onClick={() => {
        props.changeToChapter!(props.chapterIndex - 1);
      }}
    >
      <MdSkipNext size={24} />
    </button>
  </div>
);

const MangaReader = (props: Props) => {
  const [readingMode, setReadingMode] = useState<ReadingMode>("RTL");
  const [pageMode, setPageMode] = useState<PageMode>("double");
  const [page, setPage] = useState<number>(1);
  const [useDescrambler, setUseDescrambler] = useState<boolean>(true);
  const [imageContainerRef, { width: containerWidth, height: containerHeight }] = useElementSize();
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const handlers = useSwipeable({
    onSwipedLeft: () => setPage(page => median([0,  page - (pageMode==="single" ? 1 : 2), props.frames.length])),
    onSwipedRight: () => setPage(page => median([0,  page + (pageMode==="single" ? 1 : 2), props.frames.length])),
    trackMouse: true,
  });

  const readerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (props.onPageChange) {
      props.onPageChange(page);
    }
  }, [page]);

  useEffect(()=>{
    setPage(0);
  }, [props.frames])
  return (
    <div ref={readerRef} >
    <div
    {...handlers}
      ref={imageContainerRef}
      className={cx(
        "relative flex gap-2 items-center md:min-h-128" ,
        readingMode === "TTB" ? "flex-col" : "flex-row-reverse"
      )}
    >
      {/* Top Chapter Controls */}
      {/* Images and Other Page Controls*/}
        {props.frames.slice(...(()=>{return [page, page + (pageMode === "single" ? 1 : 2)]})()).map((frame, idx) => {
          return (
            <div 
            key={idx}
            className="relative w-full pointer-events-none"
            style={{
               height:
               median([0,  readingMode === "RTL"
                  ? pageMode === "double"
                    ? (((containerWidth ?? frame.width) / 2 - 4) *
                        frame.height) /
                      frame.width
                    : frame.height
                  : frame.height, window.screen.height])
            }}
            >
            <Image
            fill
            style={{objectFit: "contain"}}
            priority
              src={useDescrambler ? frame.descrambled : frame.orig}
              alt="Manga Panel"
            />
            </div>
          );
        })}

       {/* Controls */}
     <div className="absolute inset-0 ">
          {/* Page Navigation Controls */}
          {/* -----Tap Controls */}
          <div onClick={()=>{setPage(page => median([0,  page + (pageMode==="single" ? 1 : 2), props.frames.length]))}} className="absolute p-2 bg-gray-300/30 hover:bg-gray-300/50 text border border-transparent hover:border-white top-0 bottom-0 left-0 flex items-center justify-center "><MdArrowBackIos size={24}/></div>
          <div onClick={()=>{setPage(page => median([0,  page - (pageMode==="single" ? 1 : 2), props.frames.length]))}} className="absolute p-2 bg-gray-300/30 hover:bg-gray-300/50 text border border-transparent hover:border-white top-0 bottom-0 right-0 flex items-center justify-center"><MdArrowForwardIos size={24}/></div>
          {/* Reading Mode Controls  -- UNIMPLEMENTED */}
          {/* Page Mode Controls -- UNIMPLEMENTED */}
          {/* Use Shuffle Controls */}
          <div className="fixed flex flex-col gap-4 bottom-2 right-2 z-50">
          <div className="flex justify-center items-center text-sm p-2 rounded-md z-50 bg-offWhite-600 text-white dark:bg-offWhite-200 dark:text-black">
            <div>{page}/{props.frames.length}</div> 
          </div>
          <Toggle
            ariaLabel="Fullscreen-Toggle"
            pressed={fullscreen}
            onPressedChange={()=>{if(!fullscreen) {
               screenfull.request(readerRef.current!)
            } else {screenfull.exit()}
            setFullscreen(state => !state);
          }
          }
            className={cx(
              "flex justify-center items-center",
             " p-2 rounded-md z-50", "bg-offWhite-600 text-white dark:bg-offWhite-200 dark:text-black"
            )}
          >
            {/* <MdFullscreen size={24} /> */}
           {!fullscreen ?  <MdFullscreen size={24} /> : <MdFullscreenExit size={24} />}
          </Toggle>
          <Toggle
            ariaLabel="Shuffle-Toggle"
            pressed={useDescrambler}
            onPressedChange={setUseDescrambler}
            className={cx(
              "flex justify-center items-center",
              "p-2 rounded-md z-50",
              useDescrambler
                ? "bg-offWhite-600 text-white dark:bg-offWhite-200 dark:text-black"
                : "bg-primary-400 text-white"
            )}
          >
            <MdShuffle size={24} />
          </Toggle>
          </div>
        </div>
     
    </div>
      {/* Bot Chapter Controls */}
      <ChapterControls {...props} />
      </div>
  );
};

export default MangaReader;
