"use client";
import { useState } from "react";
import Carosel from "../../primitives/Carosel";
import Select from "../../primitives/Select";
import CharacterCard from "./CharacterCard";

interface Props {
  characters: any;
}

const Characters = (props: Props) => {
  const [language, setLanguage] = useState<string>("JAPANESE");
  const availableLanguages = [
    ...new Set(
      props.characters
        .map((el: any) => {
          return el.voiceActors.map((va: any) => va.language);
        })
        .flat()
    ),
  ];
  return (
    <>
      {props.characters?.length ? (
        <div className="">
          <div className="flex justify-between py-2">
            <div className="p-2 text-2xl text-offWhite-900 dark:text-offWhite-100">
              Characters
            </div>
            {availableLanguages.length !== 0 && (
              <div className="dark:text-white flex gap-2 items-center">
                <label className="text-lg">Language:</label>
                <Select
                  defaultValue={"JAPANESE"}
                  values={availableLanguages}
                  triggerAriaLabel={"Language Selector"}
                  value={language}
                  onValueChange={(value: string) => {
                    setLanguage(value);
                  }}
                />
              </div>
            )}
          </div>
          <Carosel width="95vw" height={"100%"}>
            <div
              className="grid grid-flow-col grid-rows-2 gap-4 w-full"
              style={{
                gridTemplateColumns: "repeat(auto-fit, minmax(30rem, 1fr))",
              }}
            >
              {props.characters.map((character: any) => (
                <CharacterCard
                  key={character.node.id}
                  character={character.node}
                  role={character.role}
                  va={
                    character.voiceActors.filter(
                      (va: any) => va.language === language
                    )[0]
                  }
                />
              ))}
            </div>
          </Carosel>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Characters;
