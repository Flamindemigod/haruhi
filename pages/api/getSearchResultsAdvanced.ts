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
  let query = "";
  var variables: any = {};
  switch (req.query.type) {
    case "ANIME":
    case "MANGA":
      query = `query ($page: Int = 1, $id: Int, $type: MediaType, $isAdult: Boolean = false, $search: String, $format: [MediaFormat], $status: MediaStatus, $countryOfOrigin: CountryCode, $source: MediaSource, $season: MediaSeason, $seasonYear: Int, $year: String, $onList: Boolean, $yearLesser: FuzzyDateInt, $yearGreater: FuzzyDateInt, $episodeLesser: Int, $episodeGreater: Int, $durationLesser: Int, $durationGreater: Int, $chapterLesser: Int, $chapterGreater: Int, $volumeLesser: Int, $volumeGreater: Int,  $genres: [String], $excludedGenres: [String], $tags: [String], $excludedTags: [String], $minimumTagRank: Int, $sort: [MediaSort] = [POPULARITY_DESC, SCORE_DESC]) {
            Page(page: $page, perPage: 50) {
              pageInfo {
                total
                perPage
                currentPage
                lastPage
                hasNextPage
              }
              media(id: $id, type: $type, season: $season, format_in: $format, status: $status, countryOfOrigin: $countryOfOrigin, source: $source, search: $search, onList: $onList, seasonYear: $seasonYear, startDate_like: $year, startDate_lesser: $yearLesser, startDate_greater: $yearGreater, episodes_lesser: $episodeLesser, episodes_greater: $episodeGreater, duration_lesser: $durationLesser, duration_greater: $durationGreater, chapters_lesser: $chapterLesser, chapters_greater: $chapterGreater, volumes_lesser: $volumeLesser, volumes_greater: $volumeGreater, genre_in: $genres, genre_not_in: $excludedGenres, tag_in: $tags, tag_not_in: $excludedTags, minimumTagRank: $minimumTagRank, sort: $sort, isAdult: $isAdult) {
                id
                title {
                  userPreferred
                  english
                }
                coverImage {
                  large
                  medium
                }
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
                season
                seasonYear
                description
                type
                format
                status(version: 2)
                episodes
                duration
                chapters
                volumes
                genres
                isAdult
                averageScore
                popularity
                nextAiringEpisode {
                  airingAt
                  timeUntilAiring
                  episode
                }
                mediaListEntry {
                  id
                  status
                  progress
                }
                studios(isMain: true) {
                  edges {
                    isMain
                    node {
                      id
                      name
                    }
                  }
                }
              }
            }
          }`;

      variables = {
        ...req.query,
        page: parseInt(String(req.query.page)),
      };
      variables.isAdult = parseBoolOrUndefined(String(req.query.isAdult));
      variables.onList = parseBoolOrUndefined(String(req.query.onList));
      variables.genres = !!req.query.genres
        ? String(req.query.genres)
            .split(",")
            .filter((el) => !(el === "true" || el === "false"))
        : undefined;
      variables.excludedGenres = !!req.query.excludedGenres
        ? String(req.query.excludedGenres)
            .split(",")
            .filter((el) => !(el === "true" || el === "false"))
        : undefined;
      variables.tags = !!req.query.tags
        ? String(req.query.tags)
            .split(",")
            .filter((el) => !(el === "true" || el === "false"))
        : undefined;
      variables.excludedTags = !!req.query.excludedTags
        ? String(req.query.excludedTags)
            .split(",")
            .filter((el) => !(el === "true" || el === "false"))
        : undefined;
      variables.yearLesser = req.query.yearLesser
        ? parseInt(String(req.query.yearLesser))
        : undefined;
      variables.yearGreater = req.query.yearGreater
        ? parseInt(String(req.query.yearGreater))
        : undefined;
      variables.episodeLesser = req.query.episodeLesser
        ? parseInt(String(req.query.episodeLesser))
        : undefined;
      variables.episodeGreater = req.query.episodeGreater
        ? parseInt(String(req.query.episodeGreater))
        : undefined;
      variables.durationLesser = req.query.durationLesser
        ? parseInt(String(req.query.durationLesser))
        : undefined;
      variables.durationGreater = req.query.durationGreater
        ? parseInt(String(req.query.durationGreater))
        : undefined;
      variables.chapterLesser = req.query.chapterLesser
        ? parseInt(String(req.query.chapterLesser))
        : undefined;
      variables.chapterGreater = req.query.chapterGreater
        ? parseInt(String(req.query.chapterGreater))
        : undefined;
      variables.volumeLesser = req.query.volumeLesser
        ? parseInt(String(req.query.volumeLesser))
        : undefined;
      variables.volumeGreater = req.query.volumeGreater
        ? parseInt(String(req.query.volumeGreater))
        : undefined;
      break;
    case "STAFF":
      query = `query ($page: Int = 1, $id: Int, $search: String, $isBirthday: Boolean, $sort: [StaffSort] = [FAVOURITES_DESC]) {
            Page(page: $page, perPage: 50) {
              pageInfo {
                total
                perPage
                currentPage
                lastPage
                hasNextPage
              }
              staff(id: $id, search: $search, isBirthday: $isBirthday, sort: $sort) {
                id
                name {
                  userPreferred
                  alternative
                }
                languageV2
                primaryOccupations
                description(asHtml:true)
                image {
                  large
                }
              }
            }
          }`;
      variables = {
        page: req.query.page,
        search: req.query.search,
        isBirthday: parseBoolOrUndefined(String(req.query.isBirthday)),
        sort: req.query.sort,
      };
      break;
    case "CHARACTER":
      query = `query ($page: Int = 1, $id: Int, $search: String, $isBirthday: Boolean, $sort: [CharacterSort] = [FAVOURITES_DESC]) {
        Page(page: $page, perPage: 50) {
          pageInfo {
            total
            perPage
            currentPage
            lastPage
            hasNextPage
          }
          characters(id: $id, search: $search, isBirthday: $isBirthday, sort: $sort) {
            id
            name {
              userPreferred
              alternative
            }
            description(asHtml:true)
            image {
              large
            }
          }
        }
      }`;
      variables = {
        page: req.query.page,
        search: req.query.search,
        isBirthday: parseBoolOrUndefined(String(req.query.isBirthday)),
        sort: req.query.sort,
      };
      break;

    default:
      res.status(400).json({ error: "type must be specified" });
      return;
  }
  let data = await makeQuery({
    query,
    variables,
    token: req.cookies.access_token,
  });
  res.status(200).json(data.data);
}
