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
          countryOfOrigin
          coverImage {
            large
            medium
          }
          bannerImage
          title {
            userPreferred
            english
            romaji
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
          volumes
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
                description
                format
                episodes
                chapters
                type
                status
                coverImage {
                  large
            medium

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
                  description
                  episodes
                  chapters
                  type
                  id
                  format
                  status
                  title {
                    userPreferred
                    
                  }
                  type
                  coverImage {
                    large
            medium

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
              voiceActors(sort: ROLE) {
                id
                name {
      
                  userPreferred
                }
                language
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
