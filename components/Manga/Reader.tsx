"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect, useRef, useState } from "react";
import ComicViewer from "react-comic-viewer";
import { MdClose, MdSkipNext, MdSkipPrevious } from "react-icons/md";
import { userContext } from "../../app/UserContext";
import { median } from "../../utils/median";
import Selector from "./Selector";
import * as ToastPrimitive from "@radix-ui/react-toast";
import cx from "classnames";
import VideoPlayerSkeleton from "../Anime/VideoPlayerSkeleton";
import Image from "next/image";
import decryptImage from "../../utils/decrypt";
import Switch from "../../primitives/Switch";
type Props = {
  entry: any;
};

const Reader = (props: Props) => {
  const queryClient = useQueryClient();
  const user = useContext(userContext);
  const [chapterIndex, setChapterIndex] = useState<number>(0);
  const [chapterId, setChapterId] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const statusUpdated = useRef<boolean>(false);
  const [isShuffled, setIsShuffled] = useState<boolean>(false);
  const [frames, setFrames] = useState<string[]>([]);
  const [openToast, setOpenToast] = useState<boolean>(false);
  const mangaChapters = useQuery({
    queryKey: ["mangaPages", props.entry.id],
    queryFn: async () => {
      const data = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER}/api/getMangaChapters?id=${props.entry.id}`
      );
      return data.json();
    },
  });
  useEffect(() => {
    if (props.entry.mediaListEntry) {
      setChapterIndex(
        median([
          0,
          props.entry.mediaListEntry.progress,
          props.entry.chapters ? props.entry.chapters - 1 : 999999,
        ])
      );
    } else {
      setChapterIndex(0);
    }
  }, []);

  useEffect(() => {
    if (mangaChapters.isSuccess) {
      setChapterId(
        mangaChapters.data[mangaChapters.data.length - 1 - chapterIndex]?.id ||
          mangaChapters.data[0]?.id
      );
      queryClient.invalidateQueries({
        queryKey: ["mangaPanels"],
        type: "all",
      });
      statusUpdated.current = false;
    }
  }, [chapterIndex, mangaChapters.isSuccess]);

  const mangaPages = useQuery({
    queryKey: ["mangaPanels", chapterId],
    queryFn: async () => {
      const data = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER}/api/getMangaPanels?id=${chapterId}`
      );
      return data.json();
    },
    onSuccess: async (data: any[]) => {
      const promises = data.map(async (el: any) => {
        const k = await decryptImage(el.img);
        return k;
      });

      const dataurls: string[] = (await Promise.all(promises)) as string[];

      setFrames(dataurls);
    },
  });

  const updateChapter = async (
    id: number,
    chapterIndex: number,
    status: string,
    rewatches = 0
  ) => {
    const data = await fetch(
      `${
        process.env.NEXT_PUBLIC_SERVER
      }/api/setMediaEntry?&mediaId=${id}&status=${status}&progress=${Math.floor(
        chapterIndex + 1
      )}&repeat=${rewatches}`,
      {
        headers: {
          userId: user.userID?.toString() ?? "",
          sessionId: user.sessionID,
        },
      }
    );
    queryClient.invalidateQueries({
      queryKey: ["mediaListEntry"],
      type: "all",
    });

    if (openToast) {
      setOpenToast(false);
      setTimeout(() => {
        setOpenToast(true);
      }, 400);
    } else {
      setOpenToast(true);
    }
  };
  useEffect(() => {
    if (user.userAuth) {
      if (
        progress / mangaPages.data?.length! >=
          (user.userPreferenceMangaUpdateTreshold || 0.6) &&
        !statusUpdated.current
      ) {
        statusUpdated.current = true;
        if (chapterIndex === 0) {
          if (props.entry.mediaListEntry) {
            if (props.entry.mediaListEntry.status === "COMPLETED") {
              updateChapter(
                props.entry.id,
                chapterIndex,
                "CURRENT",
                props.entry.mediaListEntry.repeat + 1
              );
            }
          } else {
            updateChapter(
              props.entry.id,
              chapterIndex,
              "CURRENT",
              props.entry.mediaListEntry ? props.entry.mediaListEntry.repeat : 0
            );
          }
        }
        if (chapterIndex === props.entry.chapters) {
          if (chapterIndex === 1) {
            updateChapter(
              props.entry.id,
              chapterIndex,
              "COMPLETED",
              props.entry.mediaListEntry.repeat + 1
            );
          } else {
            updateChapter(
              props.entry.id,
              chapterIndex,
              "COMPLETED",
              props.entry.mediaListEntry.repeat
            );
          }
        } else {
          updateChapter(
            props.entry.id,
            chapterIndex,
            "CURRENT",
            props.entry.mediaListEntry ? props.entry.mediaListEntry.repeat : 0
          );
        }
      }
    }
  }, [progress]);

  return (
    <div className="mt-8 flex flex-col gap-2">
      <ToastPrimitive.Provider>
        {(mangaChapters.isFetching || mangaChapters.data?.length) && (
          <>
            {mangaChapters.isFetching ? (
              <VideoPlayerSkeleton />
            ) : (
              <div className="">
                {isShuffled ? (
                  <ComicViewer
                    onChangeCurrentPage={(e) => setProgress(e)}
                    pages={
                      mangaPages.data?.map(
                        (el: any) =>
                          `https://server.flamindemigod.com/image-proxy?url=${encodeURIComponent(
                            el.img
                          )}`
                      ) || []
                    }
                  />
                ) : (
                  <ComicViewer
                    onChangeCurrentPage={(e) => setProgress(e)}
                    pages={frames.map((frame: string, i: number) => (
                      <Image
                        key={i}
                        width={500}
                        height={300}
                        alt=""
                        src={frame}
                      />
                    ))}
                  />
                )}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-3 w-full p-4 items-center">
              <div></div>
              <div className="flex justify-center items-center">
                <button
                  className="btn | flex justify-center dark:text-white"
                  disabled={
                    props.entry.chapters
                      ? chapterIndex + 1 === props.entry.chapters
                      : false
                  }
                  onClick={() => {
                    setChapterIndex((state) => state + 1);
                  }}
                >
                  <MdSkipPrevious size={24} />
                </button>
                <Selector
                  chapterList={mangaChapters.data || []}
                  value={chapterIndex}
                  onValueChange={setChapterIndex}
                />
                <button
                  className="btn | flex justify-center dark:text-white"
                  disabled={chapterIndex === 0}
                  onClick={() => {
                    setChapterIndex((state) => state - 1);
                  }}
                >
                  <MdSkipNext size={24} />
                </button>
              </div>
              <div className="flex gap-2 items-center justify-end">
                <label
                  className="text-offWhite-900 dark:text-offWhite-100"
                  htmlFor="Shuffle Toggle"
                >
                  Shuffled
                </label>
                <Switch checked={isShuffled} onChecked={setIsShuffled} />
              </div>
            </div>
          </>
        )}
        <ToastPrimitive.Root
          open={openToast}
          onOpenChange={setOpenToast}
          className={cx(
            "z-50 fixed bottom-4 inset-x-4 w-auto md:bottom-4 md:right-4 md:left-auto md:top-auto md:w-full md:max-w-sm shadow-lg rounded-lg",
            "bg-white dark:bg-offWhite-800",
            "radix-state-open:animate-toast-slide-in-bottom md:radix-state-open:animate-toast-slide-in-right",
            "radix-state-closed:animate-toast-hide",
            "radix-swipe-end:animate-toast-swipe-out",
            "translate-x-radix-toast-swipe-move-x",
            "radix-swipe-cancel:translate-x-0 radix-swipe-cancel:duration-200 radix-swipe-cancel:ease-[ease]",
            "focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75"
          )}
        >
          <div className="flex">
            <div className="w-0 flex-1 flex items-center pl-5 py-4">
              <div className="w-full radix">
                <ToastPrimitive.Title className="text-sm font-medium text-offWhite-900 dark:text-offWhite-100">
                  Chapter Updated
                </ToastPrimitive.Title>
              </div>
            </div>
            <div className="flex">
              <div className="flex flex-col px-3 py-2 space-y-1">
                <div className="h-0 flex-1 flex">
                  <ToastPrimitive.Close
                    asChild
                    className="w-full border border-transparent rounded-lg px-3 py-2 flex items-center justify-center text-sm font-medium text-offWhite-700 dark:text-offWhite-100 hover:bg-offWhite-50 dark:hover:bg-offWhite-900 focus:z-10 focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75"
                  >
                    <button className="btn dark:text-white">
                      <MdClose />
                    </button>
                  </ToastPrimitive.Close>
                </div>
              </div>
            </div>
          </div>
        </ToastPrimitive.Root>

        <ToastPrimitive.Viewport />
      </ToastPrimitive.Provider>
    </div>
  );
};

export default Reader;
