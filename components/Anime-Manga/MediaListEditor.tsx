"use client";

import Image from "next/image";
import { Transition } from "@headlessui/react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import cx from "classnames";
import React, { useContext, useState } from "react";
import { userContext } from "../../app/UserContext";
import * as SelectPrimitive from "@radix-ui/react-select";
import Rating from "./Rating";
import { median } from "../../utils/median";
import Calender from "../../primitives/Calendar";
import * as Separator from "@radix-ui/react-separator";
import { MdDelete, MdSave } from "react-icons/md";
import { useQuery, useQueryClient } from "@tanstack/react-query";
const SelectItem = ({
  value,
  displayText,
}: {
  value: string;
  displayText: string;
}) => {
  return (
    <SelectPrimitive.Item
      value={value}
      className={cx(
        "relative flex items-center px-8 py-2 rounded-md text-sm text-offWhite-700 dark:text-offWhite-300 font-medium focus:bg-offWhite-100 dark:focus:bg-offWhite-900",
        "radix-disabled:opacity-50",
        "focus:outline-none select-none"
      )}
    >
      <SelectPrimitive.ItemText>{displayText}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="absolute left-2 inline-flex items-center">
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
          ></path>
        </svg>
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
};

const MediaListEditor = ({ entry }: { entry: any }) => {
  const queryClient = useQueryClient();
  const user = useContext(userContext);
  const [open, setOpen] = useState<boolean>(false);
  const [mediaStatus, setMediaStatus] = useState<string>(
    entry.mediaListEntry?.status || ""
  );
  const [mediaScore, setMediaScore] = useState<number>(
    entry.mediaListEntry?.score || 0
  );
  const [mediaProgress, setMediaProgress] = useState<number>(
    entry.mediaListEntry?.progress || 0
  );
  const [mediaStartDate, setMediaStartDate] = useState<Date | null>(
    entry.mediaListEntry?.startedAt.year ||
      entry.mediaListEntry?.startedAt.month ||
      entry.mediaListEntry?.startedAt.day
      ? new Date(
          entry.mediaListEntry.startedAt.year,
          entry.mediaListEntry.startedAt.month - 1,
          entry.mediaListEntry.startedAt.day
        )
      : null
  );
  const [mediaEndDate, setMediaEndDate] = useState<Date | null>(
    entry.mediaListEntry?.completedAt.year ||
      entry.mediaListEntry?.completedAt.month ||
      entry.mediaListEntry?.completedAt.day
      ? new Date(
          entry.mediaListEntry.completedAt.year,
          entry.mediaListEntry.completedAt.month - 1,
          entry.mediaListEntry.completedAt.day
        )
      : null
  );
  const [mediaRewatches, setMediaRewatches] = useState<number>(
    entry.mediaListEntry?.repeat || 0
  );
  const media = useQuery({
    queryKey: ["mediaListEntry", entry.id],
    queryFn: async () => {
      const data = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER}/api/getEntry?id=${entry.id}`
      );
      return data.json();
    },
    onSuccess(data) {
      if (data.data.Media.mediaListEntry !== null) {
        setMediaStatus(data.data.Media.mediaListEntry.status);
        setMediaScore(data.data.Media.mediaListEntry.score);
        setMediaProgress(data.data.Media.mediaListEntry.progress);
        setMediaStartDate(
          data.data.Media.mediaListEntry?.startedAt.year ||
            data.data.Media.mediaListEntry?.startedAt.month ||
            data.data.Media.mediaListEntry?.startedAt.day
            ? new Date(
                data.data.Media.mediaListEntry.startedAt.year,
                data.data.Media.mediaListEntry.startedAt.month - 1,
                data.data.Media.mediaListEntry.startedAt.day
              )
            : null
        );
        setMediaEndDate(
          data.data.Media.mediaListEntry?.completedAt.year ||
            data.data.Media.mediaListEntry?.completedAt.month ||
            data.data.Media.mediaListEntry?.completedAt.day
            ? new Date(
                data.data.Media.mediaListEntry.completedAt.year,
                data.data.Media.mediaListEntry.completedAt.month - 1,
                data.data.Media.mediaListEntry.completedAt.day
              )
            : null
        );

        setMediaRewatches(data.data.Media.mediaListEntry.repeat);
      } else {
        setMediaStatus("");
        setMediaScore(0);
        setMediaProgress(0);
        setMediaStartDate(null);
        setMediaEndDate(null);

        setMediaRewatches(0);
      }
    },
  });

  const saveMediaEntry = async () => {
    const data = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER}/api/setMediaEntry?id=${
        entry.mediaListEntry ? entry.mediaListEntry.id : 0
      }&mediaId=${
        entry.id
      }&status=${mediaStatus}&score=${mediaScore}&progress=${mediaProgress}&repeat=${mediaRewatches}&startedAt=${JSON.stringify(
        {
          year: mediaStartDate ? new Date(mediaStartDate).getFullYear() : null,
          month: mediaStartDate ? new Date(mediaStartDate).getMonth() : null,
          day: mediaStartDate ? new Date(mediaStartDate).getDate() : null,
        }
      )}&completedAt=${JSON.stringify({
        year: mediaEndDate ? new Date(mediaEndDate).getFullYear() : null,
        month: mediaEndDate ? new Date(mediaEndDate).getMonth() : null,
        day: mediaEndDate ? new Date(mediaEndDate).getDate() : null,
      })}`,
      {
        headers: {
          userId: user.userID?.toString() ?? "",
          sessionId: user.sessionID,
        },
      }
    );
    queryClient.invalidateQueries({
      queryKey: ["mediaListEntry", entry.id],
      type: "all",
    });
  };

  const deleteMediaEntry = async () => {
    const data = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER}/api/deleteMediaEntry?id=${media.data.data.Media.mediaListEntry.id}`,
      {
        headers: {
          userId: user.userID?.toString() ?? "",
          sessionId: user.sessionID,
        },
      }
    );
    await queryClient.invalidateQueries({
      queryKey: ["mediaListEntry", entry.id],
      type: "all",
    });
  };
  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>
        <button
          className={cx(
            "btn | flex justify-center items-center bg-primary-500 text-white gap-2",
            !user.userAuth && "bg-gray-500"
          )}
          disabled={!user.userAuth}
        >
          {(
            media.isSuccess
              ? media.data.data.Media.mediaListEntry
              : entry.mediaListEntry
          ) ? (
            <>
              <svg
                transform="scale(1.4)"
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.1464 1.14645C12.3417 0.951184 12.6583 0.951184 12.8535 1.14645L14.8535 3.14645C15.0488 3.34171 15.0488 3.65829 14.8535 3.85355L10.9109 7.79618C10.8349 7.87218 10.7471 7.93543 10.651 7.9835L6.72359 9.94721C6.53109 10.0435 6.29861 10.0057 6.14643 9.85355C5.99425 9.70137 5.95652 9.46889 6.05277 9.27639L8.01648 5.34897C8.06455 5.25283 8.1278 5.16507 8.2038 5.08907L12.1464 1.14645ZM12.5 2.20711L8.91091 5.79618L7.87266 7.87267L8.12731 8.12732L10.2038 7.08907L13.7929 3.5L12.5 2.20711ZM9.99998 2L8.99998 3H4.9C4.47171 3 4.18056 3.00039 3.95552 3.01877C3.73631 3.03668 3.62421 3.06915 3.54601 3.10899C3.35785 3.20487 3.20487 3.35785 3.10899 3.54601C3.06915 3.62421 3.03669 3.73631 3.01878 3.95552C3.00039 4.18056 3 4.47171 3 4.9V11.1C3 11.5283 3.00039 11.8194 3.01878 12.0445C3.03669 12.2637 3.06915 12.3758 3.10899 12.454C3.20487 12.6422 3.35785 12.7951 3.54601 12.891C3.62421 12.9309 3.73631 12.9633 3.95552 12.9812C4.18056 12.9996 4.47171 13 4.9 13H11.1C11.5283 13 11.8194 12.9996 12.0445 12.9812C12.2637 12.9633 12.3758 12.9309 12.454 12.891C12.6422 12.7951 12.7951 12.6422 12.891 12.454C12.9309 12.3758 12.9633 12.2637 12.9812 12.0445C12.9996 11.8194 13 11.5283 13 11.1V6.99998L14 5.99998V11.1V11.1207C14 11.5231 14 11.8553 13.9779 12.1259C13.9549 12.407 13.9057 12.6653 13.782 12.908C13.5903 13.2843 13.2843 13.5903 12.908 13.782C12.6653 13.9057 12.407 13.9549 12.1259 13.9779C11.8553 14 11.5231 14 11.1207 14H11.1H4.9H4.87934C4.47686 14 4.14468 14 3.87409 13.9779C3.59304 13.9549 3.33469 13.9057 3.09202 13.782C2.7157 13.5903 2.40973 13.2843 2.21799 12.908C2.09434 12.6653 2.04506 12.407 2.0221 12.1259C1.99999 11.8553 1.99999 11.5231 2 11.1207V11.1206V11.1V4.9V4.87935V4.87932V4.87931C1.99999 4.47685 1.99999 4.14468 2.0221 3.87409C2.04506 3.59304 2.09434 3.33469 2.21799 3.09202C2.40973 2.71569 2.7157 2.40973 3.09202 2.21799C3.33469 2.09434 3.59304 2.04506 3.87409 2.0221C4.14468 1.99999 4.47685 1.99999 4.87932 2H4.87935H4.9H9.99998Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
              {media.isSuccess
                ? media.data.data.Media.mediaListEntry.status
                : entry.mediaListEntry.status}
            </>
          ) : (
            <>
              <svg
                transform="scale(1.5)"
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
              ADD TO LIST
            </>
          )}
        </button>
      </DialogPrimitive.Trigger>
      <Transition.Root show={open} className="absolute">
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <DialogPrimitive.Overlay
            forceMount
            className="fixed inset-0 z-20 bg-black/50"
          />
        </Transition.Child>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <DialogPrimitive.Content
            forceMount
            className={cx(
              "fixed z-50",
              "w-[95vw] max-w-3xl rounded-lg p-4 md:w-full",
              "top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]",
              "bg-white dark:bg-offWhite-800",
              "focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75"
            )}
          >
            <DialogPrimitive.Title className="text-white bg-gradient-to-r from-black/50 to-transparent  dark:from-black/80">
              <div className="flex items-center gap-2 relative">
                {entry.bannerImage ? (
                  <Image
                    fill
                    src={entry.bannerImage}
                    className="object-cover -z-50 blur-sm"
                    alt={`Banner for ${entry.title.userPreferred}`}
                  />
                ) : (
                  <div className="background--empty | absolute inset-0 object-cover -z-10" />
                )}
                <Image
                  src={entry.coverImage.large}
                  width={128}
                  height={181}
                  className="object-cover"
                  alt={`Cover for ${entry.title.userPreferred}`}
                />
                <div className="">
                  <div className="text-xl font-medium">
                    {entry.title.userPreferred}
                  </div>
                  <div>{entry.title.english}</div>
                </div>
              </div>
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="mt-2 p-4 font-normal text-offWhite-700 dark:text-offWhite-100">
              Make changes to your list entry of {entry.title.userPreferred}.
              <br />
              Click <span className="text-primary-400">Save</span> when
              you&apos;re done. Or <span className="text-red-600">Delete</span>{" "}
              to remove it from your lists.
            </DialogPrimitive.Description>
            <form className="flex flex-wrap p-8 justify-center gap-4 mt-2">
              <fieldset>
                <label
                  htmlFor="Media List Status"
                  className="text-md font-medium text-offWhite-700 dark:text-offWhite-100"
                >
                  Status
                </label>
                <SelectPrimitive.Root
                  value={String(mediaStatus)}
                  onValueChange={setMediaStatus}
                >
                  <SelectPrimitive.Trigger
                    aria-label="Media List Status"
                    asChild
                  >
                    <button className="flex gap-2 justify-center items-center p-2 w-44 h-[42px] text-black dark:text-offWhite-100 rounded-md border border-offWhite-400 focus-visible:border-transparent dark:border-offWhite-700 dark:bg-offWhite-700">
                      {(() => {
                        switch (mediaStatus) {
                          case "CURRENT":
                            return entry.type === "ANIME"
                              ? "Watching"
                              : "Reading";
                          case "PLANNING":
                            return entry.type === "ANIME"
                              ? "Plan to watch"
                              : "Plan to read";
                          case "COMPLETED":
                            return "Completed";
                          case "PAUSED":
                            return "On Hold";
                          case "REPEATING":
                            return entry.type === "ANIME"
                              ? "Rewatching"
                              : "Rereading";
                          case "DROPPED":
                            return "Dropped";
                        }
                      })()}
                      <SelectPrimitive.Icon className="">
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 15 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4.18179 6.18181C4.35753 6.00608 4.64245 6.00608 4.81819 6.18181L7.49999 8.86362L10.1818 6.18181C10.3575 6.00608 10.6424 6.00608 10.8182 6.18181C10.9939 6.35755 10.9939 6.64247 10.8182 6.81821L7.81819 9.81821C7.73379 9.9026 7.61934 9.95001 7.49999 9.95001C7.38064 9.95001 7.26618 9.9026 7.18179 9.81821L4.18179 6.81821C4.00605 6.64247 4.00605 6.35755 4.18179 6.18181Z"
                            fill="currentColor"
                            fillRule="evenodd"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </SelectPrimitive.Icon>
                    </button>
                  </SelectPrimitive.Trigger>
                  <SelectPrimitive.Content className="z-20">
                    <SelectPrimitive.ScrollUpButton className="flex items-center justify-center text-offWhite-700 dark:text-offWhite-300">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.18179 8.81819C4.00605 8.64245 4.00605 8.35753 4.18179 8.18179L7.18179 5.18179C7.26618 5.0974 7.38064 5.04999 7.49999 5.04999C7.61933 5.04999 7.73379 5.0974 7.81819 5.18179L10.8182 8.18179C10.9939 8.35753 10.9939 8.64245 10.8182 8.81819C10.6424 8.99392 10.3575 8.99392 10.1818 8.81819L7.49999 6.13638L4.81819 8.81819C4.64245 8.99392 4.35753 8.99392 4.18179 8.81819Z"
                          fill="currentColor"
                          fillRule="evenodd"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </SelectPrimitive.ScrollUpButton>
                    <SelectPrimitive.Viewport className="bg-white dark:bg-offWhite-800 p-2 rounded-lg shadow-lg relative z-50">
                      <SelectPrimitive.Group>
                        <SelectItem
                          value="CURRENT"
                          displayText={
                            entry.type === "ANIME" ? "Watching" : "Reading"
                          }
                        />
                        <SelectItem
                          value="PLANNING"
                          displayText={
                            entry.type === "ANIME"
                              ? "Plan to watch"
                              : "Plan to read"
                          }
                        />
                        <SelectItem value="COMPLETED" displayText="Completed" />
                        <SelectItem
                          value="REPEATING"
                          displayText={
                            entry.type === "ANIME" ? "Rewatching" : "Rereading"
                          }
                        />
                        <SelectItem value="PAUSED" displayText="On Hold" />
                        <SelectItem value="DROPPED" displayText="Dropped" />
                      </SelectPrimitive.Group>
                    </SelectPrimitive.Viewport>
                    <SelectPrimitive.ScrollDownButton className="flex items-center justify-center text-offWhite-700 dark:text-offWhite-300">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.18179 6.18181C4.35753 6.00608 4.64245 6.00608 4.81819 6.18181L7.49999 8.86362L10.1818 6.18181C10.3575 6.00608 10.6424 6.00608 10.8182 6.18181C10.9939 6.35755 10.9939 6.64247 10.8182 6.81821L7.81819 9.81821C7.73379 9.9026 7.61934 9.95001 7.49999 9.95001C7.38064 9.95001 7.26618 9.9026 7.18179 9.81821L4.18179 6.81821C4.00605 6.64247 4.00605 6.35755 4.18179 6.18181Z"
                          fill="currentColor"
                          fillRule="evenodd"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </SelectPrimitive.ScrollDownButton>
                  </SelectPrimitive.Content>
                </SelectPrimitive.Root>
              </fieldset>
              <fieldset>
                <label
                  htmlFor="Media List Rating"
                  className="text-md font-medium text-offWhite-700 dark:text-offWhite-100"
                >
                  Rating
                </label>
                <Rating
                  ratingType={user.userScoreFormat}
                  value={mediaScore}
                  setValue={setMediaScore}
                />
              </fieldset>
              <fieldset>
                <label
                  htmlFor="Media List Progress"
                  className="text-md font-medium text-offWhite-700 dark:text-offWhite-100"
                >
                  {entry.type === "MANGA"
                    ? "Chapter Progress"
                    : "Episode Progress"}
                </label>
                <input
                  className={cx(
                    "text-md  block rounded-md p-2 w-42",
                    "text-offWhite-700 placeholder:text-offWhite-500 dark:text-offWhite-100 dark:placeholder:text-offWhite-200",
                    "border border-offWhite-400 focus-visible:border-transparent dark:border-offWhite-700 dark:bg-offWhite-700"
                  )}
                  id="mediaProgress"
                  type="number"
                  inputMode="numeric"
                  value={mediaProgress}
                  onChange={(e) => {
                    setMediaProgress(
                      median([
                        0,
                        parseInt(e.target.value),
                        entry.type === "MANGA"
                          ? entry.chapters
                            ? entry.chapters
                            : 1000000000
                          : entry.episodes
                          ? entry.episodes
                          : 1000000000,
                      ])
                    );
                  }}
                />
              </fieldset>
              <fieldset>
                <label
                  htmlFor="Media List Rewatches/Rereads"
                  className="text-md font-medium text-offWhite-700 dark:text-offWhite-100"
                >
                  {entry.type === "MANGA"
                    ? "Number of Rereads"
                    : "Number of Rewatches"}
                </label>
                <input
                  className={cx(
                    "text-md  block rounded-md p-2 w-42",
                    "text-offWhite-700 placeholder:text-offWhite-500 dark:text-offWhite-100 dark:placeholder:text-offWhite-200",
                    "border border-offWhite-400 focus-visible:border-transparent dark:border-offWhite-700 dark:bg-offWhite-700"
                  )}
                  id="media"
                  type="number"
                  inputMode="numeric"
                  value={mediaRewatches}
                  onChange={(e) => {
                    setMediaRewatches(Math.max(0, parseInt(e.target.value)));
                  }}
                />
              </fieldset>
              <fieldset>
                <label
                  htmlFor="Media List Start Date"
                  className="text-md font-medium text-offWhite-700 dark:text-offWhite-100"
                >
                  Start Date
                </label>
                <Calender
                  date={mediaStartDate}
                  setDate={setMediaStartDate}
                  maxDate={new Date()}
                />
              </fieldset>

              <fieldset>
                <label
                  htmlFor="Media List End Date"
                  className="text-md font-medium text-offWhite-700 dark:text-offWhite-100"
                >
                  End Date
                </label>
                <Calender
                  date={mediaEndDate}
                  setDate={setMediaEndDate}
                  maxDate={new Date()}
                />
              </fieldset>
            </form>
            <Separator.Root className="w-full h-px bg-primary-100 mb-4" />
            <div className="flex justify-end text-white gap-2">
              <DialogPrimitive.Close asChild>
                <button
                  onClick={saveMediaEntry}
                  className="btn | w-24 flex gap-1 justify-center items-center bg-primary-500"
                >
                  <MdSave size={20} /> Save
                </button>
              </DialogPrimitive.Close>
              <DialogPrimitive.Close asChild>
                <button
                  onClick={deleteMediaEntry}
                  className="btn | w-24 flex gap-1 justify-center items-center bg-red-700"
                >
                  <MdDelete size={20} /> Delete
                </button>
              </DialogPrimitive.Close>
            </div>
          </DialogPrimitive.Content>
        </Transition.Child>
      </Transition.Root>
    </DialogPrimitive.Root>
  );
};

export default MediaListEditor;
