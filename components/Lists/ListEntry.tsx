import Image from "next/image";
import Link from "next/link";

type Props = {
  entry: any;
};

const ListEntry = (props: Props) => {
  return (
    <Link
      href={`${props.entry.media.type.toLowerCase()}/${props.entry.media.id}`}
      className="grid col-span-full min-h-[5rem] justify-center items-center odd:bg-offWhite-300/50 dark:odd:bg-offWhite-600/50"
      style={{ gridTemplateColumns: "subgrid" }}
    >
      <div className="w-full h-full relative">
        <Image
          className="banner--image | object-cover"
          src={props.entry.media.coverImage.large}
          fill
          alt={props.entry.media.title.userPreferred}
        />
      </div>
      <div className="justify-self-start p-2">
        {props.entry.media.title.userPreferred}
      </div>
      <div className="justify-self-center">{props.entry.score}</div>
      <div className="justify-self-center">{props.entry.media.format}</div>
      <div className="justify-self-center">{`${props.entry.progress} ${
        props.entry.media.episodes ? `/ ${props.entry.media.episodes}` : "+"
      }`}</div>
    </Link>
  );
};

export default ListEntry;
