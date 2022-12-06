import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  character: any;
  role: string;

  va: any;
};

const CharacterCard = (props: Props) => {
  return (
    <div className="flex gap-2 bg-offWhite-200 dark:bg-offWhite-800 text-black dark:text-white p-1 min-w-[480px]">
      <Link
        href={`/character/${props.character.id}`}
        className="flex gap-2 focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75"
      >
        <Image
          src={props.character.image.large}
          alt={props.character.name.userPreferred}
          width={96}
          height={128}
          className={"flex-shrink-0 object-cover"}
        />
        <div className="flex flex-col justify-between py-4 w-32 flex-shrink-0">
          <div className="text-md overflow-hidden text-ellipsis">
            {props.character.name.userPreferred}
          </div>
          <div className="text-md">{props.role}</div>
        </div>
      </Link>
      {props.va && (
        <Link
          href={`/staff/${props.va.id}`}
          className="flex gap-2 focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75"
        >
          <div className="flex flex-col justify-between py-4 w-32 flex-shrink-0 ">
            <div className="text-md  text-end overflow-hidden text-ellipsis">
              {props.va.name.userPreferred}
            </div>
            <div className="text-md text-end">{props.va.language}</div>
          </div>
          <Image
            src={props.va.image.large}
            alt={props.va.name.userPreferred}
            width={96}
            height={128}
            className={"flex-shrink-0 object-cover"}
          />
        </Link>
      )}
    </div>
  );
};

export default CharacterCard;
