"use client";

import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useContext, useState } from "react";
import { userContext } from "../app/UserContext";
type Props = {
  setIsOpen: any;
};

const SearchBasic = (props: Props) => {
  const user = useContext(userContext);
  const [searchString, setSearchString] = useState<string>("");
  const { data } = useQuery({
    enabled: !!searchString,
    queryKey: ["search", searchString, user.userShowAdult],
    queryFn: async () => {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_SERVER
        }/api/getSearchResultsBasic?search=${searchString}${
          user.userShowAdult ? "" : "&isAdult=false"
        }`
      );
      return res.json();
    },
  });
  const debouncedSetSearchString = useCallback(
    _.debounce((e) => {
      setSearchString(e.target.value);
    }, 1000),
    []
  );
  return (
    <div>
      <input
        className="w-full text-xl bg-white/50 dark:bg-black/50 p-4 border border-black dark:border-white dark:text-white rounded-md  focus-visible:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75"
        placeholder="Search...."
        onChange={debouncedSetSearchString}
      />
      <div className="dark:text-white text-right">
        Try the{" "}
        <Link
          onClick={() => {
            props.setIsOpen(false);
          }}
          href="/search"
          className="text-primary-500 focus-visible:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75"
        >
          Advanced Search
        </Link>
      </div>
      {!!data && (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 gap-y-12 ">
          {data?.anime.results.length !== 0 && (
            <div>
              <div className="text-xl dark:text-white">Anime</div>
              <div className="bg-white/50 dark:bg-black/50 p-2 flex flex-col gap-2 h-full">
                {data?.anime.results.map((result: any) => (
                  <Link
                    key={result.id}
                    onClick={() => {
                      props.setIsOpen(false);
                    }}
                    href={`/${result.type.toLowerCase()}/${result.id}`}
                    className="flex items-center "
                  >
                    <Image
                      width={42}
                      height={32}
                      className={"object-cover"}
                      src={result.coverImage.medium}
                      alt={result.title.userPreferred}
                    />
                    <div className="p-2">
                      <div className="dark:text-white">
                        {result.title.userPreferred}
                      </div>
                      <div className="text-offWhite-800 dark:text-offWhite-100">
                        {result.startDate.year} {result.format}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          {data?.manga.results.length !== 0 && (
            <div>
              <div className="text-xl dark:text-white">Manga</div>
              <div className="bg-white/50 dark:bg-black/50 p-2 flex flex-col gap-2 h-full">
                {data?.manga.results.map((result: any) => (
                  <Link
                    key={result.id}
                    onClick={() => {
                      props.setIsOpen(false);
                    }}
                    href={`/${result.type.toLowerCase()}/${result.id}`}
                    className="flex items-center"
                  >
                    <Image
                      width={42}
                      height={32}
                      className={"object-cover"}
                      src={result.coverImage.medium}
                      alt={result.title.userPreferred}
                    />
                    <div className="p-2">
                      <div className="dark:text-white">
                        {result.title.userPreferred}
                      </div>
                      <div className="text-offWhite-800 dark:text-offWhite-100">
                        {result.startDate.year} {result.format}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          {data?.characters.results.length !== 0 && (
            <div>
              <div className="text-xl dark:text-white">Characters</div>
              <div className="bg-white/50 dark:bg-black/50 p-2 flex flex-col gap-2 h-full">
                {data?.characters.results.map((result: any) => (
                  <Link
                    key={result.id}
                    onClick={() => {
                      props.setIsOpen(false);
                    }}
                    href={`/character/${result.id}`}
                    className="flex items-center"
                  >
                    <Image
                      width={42}
                      height={32}
                      className={"object-cover"}
                      src={result.image.medium}
                      alt={result.name.userPreferred}
                    />
                    <div className="p-2">
                      <div className="dark:text-white">
                        {result.name.userPreferred}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          {data?.staff.results.length !== 0 && (
            <div>
              <div className="text-xl dark:text-white">Staff</div>
              <div className="bg-white/50 dark:bg-black/50 p-2 flex flex-col gap-2 h-full">
                {data?.staff.results.map((result: any) => (
                  <Link
                    key={result.id}
                    onClick={() => {
                      props.setIsOpen(false);
                    }}
                    href={`/staff/${result.id}`}
                    className="flex items-center"
                  >
                    <Image
                      width={42}
                      height={32}
                      className={"object-cover"}
                      src={result.image.medium}
                      alt={result.name.userPreferred}
                    />
                    <div className="p-2">
                      <div className="dark:text-white">
                        {result.name.userPreferred}
                      </div>
                      <div className="text-offWhite-800 dark:text-offWhite-100">
                        {result.primaryOccupations.map(
                          (occupation: string, index: number) => (
                            <span key={index}>| {occupation} |</span>
                          )
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          {data?.studios.results.length !== 0 && (
            <div>
              <div className="text-xl dark:text-white">Studios</div>
              <div className="bg-white/50 dark:bg-black/50 p-2 flex flex-col gap-2 h-full">
                {data?.studios.results.map((result: any) => (
                  <Link
                    key={result.id}
                    onClick={() => {
                      props.setIsOpen(false);
                    }}
                    href={`/character/${result.id}`}
                    className="flex items-center"
                  >
                    <div className="p-2">
                      <div className="dark:text-white">{result.name}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBasic;
