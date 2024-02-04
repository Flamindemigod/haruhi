"use client";

import { Category, ListStatus, Media } from "~/types.shared/anilist";
import { SelectNonNullableFields } from "../utils/typescript-utils";
import HoverCard from "~/primitives/HoverCard";
import { forwardRef, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import cx from "classix";
import Marquee from "./Marquee";
import Countdown, { zeroPad } from "react-countdown";
import useRandomBGColor from "../hooks/useRandomBGColor";
import { InfoCircledIcon, Pencil1Icon } from "@radix-ui/react-icons";
import Tooltip from "~/primitives/Tooltip";
import MediaEditor from "./anime-manga/MediaEditor";
import { useHover } from "../hooks/useHover";
import { useUser } from "../_contexts/User";
import { useCardContext } from "../_contexts/CardContext";

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

export type CardMedia = Pick<
  Media,
  | "coverImage"
  | "bannerImage"
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
  type: Category.Anime | Category.Manga;
  fullWidth?: true;
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

export default forwardRef<HTMLImageElement, Props>((props, ref) => {
  const { reset } = useCardContext();
  const user = useUser();
  let lock = false;

  const setLock = (e: boolean) => {
    lock = e;
  };
  const [show, setShowInner] = useState<boolean>(false);
  const setShow = (e: boolean) => {
    if (lock) return null;
    setShowInner(e);
  };
  const color = useRandomBGColor(
    `${props.data.title.userPreferred}${props.data.id}`,
  );

  useEffect(() => {
    if (show) {
      setShow(false);
    }
  }, [reset]);

  return (
    <>
      <HoverCard
        control={{
          open: show,
          onOpenChange: setShow,
        }}
        portal={{}}
        closeDelay={0}
        openDelay={0}
        trigger={
          <div
            className={cx(
              props.fullWidth ? "w-full" : "h-32 sm:h-48 md:h-64",
              "card | relative isolate my-2 aspect-cover flex-shrink-0",
            )}
          >
            <Link
              // className={cx(
              //   props.fullWidth ? "w-full" : "h-32 sm:h-48 md:h-64",
              //   "card | relative isolate my-2 aspect-cover flex-shrink-0",
              // )}
              href={`/${props.type.toLowerCase()}/${props.data.id}`}
              onClick={(e) => {
                if (!show) {
                  e.preventDefault();
                  e.stopPropagation();
                  setShow(true);
                }
                if (!!show) {
                  return;
                }
              }}
            >
              {
                //Logic to Show Info To remind user that media needs to be scored
                (() => {
                  if (
                    props.data.mediaListEntry?.status ===
                      ListStatus.Completed ||
                    props.data.mediaListEntry?.status === ListStatus.Dropped
                  ) {
                    if (!!props.data.mediaListEntry.score) return null;
                    return (
                      <div className="absolute right-2 top-2 isolate z-20 h-6 w-6 overflow-clip rounded-full after:absolute after:inset-0 after:-z-50 after:bg-white/10 after:backdrop-blur-md">
                        <Tooltip
                          side="bottom"
                          content={
                            <div>{`This ${props.type} needs to be scored`}</div>
                          }
                        >
                          <InfoCircledIcon className="h-full w-full font-medium text-red-500" />
                        </Tooltip>
                      </div>
                    );
                  }
                })()
              }
              {/*Logic To Show Progress Missing*/}
              {(() => {
                switch (props.type) {
                  case Category.Anime: {
                    if (!!props.data.mediaListEntry) {
                      if (!!props.data.nextAiringEpisode) {
                        return (
                          props.data.mediaListEntry.progress! <
                          props.data.nextAiringEpisode.episode - 1
                        );
                      }
                      if (!!props.data.episodes) {
                        return (
                          props.data.mediaListEntry.progress! <
                          props.data.episodes
                        );
                      }
                    }
                  }
                  case Category.Manga: {
                    if (!!props.data.mediaListEntry) {
                      if (!!props.data.chapters) {
                        return (
                          props.data.mediaListEntry.progress! <
                          props.data.chapters
                        );
                      }
                    }
                  }
                  default: {
                    return false;
                  }
                }
              })() && (
                <div className="absolute left-0 top-0 z-20 rounded-br-full bg-primary-500 pb-2 pr-2 text-white">
                  {(() => {
                    switch (props.type) {
                      case Category.Anime: {
                        if (!!props.data.nextAiringEpisode) {
                          return `+${
                            props.data.nextAiringEpisode.episode -
                              1 -
                              props.data.mediaListEntry?.progress! ?? 0
                          }`;
                        }
                        return `+${
                          props.data.episodes -
                            props.data.mediaListEntry?.progress! ?? 0
                        }`;
                      }
                      case Category.Manga:
                        return `+${
                          props.data.chapters -
                            props.data.mediaListEntry?.progress! ?? 0
                        }`;
                      default:
                        break;
                    }
                  })()}
                </div>
              )}
              <Image
                ref={ref}
                src={props.data.coverImage.large!}
                placeholder="blur"
                className="object-cover"
                priority
                blurDataURL={props.data.coverImage.blurHash}
                alt={`Cover of ${props.data.title.userPreferred}`}
                fill
              />
            </Link>
            {
              //Render Media Editor Button
            }
            {!!user && (
              <CardEditorButtonDesktop
                data={props.data}
                setLock={setLock}
                resetShow={() => {
                  setShowInner(false);
                }}
              />
            )}
          </div>
        }
        content={{
          data: (
            <div className="flex max-w-[100dvw] flex-col rounded-md bg-offWhite-100 p-4 dark:bg-offWhite-900 sm:max-w-sm md:max-w-md">
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
                      if (!!props.data.mediaListEntry) return null;
                      switch (props.type) {
                        case Category.Anime:
                          if (props.data.episodes)
                            return `Episodes ${props.data.episodes}`;
                        case Category.Manga:
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
                              case Category.Anime:
                                if (!!props.data.episodes)
                                  return `/${props.data.episodes}`;
                              case Category.Manga:
                                if (!!props.data.chapters)
                                  return `/${props.data.chapters}`;
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
          sticky: "always",
          collisions: {
            avoidCollisions: true,
            collisionPadding: 5,
          },
        }}
        arrow={{}}
      />
    </>
  );
});

export const CardEditorButtonDesktop = (props: {
  resetShow: () => void;
  setLock: (e: boolean) => void;
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
}) => {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const isHover = useHover(triggerRef);
  const [open, onOpenChange] = useState<boolean>(false);

  useEffect(() => {
    if (isHover) {
      props.setLock(true);
      props.resetShow();
    }
    if (!open) {
      setTimeout(() => {
        props.setLock(false);
      }, 500);
    }
    props.resetShow();
  }, [isHover, open]);

  return (
    <>
      <button
        ref={triggerRef}
        onClick={(e) => {
          e.stopPropagation();
          onOpenChange(true);
        }}
        className="absolute bottom-2 right-2 isolate z-20 h-8 w-8 overflow-clip rounded-full border-2 border-solid border-gray-700/30 p-1 after:absolute after:inset-0 after:-z-50 after:bg-white/10 after:backdrop-blur-md"
      >
        <Tooltip content={"Show Media Editor"} side="top" className="z-[100]">
          <Pencil1Icon className="h-full w-full font-medium text-gray-700 hover:text-green-400" />
        </Tooltip>
      </button>

      <MediaEditor
        control={{
          open,
          onOpenChange,
        }}
        mode="Desktop"
        data={props.data}
      />
    </>
  );
};
