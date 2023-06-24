import Carosel from "../../primitives/Carosel";
import Card from "../CardMain";

type Props = {
  recommended: any[];
};

const Recommended = (props: Props) => {
  return (
    <>
      {props.recommended?.length ? (
        <div>
          <div className="p-2 text-2xl text-offWhite-900 dark:text-offWhite-100">
            Recommended
          </div>
          <div>
            <Carosel width="95vw" height={270}>
              {props.recommended.map((edge) => (
                <Card
                  key={edge.node.mediaRecommendation.id}
                  href={`/${edge.node.mediaRecommendation.type.toLowerCase()}/${
                    edge.node.mediaRecommendation.id
                  }`}
                  imgSrcSmall={edge.node.mediaRecommendation.coverImage.medium}
                  imgSrc={edge.node.mediaRecommendation.coverImage.large}
                  imgWidth={156}
                  imgHeight={220}
                  contentTitle={
                    edge.node.mediaRecommendation.title.userPreferred
                  }
                  contentTitleEnglish={
                    edge.node.mediaRecommendation.title.english
                  }
                  contentSubtitle={edge.node.mediaRecommendation.description}
                  contentProgress={
                    edge.node.mediaRecommendation.mediaListEntry?.progress
                  }
                  contentEpisodes={
                    edge.node.mediaRecommendation.format === "MANGA"
                      ? edge.node.mediaRecommendation.chapters
                      : edge.node.mediaRecommendation.episodes
                  }
                  contentNextAiringEpisode={edge.node.mediaRecommendation.null}
                  contentNextAiringEpisodeTime={
                    edge.node.mediaRecommendation.null
                  }
                  contentFormat={edge.node.mediaRecommendation.format?.replaceAll(
                    "_",
                    " "
                  )}
                  contentType={edge.node.mediaRecommendation.type}
                  contentStatus={edge.node.mediaRecommendation.status?.replaceAll(
                    "_",
                    " "
                  )}
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

export default Recommended;
