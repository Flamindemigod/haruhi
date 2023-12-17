/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\nquery USER_AUTH{\n  Viewer {\n    id\n    name\n    avatar {\n      medium\n    }\n    options{\n      displayAdultContent\n    }\n    mediaListOptions{\n      scoreFormat\n    }\n  }\n}\n": types.User_AuthDocument,
    "\nquery GET_GENRES{\n  GenreCollection\n}\n": types.Get_GenresDocument,
    "\nquery GET_TAGS{\n  MediaTagCollection{\n    id\n    name\n    description\n    category\n\t\tisAdult\n  }\n}\n": types.Get_TagsDocument,
    "\nquery SEARCH_ANIME_MANGA($page: Int = 1, $id: Int, $type: MediaType, $isAdult: Boolean = true, $search: String, $format: [MediaFormat], $status: MediaStatus, $countryOfOrigin: CountryCode, $source: MediaSource, $season: MediaSeason, $seasonYear: Int, $year: String, $onList: Boolean, $yearLesser: FuzzyDateInt, $yearGreater: FuzzyDateInt, $episodeLesser: Int, $episodeGreater: Int, $durationLesser: Int, $durationGreater: Int, $chapterLesser: Int, $chapterGreater: Int, $volumeLesser: Int, $volumeGreater: Int, $licensedBy: [Int], $isLicensed: Boolean, $genres: [String], $excludedGenres: [String], $tags: [String], $excludedTags: [String], $minimumTagRank: Int, $sort: [MediaSort] = [POPULARITY_DESC, SCORE_DESC]) {\n  Page(page: $page, perPage: 20) {\n    pageInfo {\n      total\n      perPage\n      currentPage\n      lastPage\n      hasNextPage\n    }\n    media(id: $id, type: $type, season: $season, format_in: $format, status: $status, countryOfOrigin: $countryOfOrigin, source: $source, search: $search, onList: $onList, seasonYear: $seasonYear, startDate_like: $year, startDate_lesser: $yearLesser, startDate_greater: $yearGreater, episodes_lesser: $episodeLesser, episodes_greater: $episodeGreater, duration_lesser: $durationLesser, duration_greater: $durationGreater, chapters_lesser: $chapterLesser, chapters_greater: $chapterGreater, volumes_lesser: $volumeLesser, volumes_greater: $volumeGreater, licensedById_in: $licensedBy, isLicensed: $isLicensed, genre_in: $genres, genre_not_in: $excludedGenres, tag_in: $tags, tag_not_in: $excludedTags, minimumTagRank: $minimumTagRank, sort: $sort, isAdult: $isAdult) {\n      id\n      title {\n        userPreferred\n      }\n      coverImage {\n        extraLarge\n        large\n        color\n      }\n      startDate {\n        year\n        month\n        day\n      }\n      endDate {\n        year\n        month\n        day\n      }\n      bannerImage\n      season\n      seasonYear\n      description\n      type\n      format\n      status(version: 2)\n      episodes\n      duration\n      chapters\n      volumes\n      genres\n      isAdult\n      averageScore\n      popularity\n      nextAiringEpisode {\n        airingAt\n        timeUntilAiring\n        episode\n      }\n      mediaListEntry {\n        id\n        status\n      }\n      studios(isMain: true) {\n        edges {\n          isMain\n          node {\n            id\n            name\n          }\n        }\n      }\n    }\n  }\n}\n\n": types.Search_Anime_MangaDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery USER_AUTH{\n  Viewer {\n    id\n    name\n    avatar {\n      medium\n    }\n    options{\n      displayAdultContent\n    }\n    mediaListOptions{\n      scoreFormat\n    }\n  }\n}\n"): (typeof documents)["\nquery USER_AUTH{\n  Viewer {\n    id\n    name\n    avatar {\n      medium\n    }\n    options{\n      displayAdultContent\n    }\n    mediaListOptions{\n      scoreFormat\n    }\n  }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery GET_GENRES{\n  GenreCollection\n}\n"): (typeof documents)["\nquery GET_GENRES{\n  GenreCollection\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery GET_TAGS{\n  MediaTagCollection{\n    id\n    name\n    description\n    category\n\t\tisAdult\n  }\n}\n"): (typeof documents)["\nquery GET_TAGS{\n  MediaTagCollection{\n    id\n    name\n    description\n    category\n\t\tisAdult\n  }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery SEARCH_ANIME_MANGA($page: Int = 1, $id: Int, $type: MediaType, $isAdult: Boolean = true, $search: String, $format: [MediaFormat], $status: MediaStatus, $countryOfOrigin: CountryCode, $source: MediaSource, $season: MediaSeason, $seasonYear: Int, $year: String, $onList: Boolean, $yearLesser: FuzzyDateInt, $yearGreater: FuzzyDateInt, $episodeLesser: Int, $episodeGreater: Int, $durationLesser: Int, $durationGreater: Int, $chapterLesser: Int, $chapterGreater: Int, $volumeLesser: Int, $volumeGreater: Int, $licensedBy: [Int], $isLicensed: Boolean, $genres: [String], $excludedGenres: [String], $tags: [String], $excludedTags: [String], $minimumTagRank: Int, $sort: [MediaSort] = [POPULARITY_DESC, SCORE_DESC]) {\n  Page(page: $page, perPage: 20) {\n    pageInfo {\n      total\n      perPage\n      currentPage\n      lastPage\n      hasNextPage\n    }\n    media(id: $id, type: $type, season: $season, format_in: $format, status: $status, countryOfOrigin: $countryOfOrigin, source: $source, search: $search, onList: $onList, seasonYear: $seasonYear, startDate_like: $year, startDate_lesser: $yearLesser, startDate_greater: $yearGreater, episodes_lesser: $episodeLesser, episodes_greater: $episodeGreater, duration_lesser: $durationLesser, duration_greater: $durationGreater, chapters_lesser: $chapterLesser, chapters_greater: $chapterGreater, volumes_lesser: $volumeLesser, volumes_greater: $volumeGreater, licensedById_in: $licensedBy, isLicensed: $isLicensed, genre_in: $genres, genre_not_in: $excludedGenres, tag_in: $tags, tag_not_in: $excludedTags, minimumTagRank: $minimumTagRank, sort: $sort, isAdult: $isAdult) {\n      id\n      title {\n        userPreferred\n      }\n      coverImage {\n        extraLarge\n        large\n        color\n      }\n      startDate {\n        year\n        month\n        day\n      }\n      endDate {\n        year\n        month\n        day\n      }\n      bannerImage\n      season\n      seasonYear\n      description\n      type\n      format\n      status(version: 2)\n      episodes\n      duration\n      chapters\n      volumes\n      genres\n      isAdult\n      averageScore\n      popularity\n      nextAiringEpisode {\n        airingAt\n        timeUntilAiring\n        episode\n      }\n      mediaListEntry {\n        id\n        status\n      }\n      studios(isMain: true) {\n        edges {\n          isMain\n          node {\n            id\n            name\n          }\n        }\n      }\n    }\n  }\n}\n\n"): (typeof documents)["\nquery SEARCH_ANIME_MANGA($page: Int = 1, $id: Int, $type: MediaType, $isAdult: Boolean = true, $search: String, $format: [MediaFormat], $status: MediaStatus, $countryOfOrigin: CountryCode, $source: MediaSource, $season: MediaSeason, $seasonYear: Int, $year: String, $onList: Boolean, $yearLesser: FuzzyDateInt, $yearGreater: FuzzyDateInt, $episodeLesser: Int, $episodeGreater: Int, $durationLesser: Int, $durationGreater: Int, $chapterLesser: Int, $chapterGreater: Int, $volumeLesser: Int, $volumeGreater: Int, $licensedBy: [Int], $isLicensed: Boolean, $genres: [String], $excludedGenres: [String], $tags: [String], $excludedTags: [String], $minimumTagRank: Int, $sort: [MediaSort] = [POPULARITY_DESC, SCORE_DESC]) {\n  Page(page: $page, perPage: 20) {\n    pageInfo {\n      total\n      perPage\n      currentPage\n      lastPage\n      hasNextPage\n    }\n    media(id: $id, type: $type, season: $season, format_in: $format, status: $status, countryOfOrigin: $countryOfOrigin, source: $source, search: $search, onList: $onList, seasonYear: $seasonYear, startDate_like: $year, startDate_lesser: $yearLesser, startDate_greater: $yearGreater, episodes_lesser: $episodeLesser, episodes_greater: $episodeGreater, duration_lesser: $durationLesser, duration_greater: $durationGreater, chapters_lesser: $chapterLesser, chapters_greater: $chapterGreater, volumes_lesser: $volumeLesser, volumes_greater: $volumeGreater, licensedById_in: $licensedBy, isLicensed: $isLicensed, genre_in: $genres, genre_not_in: $excludedGenres, tag_in: $tags, tag_not_in: $excludedTags, minimumTagRank: $minimumTagRank, sort: $sort, isAdult: $isAdult) {\n      id\n      title {\n        userPreferred\n      }\n      coverImage {\n        extraLarge\n        large\n        color\n      }\n      startDate {\n        year\n        month\n        day\n      }\n      endDate {\n        year\n        month\n        day\n      }\n      bannerImage\n      season\n      seasonYear\n      description\n      type\n      format\n      status(version: 2)\n      episodes\n      duration\n      chapters\n      volumes\n      genres\n      isAdult\n      averageScore\n      popularity\n      nextAiringEpisode {\n        airingAt\n        timeUntilAiring\n        episode\n      }\n      mediaListEntry {\n        id\n        status\n      }\n      studios(isMain: true) {\n        edges {\n          isMain\n          node {\n            id\n            name\n          }\n        }\n      }\n    }\n  }\n}\n\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;