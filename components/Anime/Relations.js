import { Card } from "@mui/material";
import Image from "next/image";
import Link from "../Link";
import { useEffect } from "react";
import { useState } from "react";
import Carosel from "../Carosel";

const Relations = ({ relations }) => {
  const [_relations, setRelations] = useState([]);
  useEffect(() => {
    setRelations(
      relations.filter((relation) => {
        if (relation.node.type === "ANIME") {
          return true;
        }
        return false;
      })
    );
    // testr
  }, [relations]);
  return (
    <>
      {_relations.length ? (
        <>
          <div className="text-xl">Relations</div>
          <Carosel width="95vw" height="100%">
            {_relations.map((relation) => (
              <Link key={relation.node.id} href={`/anime/${relation.node.id}`}>
                <Card className="flex-shrink-0" sx={{ width: "21rem" }}>
                  <div className="flex h-full w-full">
                    <div className="flex-shrink-0">
                      <Image
                        width={128}
                        height={167}
                        src={relation.node.coverImage.large}
                        alt={relation.node.title.userPreferred}
                      />
                    </div>
                    <div className="flex flex-col p-2 justify-around">
                      <div>{relation.node.title.userPreferred}</div>
                      <div className="text-sm flex justify-around">
                        <div>{relation.node.type}</div>-
                        <div>{relation.relationType.replace(/[_]/gm, " ")}</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </Carosel>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default Relations;
