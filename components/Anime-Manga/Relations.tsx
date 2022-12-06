import Carosel from "../../primitives/Carosel";
import Card from "../CardAlternative";

type Props = {
  relations: any[] | undefined;
};

const Relations = (props: Props) => {
  return (
    <>
      {props.relations?.length ? (
        <div>
          <div className="p-2 text-2xl text-offWhite-900 dark:text-offWhite-100">
            Relations
          </div>
          <div>
            <Carosel width="95vw" height={150}>
              {props.relations.map((relation) => (
                <Card
                  key={relation.node.id}
                  href={`/${relation.node.type.toLowerCase()}/${
                    relation.node.id
                  }`}
                  imgSrc={relation.node.coverImage.large}
                  imgWidth={96}
                  imgHeight={128}
                  contentTitle={relation.node.title.userPreferred}
                  contentTitleEnglish={relation.node.title.english}
                  contentSubtitle={relation.node.description}
                  contentProgress={0}
                  contentEpisodes={
                    relation.node.format === "MANGA"
                      ? relation.node.chapters
                      : relation.node.episodes
                  }
                  contentRelation={relation.relationType}
                  contentFormat={relation.node.format}
                  contentType={relation.node.type}
                  contentStatus={relation.node.status}
                />
              ))}
            </Carosel>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Relations;
