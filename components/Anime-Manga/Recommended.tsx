import Carosel from "../../primitives/Carosel";
import Card from "../CardMain";

type Props = {
  recommended: any[];
};

const Recommended = (props: Props) => {
  return (
    <>
      {props.recommended && (
        <div>
          <div className="p-2 text-2xl text-offWhite-900 dark:text-offWhite-100">
            Recommended
          </div>
          <div>
            <Carosel width="95vw" height={150}>
              {props.recommended.map((edge) => (
                <Card
                  key={edge.node.id}
                  href={`/${edge.node.type.toLowerCase()}/${edge.node.id}`}
                  imgSrc={edge.node.coverImage.large}
                  imgWidth={96}
                  imgHeight={128}
                  contentTitle={edge.node.title.userPreferred}
                  contentTitleEnglish={edge.node.title.english}
                  contentSubtitle={edge.node.description}
                  contentProgress={edge.node.mediaListEntry?.progress}
                  contentEpisodes={
                    edge.node.format === "MANGA"
                      ? edge.node.chapters
                      : edge.node.episodes
                  }
                  contentNextAiringEpisode={0}
                  contentNextAiringEpisodeTime={0}
                  contentFormat={edge.node.format.replaceAll("_", " ")}
                  contentType={edge.node.type}
                  contentStatus={edge.node.status.replaceAll("_", " ")}
                />
              ))}
            </Carosel>
          </div>
        </div>
      )}
    </>
  );
};

export default Recommended;
