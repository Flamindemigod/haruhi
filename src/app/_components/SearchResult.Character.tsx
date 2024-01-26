import Image from "next/image";
import Marquee from "./Marquee";
import { Character } from "~/types.shared/anilist";

export type Props = {
  data: Character;
};

export default (props: Props) => {
  return (
    <div className="group relative grid grid-cols-4 place-content-center @md:grid-cols-5 @lg:grid-cols-6 @xl:grid-cols-8">
      {/* Image */}
      <div className="relative">
        <Image
          draggable={false}
          className="col-span-1 object-contain"
          src={props.data.image.large!}
          alt={`Cover of ${props.data.name?.userPreferred}`}
          // objectFit="cover"
          placeholder="blur"
          blurDataURL={props.data.image.blurHash}
          fill
        />
      </div>
      {/* Content */}
      <div className="col-span-full col-start-2 grid grid-flow-col grid-rows-[auto_1fr_auto] items-center">
        {/* Title */}
        <Marquee href={`/character/${props.data?.id}`}>
          {props.data.name?.userPreferred}
        </Marquee>
        {/* Description */}
        <div
          className="line-clamp-3 h-24 overflow-hidden p-1 md:line-clamp-4 md:h-24"
          dangerouslySetInnerHTML={{ __html: props.data.description! }}
        ></div>
      </div>
    </div>
  );
};
