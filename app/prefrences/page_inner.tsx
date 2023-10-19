"use client";

import * as Separator from "@radix-ui/react-separator";
import * as Slider from "@radix-ui/react-slider";
import * as Tooltip from "@radix-ui/react-tooltip";
import cx from "classnames";
import { useContext, useEffect, useState } from "react";
import Background from "../../components/Background";
import Select from "../../primitives/Select";
import Switch from "../../primitives/Switch";
import { userContext } from "../UserContext";



export const PageInner = () => {
    const user = useContext(userContext);
    const [episodeUpdateTreshold, setEpisodeUpdateTreshold] = useState<number>(
      user.userPreferenceEpisodeUpdateTreshold !== undefined
        ? user.userPreferenceEpisodeUpdateTreshold
        : 0.85
    );
    const [mangaUpdateTreshold, setMangaUpdateTreshold] = useState<number>(
      user.userPreferenceMangaUpdateTreshold !== undefined
        ? user.userPreferenceMangaUpdateTreshold
        : 0.6
    );
    const [openingSkipTime, setOpeningSkipTime] = useState<number>(
      user.userPreferenceSkipOpening !== undefined
        ? user.userPreferenceSkipOpening
        : 85
    );
    const [animeEndDialog, setAnimeEndDialog] = useState<boolean>(
      user.userPreferenceShowEndDialog !== undefined
        ? user.userPreferenceShowEndDialog
        : true
    );
    const [mangaEndDialog, setMangaEndDialog] = useState<boolean>(
      user.userPreferenceMangaEndDialog !== undefined
        ? user.userPreferenceMangaEndDialog
        : true
    );
    const [isDubbed, setIsDubbed] = useState<boolean>(
      user.userPreferenceDubbed !== undefined ? user.userPreferenceDubbed : false
    );
    const updateLocalStorage = (key: string, value: any) => {
      localStorage.setItem(key, String(value));
      if (user.broadcastChannel) {
        user.broadcastChannel.postMessage("userUpdate");
        console.log(user.broadcastChannel);
      }
    };
  
    useEffect(() => {
      setEpisodeUpdateTreshold(
        user.userPreferenceEpisodeUpdateTreshold !== undefined
          ? user.userPreferenceEpisodeUpdateTreshold
          : 0.85
      );
      setMangaUpdateTreshold(
        user.userPreferenceMangaUpdateTreshold !== undefined
          ? user.userPreferenceMangaUpdateTreshold
          : 0.6
      );
      setOpeningSkipTime(
        user.userPreferenceSkipOpening !== undefined
          ? user.userPreferenceSkipOpening
          : 85
      );
      setAnimeEndDialog(
        user.userPreferenceShowEndDialog !== undefined
          ? user.userPreferenceShowEndDialog
          : true
      );
      setMangaEndDialog(
        user.userPreferenceMangaEndDialog !== undefined
          ? user.userPreferenceMangaEndDialog
          : true
      );
      setIsDubbed(
        user.userPreferenceDubbed !== undefined
          ? user.userPreferenceDubbed
          : false
      );
    }, [user]);
    return (
      <Tooltip.TooltipProvider>
        <div className="w-full h-full flex justify-center items-center p-2">
          <Background
            classes="fixed inset-0"
            backgroundImage="/haruhiHomeBg.webp"
          />
          <div className="w-11/12 text-black dark:text-white p-4 bg-white/50 dark:bg-black/50 rounded-md">
            <div className="text-2xl  font-semibold">User Prefrences</div>
            <Separator.Root className="h-px w-full bg-black dark:bg-white my-4" />
            <div
              className="w-full p-2 grid gap-2"
              style={{ gridTemplateColumns: "1fr min(40vw, 20rem)" }}
            >
              <div className="text-xl p-4 bg-offWhite-100/50 dark:bg-offWhite-900/50 w-full col-span-2 text-primary-500 font-medium rounded-md">
                Anime Prefrences
              </div>
              <div className="p-2">Prefers Dubbed</div>
              <div className="p-2 flex justify-center items-center">
                <Switch
                  checked={isDubbed}
                  onChecked={(val: boolean) => {
                    setIsDubbed(val);
                    updateLocalStorage("UserPrefDubbed", val);
                  }}
                />
              </div>
              <div className="p-2">Episode Update Threshold</div>
              <div className="p-2">
                <Slider.Root
                  className=" relative flex h-5 touch-none items-center"
                  value={[episodeUpdateTreshold]}
                  onValueChange={(value) => {
                    setEpisodeUpdateTreshold(value[0]);
                    updateLocalStorage("UserPrefEpisodeTreshold", value[0]);
                  }}
                  max={1}
                  step={0.01}
                  aria-label="Episode Update Treshold"
                >
                  <Slider.Track className="relative h-1 w-full grow rounded-full bg-white dark:bg-offWhite-800">
                    <Slider.Range className="absolute h-full rounded-full bg-primary-500 " />
                  </Slider.Track>
                  <Tooltip.Root delayDuration={0}>
                    <Tooltip.Trigger
                      asChild
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      <Slider.Thumb
                        className={cx(
                          "block h-5 w-5 rounded-full bg-primary-500 ",
                          "focus:outline-none focus-visible:ring focus-visible:ring-primary-300 focus-visible:ring-opacity-75"
                        )}
                      />
                    </Tooltip.Trigger>
                    <Tooltip.Content
                      onPointerDownOutside={(e) => {
                        e.preventDefault();
                      }}
                      sideOffset={4}
                      key={episodeUpdateTreshold}
                      className={cx(
                        "radix-side-top:animate-slide-down-fade",
                        "radix-side-right:animate-slide-left-fade",
                        "radix-side-bottom:animate-slide-up-fade",
                        "radix-side-left:animate-slide-right-fade",
                        "inline-flex items-center rounded-md px-4 py-2.5",
                        "bg-white dark:bg-offWhite-500"
                      )}
                    >
                      <Tooltip.Arrow className="fill-current text-white dark:text-offWhite-500" />
                      <span className="block text-xs leading-none text-offWhite-700 dark:text-offWhite-100">
                        {episodeUpdateTreshold}
                      </span>
                    </Tooltip.Content>
                  </Tooltip.Root>
                </Slider.Root>
              </div>
              <div className="p-2">
                <div className="">Opening Skip Time</div>
                <div className="text-sm">Setting to 0 removes Button</div>
              </div>
              <div className="p-2 flex justify-center items-center">
                <Select
                  defaultValue={85}
                  value={String(openingSkipTime)}
                  onValueChange={(val: string) => {
                    setOpeningSkipTime(parseInt(val));
                    updateLocalStorage("UserPrefSkipOpening", val);
                  }}
                  triggerAriaLabel="Opening Skip Selector"
                  values={[0, 75, 80, 85, 90, 95]}
                />
              </div>
              <div className="p-2">
                <div className="">Show End Rating Dialog</div>
                <div className="text-sm">
                  Presents user with a prompt to rate show after finishing all
                  episodes of it.
                </div>
              </div>
              <div className="p-2 flex justify-center items-center">
                <Switch
                  checked={animeEndDialog}
                  onChecked={(val: boolean) => {
                    setAnimeEndDialog(val);
                    updateLocalStorage("UserPrefShowEndDialog", val);
                  }}
                />
              </div>
  
              <div className="text-xl p-4 bg-offWhite-100/50 dark:bg-offWhite-900/50 w-full col-span-2 text-primary-500 font-medium rounded-md">
                Manga Prefrences
              </div>
              <div className="p-2">Chapter Update Threshold</div>
              <div className="p-2">
                <Slider.Root
                  className="relative flex h-5  touch-none items-center"
                  value={[mangaUpdateTreshold]}
                  onValueChange={(value) => {
                    setMangaUpdateTreshold(value[0]);
                    updateLocalStorage("UserPrefMangaTreshold", value[0]);
                  }}
                  max={1}
                  step={0.01}
                  aria-label="Manga Chapter Update Treshold"
                >
                  <Slider.Track className="relative h-1 w-full grow rounded-full bg-white dark:bg-offWhite-800">
                    <Slider.Range className="absolute h-full rounded-full bg-primary-500 " />
                  </Slider.Track>
                  <Tooltip.Root delayDuration={0}>
                    <Tooltip.Trigger
                      asChild
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      <Slider.Thumb
                        className={cx(
                          "block h-5 w-5 rounded-full bg-primary-500 ",
                          "focus:outline-none focus-visible:ring focus-visible:ring-primary-300 focus-visible:ring-opacity-75"
                        )}
                      />
                    </Tooltip.Trigger>
                    <Tooltip.Content
                      onPointerDownOutside={(e) => {
                        e.preventDefault();
                      }}
                      sideOffset={4}
                      key={mangaUpdateTreshold}
                      className={cx(
                        "radix-side-top:animate-slide-down-fade",
                        "radix-side-right:animate-slide-left-fade",
                        "radix-side-bottom:animate-slide-up-fade",
                        "radix-side-left:animate-slide-right-fade",
                        "inline-flex items-center rounded-md px-4 py-2.5",
                        "bg-white dark:bg-offWhite-500"
                      )}
                    >
                      <Tooltip.Arrow className="fill-current text-white dark:text-offWhite-500" />
                      <span className="block text-xs leading-none text-offWhite-700 dark:text-offWhite-100">
                        {mangaUpdateTreshold}
                      </span>
                    </Tooltip.Content>
                  </Tooltip.Root>
                </Slider.Root>
              </div>
              <div className="p-2">
                <div className="">Show End Rating Dialog</div>
                <div className="text-sm">
                  Presents user with a prompt to rate manga after finishing all
                  chapters of it.
                </div>
              </div>
              <div className="p-2 flex justify-center items-center">
                <Switch
                  checked={mangaEndDialog}
                  onChecked={(val: boolean) => {
                    setMangaEndDialog(val);
                    updateLocalStorage("UserPrefMangaEndDialog", val);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </Tooltip.TooltipProvider>
    );
}