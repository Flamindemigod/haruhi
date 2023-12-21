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
    <div className="relative grid max-h-36 grid-cols-4 place-content-center">
      {/* Image */}
      <div className="relative  max-h-36 ">
        <Image
          className="col-span-1"
          src={props.media.coverImage.medium!}
          alt={`Cover of ${props.media.title.userPreferred}`}
          objectFit="contain"
          fill
        />
      </div>
      {/* Content */}
      <div className="col-span-full col-start-2 grid grid-flow-col grid-rows-3 items-center">
        {/* Title */}
        <Marquee>{props.media.title.userPreferred}</Marquee>
        {/* Description */}
      </div>
    </div>
  );
};
