"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect, useRef, useState } from "react";
import ComicViewer from "react-comic-viewer";
import { MdSkipNext, MdSkipPrevious } from "react-icons/md";
import { userContext } from "../../app/UserContext";
import { median } from "../../utils/median";
import Selector from "./Selector";

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
  const [imgSrc, setImageSrc] = useState<any>(undefined);
  const mangaChapters = useQuery({
    queryKey: [
      "mangaPages",
      props.entry.title.english || props.entry.title.romaji,
    ],
    queryFn: async () => {
      const data = await fetch(
        `http://136.243.175.33:8080/api/getMangaChapters?title=${
          props.entry.title.english || props.entry.title.romaji
        }`
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
        `http://136.243.175.33:8080/api/getMangaPanels?id=${chapterId}`
      );
      return data.json();
    },
  });

  const updateChapter = async (
    id: number,
    chapterIndex: number,
    status: string,
    rewatches = 0
  ) => {
    const data = await fetch(
      `http://136.243.175.33:8080/api/setMediaEntry?&mediaId=${id}&status=${status}&progress=${Math.floor(
        chapterIndex + 1
      )}&repeat=${rewatches}`
    );
    queryClient.invalidateQueries({
      queryKey: ["mediaListEntry"],
      type: "all",
    });

    // if (openToast) {
    //   setOpenToast(false);
    //   setTimeout(() => {
    //     setOpenToast(true);
    //   }, 400);
    // } else {
    //   setOpenToast(true);
    // }
  };
  useEffect(() => {
    if (user.userAuth) {
      if (
        progress / mangaPages.data?.length >=
          (user.userPreferenceMangaUpdateTreshold || 0.85) &&
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
      {(mangaChapters.isFetching || mangaChapters.data?.length) && (
        <>
          {mangaPages.isSuccess && (
            <div className="">
              <ComicViewer
                onChangeCurrentPage={(e) => setProgress(e)}
                pages={mangaPages.data?.map((el: any) => el.img) || []}
              />
            </div>
          )}
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
        </>
      )}
    </div>
  );
};

export default Reader;
