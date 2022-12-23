import type { NextApiRequest, NextApiResponse } from "next";
import makeQuery from "../../utils/makeQuery";

type Response = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  if (req.query.id !== undefined) {
    const query = `query getStaffData($id: Int = 119331, $page: Int = 1, $sort: [MediaSort], $onList: Boolean) {
      Staff(id: $id) {
        name {
          userPreferred
          alternative
        }
        languageV2
        image {
          large
          medium
        }
        description(asHtml: true)
        dateOfBirth {
          year
          month
          day
        }
        age
        gender
        yearsActive
        homeTown
        bloodType
        characterMedia(sort: $sort, perPage: 25, page: $page, onList: $onList) {
          pageInfo {
            currentPage
            hasNextPage
          }
          edges {
            node {
              mediaListEntry {
                status
                progress
              }
              id
              title {
                userPreferred
                english
              }
              coverImage {
                large
                medium
              }
              status
              format
              chapters
              format
              type
              nextAiringEpisode {
                airingAt
                timeUntilAiring
                episode
              }
            }
            characters {
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
            }
            characterRole
          }
        }
      }
    }
    `;
    const variables = {
      id: req.query.id,
      page: req.query.page ?? 1,
      sort: req.query.sort || "START_DATE_DESC",
      onList: req.query.onList === "true" ? true : undefined,
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
