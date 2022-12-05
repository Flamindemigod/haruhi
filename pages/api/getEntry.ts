import type { NextApiRequest, NextApiResponse } from "next";
import makeQuery from "../../utils/makeQuery";

type Response = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  if (req.query.id !== undefined) {
    const query = `query getEntry {
        Media(id: ${req.query.id}) {
          id
          idMal
          coverImage {
            large
          }
          bannerImage
          title {
            userPreferred
            english
          }
          description(asHtml:true)
          format
          season
          startDate {
            year
            month
            day
          }
          endDate {
            year
            month
            day
          }
          seasonYear
          type
          genres
          chapters
          volume
          season
          studios {
            edges {
              isMain
              node {
                id
                name
              }
            }
          }
          duration
          source
          episodes
          status
          genres
          tags {
            id
            name
            description
            category
            rank
          }
          averageScore
          nextAiringEpisode {
            airingAt
            timeUntilAiring
            episode
          }
          mediaListEntry {
            id
            status
            progress
            score
            repeat
            startedAt {
              year
              month
              day
            }
            completedAt {
              year
              month
              day
            }
          }
          relations {
            edges {
              relationType
              node {
                title {
                  userPreferred
                }
                id
                type
                status
                coverImage {
                  large
                }
              }
            }
          }
          stats{
            statusDistribution{
                status
                amount
            }
            scoreDistribution{
                score
                amount
            }
        }
          recommendations {
            edges {
              node {
                mediaRecommendation {
                  type
                  id
                  status
                  title {
                    userPreferred
                  }
                  type
                  coverImage {
                    large
                  }
                }
              }
            }
          }
          characters(sort: ROLE) {
            edges {
              node {
                id
                name {
      
                  userPreferred
                }
                image {
                  large
                }
              }
              role
              voiceActors(language: JAPANESE, sort: ROLE) {
                id
                name {
      
                  userPreferred
                }
                image {
                  large
                }
              }
            }
          }
        }
      }
      `;
    let data = await makeQuery({
      query,
      variables: {},
      token: req.cookies.access_token,
    });
    res.status(200).json(data);
  } else {
    res.status(400).json({ error: "id must be specified" });
  }
}
