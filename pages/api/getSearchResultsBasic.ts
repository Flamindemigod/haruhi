import type { NextApiRequest, NextApiResponse } from "next";
import applyRateLimit from "../../utils/applyRateLimit";
import makeQuery from "../../utils/makeQuery";

type Response = {};

const parseBoolOrUndefined = (val: string) => {
  switch (val) {
    case "true":
      return true;
    case "false":
      return false;
    default:
      return undefined;
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    await applyRateLimit(req, res);
  } catch {
    return res.status(429).send("Too many requests");
  }
  let query = `query ($search: String, $isAdult: Boolean) {
      anime: Page(perPage: 8) {
        pageInfo {
          total
        }
        results: media(type: ANIME, isAdult: $isAdult, search: $search) {
          id
          title {
            userPreferred
          }
          coverImage {
            medium
          }
          type
          format
          bannerImage
          isLicensed
          startDate {
            year
          }
        }
      }
      manga: Page(perPage: 8) {
        pageInfo {
          total
        }
        results: media(type: MANGA, isAdult: $isAdult, search: $search) {
          id
          title {
            userPreferred
          }
          coverImage {
            medium
          }
          type
          format
          bannerImage
          isLicensed
          startDate {
            year
          }
        }
      }
      characters: Page(perPage: 8) {
        pageInfo {
          total
        }
        results: characters(search: $search) {
          id
          name {
            userPreferred
          }
          image {
            medium
          }
        }
      }
      staff: Page(perPage: 8) {
        pageInfo {
          total
        }
        results: staff(search: $search) {
          id
          primaryOccupations
          name {
            userPreferred
          }
          image {
            medium
          }
        }
      }
      studios: Page(perPage: 8) {
        pageInfo {
          total
        }
        results: studios(search: $search) {
          id
          name
        }
      }
      users: Page(perPage: 8) {
        results: users(search: $search) {
          id
          name
          avatar {
            medium
          }
        }
      }
    }
    `;

  var variables = {
    page: req.query.page || 1,
    search: req.query.search || "",
    isAdult: parseBoolOrUndefined(String(req.query.isAdult)) ?? undefined,
  };

  let data = await makeQuery({
    query,
    variables,
    token: req.cookies.access_token,
  });

  res.status(200).json(data.data);
}
