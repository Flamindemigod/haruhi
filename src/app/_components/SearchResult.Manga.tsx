import Image from "next/image";
import { Category, SearchResultMedia } from "~/types.shared/anilist";
import Marquee from "./Marquee";
import useRandomBGColor from "../hooks/useRandomBGColor";
import cx from "classix";

export type Props = {
  media: Omit<SearchResultMedia, "type"> & {
    type: Category.Manga;
  };
};

export default (props: Props) => {
  const color = useRandomBGColor(
    `${props.media.title.userPreferred}${props.media.id}`,
  );
  return (
    <div className="group relative grid grid-cols-4 place-content-center @md:grid-cols-5 @lg:grid-cols-6 @xl:grid-cols-8">
      {/* Image */}
      <div className="relative">
        <Image
          draggable={false}
          className="col-span-1 object-contain"
          src={props.media.coverImage.large!}
          alt={`Cover of ${props.media.title.userPreferred}`}
          blurDataURL={props.media.coverImage.blurHash}
          // objectFit="cover"
          fill
        />
      </div>
      {/* Content */}
      <div className="col-span-full col-start-2 grid grid-flow-col grid-rows-[auto_1fr_auto] items-center">
        {/* Title */}
        <Marquee href={`/manga/${props.media.id}`}>
          {props.media.title.userPreferred}
        </Marquee>
        {/* Description */}
        <div
          className="line-clamp-3 h-24 overflow-hidden p-1 md:line-clamp-4 md:h-24"
          dangerouslySetInnerHTML={{ __html: props.media.description! }}
        ></div>
        {/* Genre Tags */}
        <div className="flex h-14 gap-2 overflow-y-auto p-2">
          {props.media.genres.map((g) => (
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
    </div>
  );
};
