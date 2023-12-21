import Image from "next/image";
import { Category, Media, SearchResultMedia } from "~/types.shared/anilist";
import Marquee from "./Marquee";

export type Props = {
  media: Omit<SearchResultMedia, "type"> & {
    type: Category.anime;
  };
};

export default (props: Props) => {
  return (
    <div className="group relative grid  grid-cols-4 place-content-center">
      {/* Image */}
      <div className="relative  ">
        <Image
          draggable={false}
          className="col-span-1"
          src={props.media.coverImage.medium!}
          alt={`Cover of ${props.media.title.userPreferred}`}
          objectFit="contain"
          fill
        />
      </div>
      {/* Content */}
      <div className="col-span-full col-start-2 grid grid-flow-col grid-rows-[auto_1fr_auto] items-center">
        {/* Title */}
        <Marquee>{props.media.title.userPreferred}</Marquee>
        {/* Description */}
        <div
          className="line-clamp-4 h-full overflow-hidden p-1"
          dangerouslySetInnerHTML={{ __html: props.media.description! }}
        ></div>
        {/* Genre Tags */}
        <div className="flex h-14 gap-2 overflow-y-auto p-2">
          {props.media.genres.map((g) => (
            <div
              key={g}
              className="h-min rounded-lg p-1 group-odd:bg-primary-300"
            >
              {g}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
