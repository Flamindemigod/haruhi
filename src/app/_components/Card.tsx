"use client";

import { Category, Media } from "~/types.shared/anilist";
import { SelectNonNullableFields } from "../utils/typescript-utils";
import HoverCard from "~/primitives/HoverCard";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import cx from "classix";
import Marquee from "./Marquee";
import Countdown, { zeroPad } from "react-countdown";
import useRandomBGColor from "../hooks/useRandomBGColor";

interface PropsCountdown {
  days: number;
  hours: number;
  minutes: number;
  completed: boolean;
}

const countdownRenderer = ({
  days,
  hours,
  minutes,
  completed,
}: PropsCountdown) => {
  if (completed) {
    // Render a completed state
    return <></>;
  } else {
    // Render a countdown
    return (
      <span>
        {days ? `${zeroPad(days)}d : ` : ""}
        {days || hours ? `${zeroPad(hours)}h : ` : ""}{" "}
        {days || hours || minutes ? `${zeroPad(minutes)}m` : ""}
      </span>
    );
  }
};

type CardMedia = Pick<
  Media,
  | "coverImage"
  | "title"
  | "nextAiringEpisode"
  | "mediaListEntry"
  | "episodes"
  | "status"
  | "duration"
  | "averageScore"
  | "format"
  | "genres"
  | "isAdult"
  | "description"
  | "id"
  | "season"
  | "seasonYear"
  | "chapters"
  | "volumes"
>;

export type Props = {
  reset?: boolean;
  onReset?: () => void;
  type: Category.anime | Category.manga;
  data: SelectNonNullableFields<
    CardMedia,
    keyof Omit<
      CardMedia,
      | "airingSchedule"
      | "mediaListEntry"
      | "averageScore"
      | "season"
      | "seasonYear"
      | "status"
      | "format"
    >
  >;
};

export default (props: Props) => {
  const [show, setShow] = useState<boolean>(false);
  let timeoutID = useRef<NodeJS.Timeout>();
  let triggerRef = useRef<HTMLAnchorElement>(null);

  const color = useRandomBGColor(
    `${props.data.title.userPreferred}${props.data.id}`,
  );
  const showLoading = () => {
    triggerRef.current?.setAttribute("data-loading", "");
  };
  const hideLoading = () => {
    triggerRef.current?.removeAttribute("data-loading");
  };
  useEffect(() => {
    if (show) {
      setShow(false);
    }
  }, [props.reset]);
  return (
    <>
      <HoverCard
        control={{ open: show, onOpenChange: setShow }}
        portal={{}}
        closeDelay={0}
        openDelay={500}
        trigger={
          <Link
            className={cx(
              "card | relative my-2 aspect-cover h-32 flex-shrink-0 sm:h-48 md:h-64",
            )}
            ref={triggerRef}
            href={`/${props.type.toLowerCase()}/${props.data.id}`}
            onContextMenu={(e) => {
              e.preventDefault();
            }}
            onPointerDown={() => {
              if (!!props.onReset) {
                props.onReset();
              }
              showLoading();
              timeoutID.current = setTimeout(() => {
                setShow(true);
                hideLoading();
                timeoutID.current = undefined;
              }, 2000);
            }}
            onPointerLeave={(e) => {
              if (!!timeoutID.current) {
                e.preventDefault();
                hideLoading();
                clearTimeout(timeoutID.current);
                timeoutID.current = undefined;
              }
            }}
            onClick={(e) => {
              if (show && !timeoutID.current) {
                e.preventDefault();
              }
            }}
            onPointerUp={(e) => {
              if (!!timeoutID.current) {
                e.preventDefault();
                hideLoading();
                clearTimeout(timeoutID.current);
                timeoutID.current = undefined;
              }
            }}
          >
            <Image
              src={props.data.coverImage.large!}
              placeholder="blur"
              className="object-cover"
              priority
              blurDataURL={props.data.coverImage.blurHash}
              alt={`Cover of ${props.data.title.userPreferred}`}
              fill
            />
          </Link>
        }
        content={{
          data: (
            <div className="flex max-w-xs flex-col rounded-md bg-offWhite-100 p-4 dark:bg-offWhite-900 sm:max-w-sm md:max-w-md">
              <div className="pb-2">
                <Marquee className="text-xl font-semibold text-primary-500">
                  {props.data.title.userPreferred}
                </Marquee>
                <Marquee className="text-sm">
                  {props.data.title.english}
                </Marquee>
              </div>
              <div
                dangerouslySetInnerHTML={{ __html: props.data.description }}
                className="line-clamp-3 md:line-clamp-4"
              ></div>
              <div>
                <div className="py-2 ">
                  {/* Number of Episodes */}
                  <div className="text-primary-500 empty:hidden">
                    {(() => {
                      switch (props.type) {
                        case Category.anime:
                          if (props.data.episodes)
                            return `Episodes ${props.data.episodes}`;
                        case Category.manga:
                          if (props.data.chapters)
                            return `Chapters: ${props.data.chapters}`;
                        default:
                          return null;
                      }
                    })()}
                  </div>
                  {/* Progress */}
                  {(() => {
                    if (!!props.data.mediaListEntry) {
                      return (
                        <div className="text-primary-500">
                          {`Progress: ${
                            props.data.mediaListEntry.progress
                          }${(() => {
                            switch (props.type) {
                              case Category.anime:
                                if (!!props.data.episodes)
                                  return `\\${props.data.episodes}`;
                              case Category.manga:
                                if (!!props.data.chapters)
                                  return `\\${props.data.chapters}`;
                              default:
                                break;
                            }
                            return "+";
                          })()}`}
                        </div>
                      );
                    }
                  })()}
                </div>
                {/* Next Episode In */}
                {(() => {
                  if (!!props.data.nextAiringEpisode) {
                    return (
                      <span>
                        {`Ep ${props.data.nextAiringEpisode.episode} Airing in `}
                        <Countdown
                          date={
                            Date.now() +
                            props.data.nextAiringEpisode.timeUntilAiring * 1000
                          }
                          renderer={countdownRenderer}
                        />
                      </span>
                    );
                  }
                })()}
              </div>
              <div className="py-2">
                {/* Format - Status*/}
                {`${props.data.format} - ${props.data.status}`}
              </div>
              <div className="flex h-14 gap-2 overflow-y-auto p-2">
                {/* Genres */}
                {props.data.genres.map((g) => (
                  <div
                    key={g}
                    className={cx(
                      "h-min whitespace-nowrap rounded-lg px-2 py-0.5",
                      color,
                    )}
                  >
                    {g}
                  </div>
                ))}
              </div>
            </div>
          ),
          side: "bottom",
          sideOffset: 5,
          collisions: {
            avoidCollisions: true,
            collisionPadding: 5,
          },
        }}
        arrow={{}}
      />
    </>
  );
};
