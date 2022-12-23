import type { NextApiRequest, NextApiResponse } from "next";
import makeQuery from "../../utils/makeQuery";

type Response = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  if (req.query.id !== undefined) {
    const query = `query getCharacterData($id: Int = 1, $page: Int = 1, $onList: Boolean, $sort: [MediaSort]) {
        Character(id: $id) {
          id
          name {
            userPreferred
            alternative
          }
          description(asHtml:true)
          image {
            large
            medium
          }
          age
          bloodType
          gender
          dateOfBirth {
            year
            month
            day
          }
          media(page: $page, onList: $onList, sort:$sort) {
            pageInfo {
                currentPage
              hasNextPage
            }
            edges{
              node {
                id
              title {
                userPreferred
                english
              }
              description
              coverImage{
                large
                medium
              }
              episodes
              chapters
              format
              type
              mediaListEntry{
                progress
                status
              }
              nextAiringEpisode{
                airingAt
                timeUntilAiring
                episode
              }
              status
              startDate {
                year
                month
                day
              }
            }
              voiceActors{
                id
                name{
                  userPreferred
                  alternative
                }
                image{
                    medium
                }
                description(asHtml:true)
                languageV2
              }
            }
          }
        }
      }          
    `;
    const variables = {
      id: req.query.id,
      page: req.query.page ?? 1,
      onList: req.query.onList === "true" ? true : undefined,
      sort: req.query.sort || "START_DATE_DESC",
    };
    let data = await makeQuery({
      query,
      variables,
      token: req.cookies.access_token,
    });
    res.status(200).json(data);
  } else {
    res.status(400).json({ error: "id must be specified" });
  }
}
