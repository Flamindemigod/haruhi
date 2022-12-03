import { Card, Box } from "@mui/material";
import Image from "next/image";
import Link from "../Link";
import React from "react";
import Carosel from "../Carosel";

const Characters = ({ characters }) => {
  return (
    <>
      <div className="text-xl">Characters</div>
      <Carosel width="95vw" height="100%">
        <Box
          className="grid grid-flow-col grid-rows-2 gap-4"
          sx={{ gridTemplateColumns: "repeat(auto-fill, minMax(25rem,30rem))" }}
        >
          {characters.map((character) => (
            <Card
              key={character.node.id}
              className="flex justify-between"
              sx={{ minWidth: "25rem", maxWidth: "30rem" }}
            >
              <Link href={`/character/${character.node.id}`}>
                <Box className="flex gap-2">
                  <Image
                    width={80}
                    height={128}
                    src={character.node.image.large}
                    alt={character.node.name.userPreferred}
                  />
                  <Box className="flex flex-col justify-around">
                    <div className="text-md">
                      {character.node.name.userPreferred}
                    </div>
                    <div className="text-md">{character.role}</div>
                  </Box>
                </Box>
              </Link>
              {character.voiceActors.length ? (
                <Link href={`/staff/${character.voiceActors[0].id}`}>
                  <Box className="flex gap-2 text-end">
                    <Box className="flex flex-col justify-around">
                      <div className="text-md">
                        {character.voiceActors[0].name.userPreferred}
                      </div>
                      <div className="text-md">JAPANESE</div>
                    </Box>
                    <Image
                      width={80}
                      height={128}
                      src={character.voiceActors[0].image.large}
                      alt={character.node.name.userPreferred}
                    />
                  </Box>
                </Link>
              ) : (
                <></>
              )}
            </Card>
          ))}
        </Box>
      </Carosel>
    </>
  );
};

export default Characters;
