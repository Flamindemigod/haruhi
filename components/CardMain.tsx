"use client";

import Image from "next/image";
import HoverCard from "../primitives/Card";
import Countdown, { zeroPad } from "react-countdown";
import Link from "next/link";
interface Props {
  cardDirection?: "right" | "top" | "bottom" | "left";
  href: string;
  imgWidth: number;
  imgHeight: number;
  imgSrcSmall: string;
  imgSrc: string;
  contentTitle: string;
  contentTitleEnglish: string;
  contentSubtitle: string;
  contentFormat: string;
  contentType: string;
  contentStatus: string;
  contentEpisodes: number;
  contentProgress: number | null;
  contentNextAiringEpisode: number;
  contentNextAiringEpisodeTime: number | null;
}

interface PropsCountdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
}

const countdownRenderer = ({
  days,
  hours,
  minutes,
  seconds,
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

const Card = (props: Props) => {
  return (
    <HoverCard
      cardDirection={props.cardDirection ?? "right"}
      Trigger={
        <Link
          href={props.href}
          className="caroselCard | focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75"
        >
          <div
            className=" relative transition-all"
            style={{
              width: props.imgWidth,
              height: props.imgHeight,
              overflowY: "hidden",
            }}
          >
            <Image
              src={props.imgSrc}
              fill
              placeholder="blur"
              blurDataURL={props.imgSrcSmall}
              sizes="20vw"
              className={"object-cover "}
              alt={props.contentTitle}
            />
            {(props.contentProgress &&
              props.contentProgress !== props.contentEpisodes &&
              props.contentProgress !== props.contentNextAiringEpisode - 1 &&
              props.contentType !== "MANGA" && (
                <div
                  className="absolute bg-primary-500 text-white"
                  style={{
                    borderBottomRightRadius: 9999,
                    paddingRight: "0.5rem",
                    paddingBottom: "0.5rem",
                  }}
                >
                  +
                  {(props.contentNextAiringEpisode
                    ? props.contentNextAiringEpisode - 1
                    : props.contentEpisodes) - props.contentProgress}
                </div>
              )) || <></>}
          </div>
          <h3
            className="text-sm overflow-hidden whitespace-nowrap text-black dark:text-offWhite-100"
            style={{
              width: props.imgWidth,
              height: 20,
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            {props.contentTitle}
          </h3>
        </Link>
      }
      Card={
        <div className="text-black dark:text-offWhite-100">
          <div>
            <h3 className="text-xl ">{props.contentTitle}</h3>
            <h2 className="text-sm ">{props.contentTitleEnglish}</h2>
          </div>
          <div
            className="card--description"
            dangerouslySetInnerHTML={{ __html: props.contentSubtitle }}
          />
          <div className="text-primary-500" style={{ marginTop: "2rem" }}>
            {props.contentProgress
              ? `Progress: ${props.contentProgress} ${
                  props.contentEpisodes ? "/" : "+"
                } ${props.contentEpisodes ? props.contentEpisodes : ""}`
              : ""}
          </div>
          {props.contentEpisodes && (
            <div className="text-primary-500">
              {`${props.contentEpisodes} ${
                props.contentType === "MANGA" ? "Chapters" : "Episodes"
              }`}
            </div>
          )}
          <div>
            {props.contentNextAiringEpisodeTime && (
              <div>
                {`Ep ${props.contentNextAiringEpisode} airing in `}
                <Countdown
                  date={Date.now() + props.contentNextAiringEpisodeTime * 1000}
                  renderer={countdownRenderer}
                />
              </div>
            )}
          </div>

          <div style={{ marginTop: "2rem" }}>
            {props.contentFormat} - {props.contentStatus}
          </div>
        </div>
      }
    />
  );
};

export default Card;
