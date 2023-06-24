"use client";

import Image from "next/image";
import HoverCard from "../primitives/Card";
import { zeroPad } from "react-countdown";
import Link from "next/link";
interface Props {
  href: string;
  imgWidth: number;
  imgHeight: number;
  imgSrc: string;
  imgSrcSmall: string;
  contentTitle: string;
  contentTitleEnglish: string;
  contentSubtitle: string;
  contentFormat: string;
  contentType: string;
  contentRelation: string;
  contentStatus: string;
  contentEpisodes: number;
  contentProgress: number | null;
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
      cardDirection="right"
      Trigger={
        <Link
          href={props.href}
          className="caroselCard | flex items-center gap-2 bg-offWhite-200 dark:bg-offWhite-900 text-black dark:text-white p-1 focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75"
        >
          <div
            className="relative transition-all"
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
          </div>
          <div className="  text-black dark:text-offWhite-100 w-64 flex flex-col justify-between py-4">
            <div className="text-lg">{props.contentTitle}</div>
            <div className="text-sm">
              {props.contentFormat} - {props.contentRelation}
            </div>
          </div>
        </Link>
      }
      Card={
        <div className="text-black dark:text-offWhite-100">
          <div>
            <h3 className="text-xl ">{props.contentTitle}</h3>
            <h2 className="text-xs ">{props.contentTitleEnglish}</h2>
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

          <div style={{ marginTop: "2rem" }}>
            {props.contentFormat} - {props.contentStatus}
          </div>
        </div>
      }
    />
  );
};

export default Card;
