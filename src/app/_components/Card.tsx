"use client";

import { Category, Media } from "~/types.shared/anilist";
import { SelectNonNullableFields } from "../utils/typescript-utils";
import HoverCard from "~/primitives/HoverCard";
import { ReactNode, forwardRef, useContext, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import cx from "classix";
import Marquee from "./Marquee";
import Countdown, { zeroPad } from "react-countdown";
import useRandomBGColor from "../hooks/useRandomBGColor";
import { createContext } from "react";

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
  const [show, setShow] = useState<boolean>(false);

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
          <Link
            className={cx(
              props.fullWidth ? "w-full" : "h-32 sm:h-48 md:h-64",
              "card | relative isolate my-2 aspect-cover flex-shrink-0",
            )}
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
            collisionBoundry: document.body,
          },
        }}
        arrow={{}}
      />
    </>
  );
});

interface CardContextType {
  reset: boolean;
  onReset: () => void;
}

export const CardContext = createContext<CardContextType | null>(null);

export const CardProvider = ({ children }: { children: ReactNode }) => {
  const [reset, setReset] = useState<boolean>(false);
  const onReset = () => {
    setReset((state) => !state);
  };

  return (
    <CardContext.Provider value={{ reset, onReset }}>
      {children}
    </CardContext.Provider>
  );
};

export const useCardContext = () => {
  const cardContext = useContext(CardContext);
  if (!cardContext) {
    throw new Error("useCardContext has to be used within CardProvider");
  }
  return cardContext;
};
