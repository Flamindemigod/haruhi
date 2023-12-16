"use client";

import React, { ReactNode, RefObject, useState } from "react";
import { Root as Label } from "@radix-ui/react-label";
import Slider from "~/primitives/Slider";
import RadioGroup from "~/primitives/RadioGroup";
import Select from "~/primitives/Select";
import TextField from "~/primitives/TextField";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  MixerHorizontalIcon,
} from "@radix-ui/react-icons";
import Drawer from "~/primitives/Drawer";

export enum SearchCategory {
  anime = "Anime",
  manga = "Manga",
  character = "Character",
  staff = "Staff",
  studio = "Studio",
}

enum SearchSeason {
  any = "Any",
  winter = "Winter",
  spring = "Spring",
  summer = "Summer",
  fall = "Fall",
}

enum SearchStatus {
  any = "Any",
  releasing = "Releasing",
  finished = "Finished",
  notYetReleased = "Not Yet Released",
  cancelled = "Cancelled",
  hiatus = "Hiatus",
}

enum SearchFormatAnime {
  any = "Any",
  tv = "TV",
  tvShort = "TV Short",
  movie = "Movie",
  special = "Special",
  ova = "OVA",
  ona = "ONA",
  music = "Music",
}

enum SearchFormatManga {
  any = "Any",
  manga = "Manga",
  novel = "Novel",
  oneShot = "One Shot",
}

const Wrapper = ({ children }: { children?: ReactNode }) => (
  <div className="flex flex-col gap-2 rounded-md bg-white/10 p-4">
    {children}
  </div>
);

