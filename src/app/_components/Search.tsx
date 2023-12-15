import {
  ChevronDownIcon,
  Cross2Icon,
  MagnifyingGlassIcon,
  MixerHorizontalIcon,
} from "@radix-ui/react-icons";
import { useState } from "react";
import Dialog, { Props as DialogProps } from "~/primitives/Dialog";
import Popover from "~/primitives/Popover";
import Select from "~/primitives/Select";
import TextField from "~/primitives/TextField";
import { Root as Label } from "@radix-ui/react-label";
import Slider from "~/primitives/Slider";
export type Props = Pick<DialogProps, "open" | "onOpenChange">;
enum SearchCategory {
  anime = "Anime",
  manga = "Manga",
  character = "Character",
  staff = "Staff",
  studio = "Studio",
}

export default (props: Props) => {
  const [searchTerm, setSearchTerm] = useState<string>();
  const [searchCategory, setSeachCategory] = useState<SearchCategory>(
    SearchCategory.anime,
  );
  const [searchYearStart, setSearchYearStart] = useState<number>(1970);
  const [searchYearEnd, setSearchYearEnd] = useState<number>(2024);
  return (
    <Dialog
      {...props}
      content={{
        title: (
          <TextField
            placeholder="Search..."
            variant="surface"
            rootClasses="outline-primary-500 focus-within:-outline-offset-4 hover:-outline-offset-4 focus-within:outline hover:outline  outline-4 transition-all p-1 dark:bg-white/10"
            startIcon={{
              icon: (
                <Select
                  trigger={
                    <button className="flex items-center gap-2 bg-primary-500/20 p-2">
                      <MagnifyingGlassIcon className="scale-150" />
                      {searchCategory} <ChevronDownIcon />
                    </button>
                  }
                  defaultValue={SearchCategory.anime}
                  values={[
                    {
                      value: SearchCategory.anime,
                      displayTitle: "Anime",
                    },
                    {
                      value: SearchCategory.manga,
                      displayTitle: "Manga",
                    },

                    {
                      value: SearchCategory.character,
                      displayTitle: "Character",
                    },

                    {
                      value: SearchCategory.staff,
                      displayTitle: "Staff",
                    },
                    {
                      value: SearchCategory.studio,
                      displayTitle: "Studio",
                    },
                  ]}
                  onValueChange={(v) => {
                    setSeachCategory(v as SearchCategory);
                  }}
                  triggerAriaLabel="Search Field"
                  value={searchCategory}
                />
              ),
              color: "ruby",
              gap: "4",
            }}
            onValueChange={(e) => {
              setSearchTerm(e);
            }}
            endIcon={{
              icon: (
                <Popover
                  trigger={
                    <button className="flex items-center gap-2 bg-primary-500/20 p-2">
                      <MixerHorizontalIcon />
                    </button>
                  }
                  closeIcon={
                    <button className="float-right rounded-md bg-primary-700 p-2">
                      <Cross2Icon className="scale-125 text-primary-500" />
                    </button>
                  }
                  content={
                    <div className="flex flex-col gap-2 p-2">
                      <div>
                        <Label htmlFor="yearRangeSelector">Year Range</Label>
                        <Slider
                          id="yearRangeSelector"
                          max={2024}
                          min={1970}
                          step={1}
                          value={[searchYearStart, searchYearEnd]}
                          ariaLabel="Year Range Selector"
                          onChange={(v) => {
                            setSearchYearStart(v.sort().at(0)!);
                            setSearchYearEnd(v.sort().at(-1)!);
                          }}
                          thumbClasses="w-4 h-4"
                          trackClasses="dark:bg-primary-400"
                        />
                      </div>
                      <div>Season: =======</div>
                      <div>Tags: ========</div>
                    </div>
                  }
                />
              ),
              color: "ruby",
              gap: "4",
            }}
            value={searchTerm}
            className="focus-within:border-b-1 hover:border-b-1 isolate z-0 mx-2 h-full rounded-md border-0 border-secondary-500 bg-black/20 px-2 py-1 text-primary-400 outline-none transition-all placeholder:text-primary-400 dark:bg-black/50 placeholder:dark:text-primary-500"
          />
        ),
      }}
    />
  );
};
