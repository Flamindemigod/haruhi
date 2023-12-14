import { ChevronDownIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import Dialog, { Props as DialogProps } from "~/primitives/Dialog";
import Select from "~/primitives/Select";
import TextField from "~/primitives/TextField";

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
  return (
    <Dialog
      {...props}
      content={{
        title: (
          <TextField
            placeholder="Search..."
            variant="surface"
            rootClasses="outline-primary-500 focus-within:-outline-offset-4 hover:-outline-offset-4 focus-within:outline hover:outline  outline-4 transition-all p-1 dark:bg-white/10"
            icon={{
              icon: (
                <div className="flex items-center gap-2 bg-primary-500/20 p-2">
                  <MagnifyingGlassIcon className="scale-150" />
                  <Select
                    trigger={
                      <button className="flex items-center gap-2">
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
                </div>
              ),
              color: "ruby",
              gap: "4",
            }}
            onValueChange={(e) => {
              setSearchTerm(e);
            }}
            value={searchTerm}
            className="focus-within:border-b-1 hover:border-b-1 isolate z-0 mx-2 h-full rounded-md border-0 border-secondary-500 bg-black/20 px-2 py-1 text-primary-400 outline-none transition-all placeholder:text-primary-400 dark:bg-black/50 placeholder:dark:text-primary-500"
          />
        ),
      }}
    />
  );
};