export default (
  container?: RefObject<HTMLDivElement>,
): {
  render: React.JSX.Element;
} => {
  const [searchTerm, setSearchTerm] = useState<string>();
  const [searchCategory, setSeachCategory] = useState<SearchCategory>(
    SearchCategory.anime,
  );
  const [searchSeason, setSearchSeason] = useState<SearchSeason>(
    SearchSeason.any,
  );
  const [searchStatus, setSearchStatus] = useState<SearchStatus>(
    SearchStatus.any,
  );
  const [searchFormat, setSearchFormat] = useState<
    SearchFormatAnime | SearchFormatManga
  >(
    searchCategory === SearchCategory.manga
      ? SearchFormatManga.any
      : SearchFormatAnime.any,
  );

  const [searchYearStart, setSearchYearStart] = useState<number>(1970);
  const [searchYearEnd, setSearchYearEnd] = useState<number>(2024);

  const [searchEpisodeMin, setSearchEpisodeMin] = useState<number>(0);
  const [searchEpisodeMax, setSearchEpisodeMax] = useState<number>(150);

  const [searchDurationMin, setSearchDurationMin] = useState<number>(0);
  const [searchDurationMax, setSearchDurationMax] = useState<number>(200);

  const filterSelector = (category: SearchCategory) => {
    switch (category) {
      case SearchCategory.anime:
        return (
          <div className="m-2 grid h-full w-full gap-2 overflow-y-scroll p-2">
            {/* Airing Status */}
            <Wrapper>
              <Label
                className="text-lg font-semibold text-primary-500"
                htmlFor="airingStatusSelector"
              >
                Airing Status
              </Label>
              <RadioGroup
                name="airingStatusSelector"
                orientation="horizontal"
                dataValues={Object.values(SearchStatus).map((v) => ({
                  value: v,
                  displayTitle: v,
                }))}
                icon={<div className="h-3 w-3 rounded-full bg-primary-500" />}
                value={searchStatus}
                onValueChange={setSearchStatus}
              />
            </Wrapper>
            {/* Format */}
            <Wrapper>
              <Label
                className="text-lg font-semibold text-primary-500"
                htmlFor="formatSelector"
              >
                Format
              </Label>
              <RadioGroup
                name="formatSelector"
                orientation="horizontal"
                dataValues={Object.values(SearchFormatAnime).map((v) => ({
                  value: v,
                  displayTitle: v,
                }))}
                icon={<div className="h-3 w-3 rounded-full bg-primary-500" />}
                value={searchFormat}
                onValueChange={setSearchFormat}
              />
            </Wrapper>
            {/* Season Selector */}
            <Wrapper>
              <Label
                className="text-lg font-semibold text-primary-500"
                htmlFor="seasonSelector"
              >
                Season
              </Label>
              <RadioGroup
                name="seasonSelector"
                orientation="horizontal"
                dataValues={Object.values(SearchSeason).map((v) => ({
                  value: v,
                  displayTitle: v,
                }))}
                icon={<div className="h-3 w-3 rounded-full bg-primary-500" />}
                value={searchSeason}
                onValueChange={setSearchSeason}
              />
            </Wrapper>
            {/* Year Range */}
            <Wrapper>
              <Label
                className="text-lg font-semibold text-primary-500"
                htmlFor="yearRangeSelector"
              >
                Year Range {`[${searchYearStart} - ${searchYearEnd}]`}
              </Label>
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
            </Wrapper>
            {/* Episodes Range */}
            <Wrapper>
              <Label
                className="text-lg font-semibold text-primary-500"
                htmlFor="episodeRangeSelector"
              >
                Episode Range{" "}
                {`[${searchEpisodeMin} - ${
                  searchEpisodeMax === 150 ? "150+" : searchEpisodeMax
                }]`}
              </Label>
              <Slider
                id="episodeRangeSelector"
                max={150}
                min={0}
                step={1}
                value={[searchEpisodeMin, searchEpisodeMax]}
                ariaLabel="Episode Range Selector"
                onChange={(v) => {
                  setSearchEpisodeMin(v.at(0)!);
                  setSearchEpisodeMax(v.at(-1)!);
                }}
                thumbClasses="w-4 h-4"
                trackClasses="dark:bg-primary-400"
              />
            </Wrapper>

            {/* Duration Range */}
            <Wrapper>
              <Label
                className="text-lg font-semibold text-primary-500"
                htmlFor="durationRangeSelector"
              >
                Duration Range{" "}
                {`[${searchDurationMin} - ${
                  searchDurationMax === 200 ? "200+" : searchDurationMax
                }]`}
              </Label>
              <Slider
                id="durationRangeSelector"
                max={200}
                min={0}
                step={1}
                value={[searchDurationMin, searchDurationMax]}
                ariaLabel="Duration Range Selector"
                onChange={(v) => {
                  setSearchDurationMin(v.at(0)!);
                  setSearchDurationMax(v.at(-1)!);
                }}
                thumbClasses="w-4 h-4"
                trackClasses="dark:bg-primary-400"
              />
            </Wrapper>

            {/* TODO: Genre Selection */}
            <Wrapper>
              <Label
                className="text-lg font-semibold text-primary-500"
                htmlFor="genreSelector"
              >
                Genres
              </Label>
            </Wrapper>

            {/* TODO: Tag Percentage */}
            <Wrapper>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repellat
              modi natus quibusdam ea quod, veritatis eligendi voluptatibus
              ullam, eaque suscipit, dolore tenetur laboriosam a expedita quae.
              Aut itaque ipsa saepe! Aliquid tenetur amet quo quibusdam pariatur
              laborum voluptate. Nesciunt veniam enim ullam odio qui culpa
              maiores quod neque totam eum facilis ad ab tenetur assumenda,
              officia dolorum soluta obcaecati consequuntur! Id consequuntur
              soluta dolorum, qui deserunt in quos, corporis, tempore quidem
              illum similique. Eaque delectus earum eligendi accusantium totam
              deleniti veniam saepe esse inventore unde, dolor vero sapiente
              porro illum! Totam earum consectetur non sunt aperiam doloribus!
              Incidunt harum, ad perferendis enim esse doloremque, quaerat
              facere asperiores quas quos velit. Nesciunt, quaerat sint.
              Expedita, odit cupiditate pariatur debitis at numquam. Rerum iusto
              reprehenderit, deserunt ullam tempora eligendi sequi excepturi
              nesciunt ea magnam ipsum repellendus molestias ipsam assumenda,
              facilis a neque consequuntur quas officia. Quasi, beatae ex.
              Blanditiis quo dolorum aut. Distinctio commodi minima impedit
              autem repudiandae dolore quibusdam iusto, tenetur odit dignissimos
              perferendis, id qui totam dolores maiores neque nam eos incidunt
              tempora esse unde harum temporibus aliquid. Deleniti, sapiente!
              Assumenda ex ea adipisci hic repellendus accusamus laboriosam
              nesciunt nihil ab dolorum, voluptatem a iste minus velit quisquam
              magni perferendis quo cumque deserunt saepe sint provident
              corporis. Dicta, eligendi totam. Earum at nemo tempore asperiores.
              Reiciendis eius delectus temporibus dignissimos eos nam dolor? Nam
              repudiandae, sunt praesentium, optio nostrum dicta facere quidem
              mollitia autem vel at deleniti libero soluta. Praesentium. Neque
              ipsa commodi sed quis eveniet odio possimus voluptatibus aliquid
              explicabo delectus, alias totam minima sequi amet reiciendis
              distinctio cum beatae excepturi maxime libero saepe? Et inventore
              ea similique quaerat? Illum necessitatibus, architecto quos
              similique nihil corrupti cum vero aliquid ullam ad est,
              consectetur itaque autem enim tenetur asperiores dolorum? Quo
              laboriosam ab inventore quis expedita. Voluptas cum reprehenderit
              corrupti. Amet ratione fugiat molestiae officia incidunt ullam
              vitae temporibus quas dolores est accusamus ut expedita quisquam,
              cupiditate numquam quos asperiores. Dolorem nisi assumenda
              perferendis et. Itaque mollitia voluptatum quibusdam ratione.
              Earum suscipit nostrum reiciendis, quasi porro ipsa sapiente fugit
              voluptas blanditiis expedita iste cumque eum nesciunt perspiciatis
              officia laudantium accusamus aspernatur architecto sit quod! Ut
              placeat facere quasi expedita ipsa? Error totam iste aliquam
              maiores. Facilis voluptatum minus ut? Asperiores ratione labore
              officia dolorum nihil sint, facilis repudiandae optio dicta, rerum
              iste ducimus in modi incidunt vel quasi fugiat excepturi? Saepe
              ipsum, odit magnam voluptates nemo animi placeat exercitationem
              impedit! Deserunt, temporibus, non magni quibusdam perspiciatis
              cumque harum ratione, tenetur mollitia in eaque! Illum autem odio
              iste itaque! Minima, suscipit? Iure molestias nostrum, sint error
              tempore quod. Inventore nisi architecto, quam placeat ratione
              veritatis reiciendis. Excepturi, molestias dolorum accusamus
              voluptate magni blanditiis sapiente voluptas, atque aut, a magnam
              accusantium dignissimos. Autem illum provident nobis unde itaque
              dolores quae perferendis, veniam soluta sequi accusantium
              aspernatur officia sed quas nam modi nulla nisi maiores
              consequuntur laborum amet excepturi nihil. Excepturi, pariatur
              ipsam! Iure blanditiis amet sequi officia, eius accusantium
              recusandae aperiam, eum maiores fuga reiciendis mollitia rerum
              nostrum nesciunt! Totam aspernatur molestiae ad consequatur
              dignissimos dolore quod minima odio modi! Architecto, vitae. Ipsam
              numquam quasi tempora dolor sequi cupiditate praesentium animi ex
              impedit, saepe est rem recusandae doloremque culpa nam perferendis
              accusamus nisi libero perspiciatis asperiores quis laudantium
              optio voluptatibus repellat. Quos! Aliquid expedita, omnis,
              consequatur vel culpa magnam quasi repellat nemo tenetur
              cupiditate ullam nobis. Quibusdam repudiandae, illo eaque
              assumenda, vitae nostrum modi voluptate similique quo magnam sed
              necessitatibus ea expedita? Provident, nihil iure distinctio
              dignissimos corrupti impedit inventore quod corporis. Iste natus
              pariatur quo neque excepturi eum cupiditate in, nobis illum
              repudiandae tenetur, ullam suscipit enim hic delectus. Pariatur,
              nobis? Ipsa, blanditiis dolorum. Culpa rem placeat maxime nihil
              quaerat dolore voluptas iure sequi nulla. Recusandae vel ab
              distinctio, accusantium exercitationem dicta sed provident esse
              unde, inventore, deleniti debitis dolores dolorem. Commodi nostrum
              explicabo excepturi nisi, reprehenderit, numquam vel asperiores
              nobis minus id, placeat itaque inventore. Illo vitae porro eos
              obcaecati. Corrupti, cumque? Suscipit, consequuntur. Eius modi
              inventore odit repellat quis? Commodi ipsam, reprehenderit
              distinctio quidem sint molestias veritatis quas at. Earum,
              cupiditate quam. Quasi nam porro quibusdam voluptates consequatur.
              Fugit animi error omnis atque necessitatibus vero beatae saepe
              officia architecto! Vero tempore dicta minima alias delectus
              repudiandae consequatur? Delectus, tempore molestiae! Veritatis
              veniam labore iusto eveniet cum doloremque quo obcaecati sapiente
              beatae deleniti inventore ab praesentium recusandae, maiores sit
              aliquid. Natus officiis fugiat, in, consequuntur aspernatur
              blanditiis hic expedita accusantium quia beatae vero iure aperiam.
              Dolore ad distinctio libero autem cumque! Magnam, vel. Consequatur
              odit magnam cupiditate necessitatibus. Delectus, natus.
            </Wrapper>

            {/* TODO: Tag Selection */}
            <Wrapper></Wrapper>
          </div>
        );
      case SearchCategory.manga:
        return (
          <div className="flex flex-col gap-2 p-2 ">
            <div className="flex flex-col gap-2 rounded-md bg-white/10 p-4">
              <Label
                className="text-lg font-semibold text-primary-500"
                htmlFor="yearRangeSelector"
              >
                Year Range {`[${searchYearStart} - ${searchYearEnd}]`}
              </Label>
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
          </div>
        );
      case SearchCategory.character:
        return <></>;
      case SearchCategory.staff:
        return <></>;
      case SearchCategory.studio:
        return <></>;
    }
  };

  const setDefault = () => {
    setSearchSeason(SearchSeason.any);
    setSearchYearStart(1970);
    setSearchYearEnd(2024);
    setSearchTerm("");
    setSeachCategory(SearchCategory.anime);
  };

  return {
    render: (
      <TextField
        placeholder="Search..."
        variant="surface"
        rootClasses="outline-primary-500 focus-within:-outline-offset-4 hover:-outline-offset-4 focus-within:outline hover:outline  outline-4 transition-all p-1 dark:bg-white/10"
        startIcon={{
          icon: (
            <Select
              side="top"
              trigger={
                <button className="flex items-center gap-2 bg-primary-500/20 p-2">
                  <MagnifyingGlassIcon className="scale-150" />
                  {searchCategory} <ChevronDownIcon />
                </button>
              }
              defaultValue={SearchCategory.anime}
              values={Object.values(SearchCategory).map((v) => ({
                value: v,
                displayTitle: v,
              }))}
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
            <Drawer
              trigger={
                <button className="flex items-center gap-2 bg-primary-500/20 p-2">
                  <MixerHorizontalIcon />
                </button>
              }
              content={filterSelector(searchCategory)}
              className="w-2/3 max-w-lg"
            />
          ),
          color: "ruby",
          gap: "4",
        }}
        value={searchTerm}
        className="focus-within:border-b-1 hover:border-b-1 isolate z-0 mx-2 h-full rounded-md border-0 border-secondary-500 bg-black/20 px-2 py-1 text-primary-400 outline-none transition-all placeholder:text-primary-400 dark:bg-black/50 placeholder:dark:text-primary-500"
      />
    ),
  };
};
