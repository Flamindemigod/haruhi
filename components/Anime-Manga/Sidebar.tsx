"use client";

import Link from "next/link";
import Countdown, { zeroPad } from "react-countdown";

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

interface PropsDateRenderer {
  day: number | undefined;
  month: number | undefined;
  year: number | undefined;
}

const dateRenderer = (props: PropsDateRenderer) => {
  const date = new Date(
    Date.UTC(props.year || 0, (props.month || 1) - 1, props.day || 0)
  );

  let dateString = "";

  if (props.month !== null) {
    dateString = dateString.concat(
      date.toLocaleString("en-US", { month: "short" }),
      " "
    );
  }
  if (props.day !== null) {
    dateString = dateString.concat(
      date.toLocaleString("en-US", { day: "numeric" })
    );
  }
  if (props.day !== null || props.month != null) {
    dateString = dateString.concat(", ");
  }
  if (props.year !== null) {
    dateString = dateString.concat(
      date.toLocaleString("en-US", { year: "numeric" })
    );
  }
  if (dateString.length === 0) {
    return null;
  }
  return dateString;
};

interface PropsContent {
  title: string;
  content: React.ReactNode;
  containerClass?: string;
}
const Content = ({ title, content, containerClass = "" }: PropsContent) => {
  return (
    <div className={containerClass}>
      <div className="font-semibold w-max md:w-auto">{title}</div>
      <div className="w-max md:w-auto">{content}</div>
    </div>
  );
};

const Sidebar = ({ anime }: { anime: any }) => {
  return (
    <div className="flex flex-row md:flex-col gap-4 overflow-x-scroll md:overflow-auto bg-offWhite-200 dark:bg-offWhite-900 text-offWhite-900 dark:text-offWhite-100 rounded-md p-4 max-w-[95vw]">
      {anime.nextAiringEpisode && (
        <Content
          title="Next Airing"
          content={
            <>
              {`Episode ${anime.nextAiringEpisode.episode} in `}
              <Countdown
                date={
                  Date.now() + anime.nextAiringEpisode.timeUntilAiring * 1000
                }
                renderer={countdownRenderer}
              />
            </>
          }
          containerClass="text-primary-500 dark:text-primary-300"
        />
      )}
      <Content title="Format" content={anime.format} />
      {anime.source && (
        <Content
          title="Source"
          content={
            <div className="capitalize">
              {anime.source.replace(/[_]/gm, " ").toLowerCase()}
            </div>
          }
        />
      )}
      {anime.episodes ? (
        <Content title="Episodes" content={anime.episodes} />
      ) : (
        <></>
      )}
      {anime.duration ? (
        <Content title="Episode Duration" content={`${anime.duration} mins`} />
      ) : (
        <></>
      )}
      {anime.chapters ? (
        <Content title="Chapters" content={anime.chapters} />
      ) : (
        <></>
      )}
      {anime.volumes ? (
        <Content title="Volumes" content={`${anime.volumes}`} />
      ) : (
        <></>
      )}
      <Content
        title="Status"
        content={
          <div className="capitalize">
            {anime.status.toLowerCase().replace(/[_]/gm, " ")}
          </div>
        }
      />
      {dateRenderer({
        day: anime.startDate.day,
        month: anime.startDate.month,
        year: anime.startDate.year,
      }) ? (
        <Content
          title="Start Date"
          content={dateRenderer({
            day: anime.startDate.day,
            month: anime.startDate.month,
            year: anime.startDate.year,
          })}
        />
      ) : (
        <></>
      )}
      {dateRenderer({
        day: anime.endDate.day,
        month: anime.endDate.month,
        year: anime.endDate.year,
      }) ? (
        <Content
          title="End Date"
          content={dateRenderer({
            day: anime.endDate.day,
            month: anime.endDate.month,
            year: anime.endDate.year,
          })}
        />
      ) : (
        <></>
      )}
      {anime.season && (
        <Content
          title="Season"
          content={
            <div className="capitalize">
              {anime.season.replace(/[_]/gm, " ").toLowerCase()}
            </div>
          }
        />
      )}
      {anime.averageScore && (
        <Content title="Average Score" content={`${anime.averageScore}%`} />
      )}
      {anime.studios.edges.filter((edge: any) => {
        if (edge.isMain) {
          return true;
        }
        return false;
      }).length ? (
        <Content
          title="Studios"
          content={
            <div className="flex flex-col">
              {anime.studios.edges
                .filter((edge: any) => {
                  if (edge.isMain) {
                    return true;
                  }
                  return false;
                })
                .map((edge: any) => (
                  <Link key={edge.node.id} href={`/studio/${edge.node.id}`}>
                    <div className="hover:underline">{edge.node.name}</div>
                  </Link>
                ))}
            </div>
          }
        />
      ) : (
        <></>
      )}
      {anime.studios.edges.filter((edge: any) => {
        if (edge.isMain) {
          return false;
        }
        return true;
      }).length ? (
        <Content
          title="Producers"
          content={
            <div className="flex flex-col">
              {anime.studios.edges
                .filter((edge: any) => {
                  if (edge.isMain) {
                    return false;
                  }
                  return true;
                })
                .map((edge: any) => (
                  <Link key={edge.node.id} href={`/studio/${edge.node.id}`}>
                    <div className="hover:underline">{edge.node.name}</div>
                  </Link>
                ))}
            </div>
          }
        />
      ) : (
        <></>
      )}
      <Content
        title="Genres"
        content={
          <div className="flex flex-col">
            {anime.genres.map((genre: any) => (
              <div key={genre}>{genre}</div>
            ))}
          </div>
        }
      />
      <Content
        title="Tags"
        content={
          <div className="flex flex-col">
            {anime.tags.map((tag: any) => (
              <div
                className="flex justify-between gap-4 items-end"
                key={tag.id}
              >
                <div>{tag.name}</div>
                <div>{`${tag.rank}%`}</div>
              </div>
            ))}
          </div>
        }
      />
    </div>
  );
};

export default Sidebar;
