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
  '\n  fragment MediaResponseFragment on Media {\n    id\n    title {\n      userPreferred\n      english\n      native\n      romaji\n    }\n    coverImage {\n      large\n      medium\n      color\n    }\n    startDate {\n      year\n      month\n      day\n    }\n    endDate {\n      year\n      month\n      day\n    }\n    bannerImage\n    season\n    seasonYear\n    description(asHtml: true)\n    type\n    format\n    status(version: 2)\n    episodes\n    duration\n    chapters\n    volumes\n    genres\n    isAdult\n    averageScore\n    nextAiringEpisode {\n      airingAt\n      timeUntilAiring\n      episode\n    }\n    mediaListEntry {\n      id\n      status\n      score\n      progress\n      repeat\n      startedAt {\n        year\n        month\n        day\n      }\n      completedAt {\n        year\n        month\n        day\n      }\n      notes\n      private\n    }\n    studios(isMain: true) {\n      edges {\n        isMain\n        node {\n          id\n          name\n        }\n      }\n    }\n  }\n':
    types.MediaResponseFragmentFragmentDoc,
  '\n  query USER_AUTH {\n    Viewer {\n      id\n      name\n      avatar {\n        medium\n      }\n      options {\n        displayAdultContent\n      }\n      mediaListOptions {\n        scoreFormat\n      }\n    }\n  }\n':
    types.User_AuthDocument,
  '\n  query GET_GENRES {\n    GenreCollection\n  }\n':
    types.Get_GenresDocument,
  '\n  query GET_TAGS {\n    MediaTagCollection {\n      id\n      name\n      description\n      category\n      isAdult\n    }\n  }\n':
    types.Get_TagsDocument,
  '\n  query SEARCH_ANIME_MANGA(\n    $page: Int = 1\n    $id: Int\n    $type: MediaType\n    $isAdult: Boolean\n    $search: String\n    $format: [MediaFormat]\n    $status: MediaStatus\n    $countryOfOrigin: CountryCode\n    $source: MediaSource\n    $season: MediaSeason\n    $seasonYear: Int\n    $year: String\n    $onList: Boolean\n    $yearLesser: FuzzyDateInt\n    $yearGreater: FuzzyDateInt\n    $episodeLesser: Int\n    $episodeGreater: Int\n    $durationLesser: Int\n    $durationGreater: Int\n    $chapterLesser: Int\n    $chapterGreater: Int\n    $volumeLesser: Int\n    $volumeGreater: Int\n    $licensedBy: [Int]\n    $isLicensed: Boolean\n    $genres: [String]\n    $excludedGenres: [String]\n    $tags: [String]\n    $excludedTags: [String]\n    $minimumTagRank: Int\n    $sort: [MediaSort] = [POPULARITY_DESC, SCORE_DESC]\n  ) {\n    Page(page: $page, perPage: 20) {\n      pageInfo {\n        total\n        perPage\n        currentPage\n        lastPage\n        hasNextPage\n      }\n      media(\n        id: $id\n        type: $type\n        season: $season\n        format_in: $format\n        status: $status\n        countryOfOrigin: $countryOfOrigin\n        source: $source\n        search: $search\n        onList: $onList\n        seasonYear: $seasonYear\n        startDate_like: $year\n        startDate_lesser: $yearLesser\n        startDate_greater: $yearGreater\n        episodes_lesser: $episodeLesser\n        episodes_greater: $episodeGreater\n        duration_lesser: $durationLesser\n        duration_greater: $durationGreater\n        chapters_lesser: $chapterLesser\n        chapters_greater: $chapterGreater\n        volumes_lesser: $volumeLesser\n        volumes_greater: $volumeGreater\n        licensedById_in: $licensedBy\n        isLicensed: $isLicensed\n        genre_in: $genres\n        genre_not_in: $excludedGenres\n        tag_in: $tags\n        tag_not_in: $excludedTags\n        minimumTagRank: $minimumTagRank\n        sort: $sort\n        isAdult: $isAdult\n      ) {\n        ...MediaResponseFragment\n      }\n    }\n  }\n  \n':
    types.Search_Anime_MangaDocument,
  '\n  query SEARCH_STAFF(\n    $page: Int = 1\n    $id: Int\n    $search: String\n    $isBirthday: Boolean\n    $sort: [StaffSort] = [FAVOURITES_DESC]\n  ) {\n    Page(page: $page, perPage: 20) {\n      pageInfo {\n        total\n        perPage\n        currentPage\n        lastPage\n        hasNextPage\n      }\n      staff(id: $id, search: $search, isBirthday: $isBirthday, sort: $sort) {\n        id\n        name {\n          userPreferred\n        }\n        description(asHtml: true)\n        image {\n          large\n          medium\n        }\n      }\n    }\n  }\n':
    types.Search_StaffDocument,
  '\n  query SEARCH_CHARACTERS(\n    $page: Int = 1\n    $id: Int\n    $search: String\n    $isBirthday: Boolean\n    $sort: [CharacterSort] = [FAVOURITES_DESC]\n  ) {\n    Page(page: $page, perPage: 20) {\n      pageInfo {\n        total\n        perPage\n        currentPage\n        lastPage\n        hasNextPage\n      }\n      characters(\n        id: $id\n        search: $search\n        isBirthday: $isBirthday\n        sort: $sort\n      ) {\n        id\n        name {\n          userPreferred\n        }\n        description(asHtml: true)\n        image {\n          large\n          medium\n        }\n      }\n    }\n  }\n':
    types.Search_CharactersDocument,
  '\n  query SEARCH_STUDIO(\n    $page: Int = 1\n    $id: Int\n    $search: String\n    $sort: [StudioSort] = [SEARCH_MATCH]\n  ) {\n    Page(page: $page, perPage: 20) {\n      pageInfo {\n        total\n        perPage\n        currentPage\n        lastPage\n        hasNextPage\n      }\n      studios(id: $id, search: $search, sort: $sort) {\n        id\n        name\n      }\n    }\n  }\n':
    types.Search_StudioDocument,
  '\n  query TRENDING_ANIME_MANGA(\n    $page: Int = 1\n    $sort: [MediaSort] = [TRENDING_DESC]\n    $type: MediaType\n    $isAdult: Boolean\n    $format: MediaFormat\n    $status: MediaStatus\n    $season: MediaSeason\n    $seasonYear: Int\n  ) {\n    Page(page: $page, perPage: 25) {\n      pageInfo {\n        total\n        perPage\n        currentPage\n        lastPage\n        hasNextPage\n      }\n      media(\n        sort: $sort\n        type: $type\n        isAdult: $isAdult\n        format: $format\n        status: $status\n        season: $season\n        seasonYear: $seasonYear\n      ) {\n        ...MediaResponseFragment\n      }\n    }\n  }\n  \n':
    types.Trending_Anime_MangaDocument,
  '\n  query USER_RECOMMENDED(\n    $perPage: Int = 50\n    $page: Int = 1\n    $userName: String\n    $type: MediaType\n  ) {\n    Page(perPage: $perPage, page: $page) {\n      pageInfo {\n        hasNextPage\n        total\n      }\n      mediaList(userName: $userName, type: $type, sort: [SCORE_DESC]) {\n        progress\n        score\n        media {\n          recommendations {\n            edges {\n              node {\n                rating\n                mediaRecommendation {\n                  ...MediaResponseFragment\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n  \n':
    types.User_RecommendedDocument,
  '\n  query USER_UP_NEXT(\n    $perPage: Int = 50\n    $page: Int = 1\n    $userName: String\n    $type: MediaType\n  ) {\n    Page(perPage: $perPage, page: $page) {\n      pageInfo {\n        hasNextPage\n        total\n      }\n      mediaList(\n        userName: $userName\n        type: $type\n        sort: [ADDED_TIME]\n        status: PLANNING\n      ) {\n        media {\n          ...MediaResponseFragment\n        }\n      }\n    }\n  }\n  \n':
    types.User_Up_NextDocument,
  '\n  query USER_LIST(\n    $perPage: Int = 50\n    $page: Int = 1\n    $userName: String\n    $type: MediaType\n    $status: MediaListStatus = CURRENT\n    $sort: [MediaListSort] = [UPDATED_TIME_DESC]\n  ) {\n    Page(perPage: $perPage, page: $page) {\n      pageInfo {\n        hasNextPage\n        total\n      }\n      mediaList(\n        userName: $userName\n        type: $type\n        sort: $sort\n        status: $status\n      ) {\n        media {\n          ...MediaResponseFragment\n        }\n      }\n    }\n  }\n  \n':
    types.User_ListDocument,
  '\n  query SEASONAL(\n    $page: Int = 1\n    $perPage: Int = 25\n    $season: MediaSeason\n    $seasonYear: Int\n    $isAdult: Boolean\n  ) {\n    Page(page: $page, perPage: $perPage) {\n      pageInfo {\n        hasNextPage\n      }\n      media(\n        season: $season\n        seasonYear: $seasonYear\n        type: ANIME\n        sort: [POPULARITY_DESC]\n        isAdult: $isAdult\n      ) {\n        ...MediaResponseFragment\n      }\n    }\n  }\n  \n':
    types.SeasonalDocument,
  '\n  mutation SET_MEDIA_ENTRY(\n    $id: Int\n    $mediaId: Int\n    $status: MediaListStatus\n    $score: Float\n    $progress: Int\n    $repeat: Int\n    $startedAt: FuzzyDateInput\n    $completedAt: FuzzyDateInput\n    $notes: String\n    $private: Boolean\n  ) {\n    SaveMediaListEntry(\n      id: $id\n      mediaId: $mediaId\n      status: $status\n      score: $score\n      progress: $progress\n      repeat: $repeat\n      startedAt: $startedAt\n      completedAt: $completedAt\n      notes: $notes\n      private: $private\n    ) {\n      id\n    }\n  }\n':
    types.Set_Media_EntryDocument,
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
export function gql(
  source: '\n  fragment MediaResponseFragment on Media {\n    id\n    title {\n      userPreferred\n      english\n      native\n      romaji\n    }\n    coverImage {\n      large\n      medium\n      color\n    }\n    startDate {\n      year\n      month\n      day\n    }\n    endDate {\n      year\n      month\n      day\n    }\n    bannerImage\n    season\n    seasonYear\n    description(asHtml: true)\n    type\n    format\n    status(version: 2)\n    episodes\n    duration\n    chapters\n    volumes\n    genres\n    isAdult\n    averageScore\n    nextAiringEpisode {\n      airingAt\n      timeUntilAiring\n      episode\n    }\n    mediaListEntry {\n      id\n      status\n      score\n      progress\n      repeat\n      startedAt {\n        year\n        month\n        day\n      }\n      completedAt {\n        year\n        month\n        day\n      }\n      notes\n      private\n    }\n    studios(isMain: true) {\n      edges {\n        isMain\n        node {\n          id\n          name\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  fragment MediaResponseFragment on Media {\n    id\n    title {\n      userPreferred\n      english\n      native\n      romaji\n    }\n    coverImage {\n      large\n      medium\n      color\n    }\n    startDate {\n      year\n      month\n      day\n    }\n    endDate {\n      year\n      month\n      day\n    }\n    bannerImage\n    season\n    seasonYear\n    description(asHtml: true)\n    type\n    format\n    status(version: 2)\n    episodes\n    duration\n    chapters\n    volumes\n    genres\n    isAdult\n    averageScore\n    nextAiringEpisode {\n      airingAt\n      timeUntilAiring\n      episode\n    }\n    mediaListEntry {\n      id\n      status\n      score\n      progress\n      repeat\n      startedAt {\n        year\n        month\n        day\n      }\n      completedAt {\n        year\n        month\n        day\n      }\n      notes\n      private\n    }\n    studios(isMain: true) {\n      edges {\n        isMain\n        node {\n          id\n          name\n        }\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query USER_AUTH {\n    Viewer {\n      id\n      name\n      avatar {\n        medium\n      }\n      options {\n        displayAdultContent\n      }\n      mediaListOptions {\n        scoreFormat\n      }\n    }\n  }\n'
): (typeof documents)['\n  query USER_AUTH {\n    Viewer {\n      id\n      name\n      avatar {\n        medium\n      }\n      options {\n        displayAdultContent\n      }\n      mediaListOptions {\n        scoreFormat\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query GET_GENRES {\n    GenreCollection\n  }\n'
): (typeof documents)['\n  query GET_GENRES {\n    GenreCollection\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query GET_TAGS {\n    MediaTagCollection {\n      id\n      name\n      description\n      category\n      isAdult\n    }\n  }\n'
): (typeof documents)['\n  query GET_TAGS {\n    MediaTagCollection {\n      id\n      name\n      description\n      category\n      isAdult\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query SEARCH_ANIME_MANGA(\n    $page: Int = 1\n    $id: Int\n    $type: MediaType\n    $isAdult: Boolean\n    $search: String\n    $format: [MediaFormat]\n    $status: MediaStatus\n    $countryOfOrigin: CountryCode\n    $source: MediaSource\n    $season: MediaSeason\n    $seasonYear: Int\n    $year: String\n    $onList: Boolean\n    $yearLesser: FuzzyDateInt\n    $yearGreater: FuzzyDateInt\n    $episodeLesser: Int\n    $episodeGreater: Int\n    $durationLesser: Int\n    $durationGreater: Int\n    $chapterLesser: Int\n    $chapterGreater: Int\n    $volumeLesser: Int\n    $volumeGreater: Int\n    $licensedBy: [Int]\n    $isLicensed: Boolean\n    $genres: [String]\n    $excludedGenres: [String]\n    $tags: [String]\n    $excludedTags: [String]\n    $minimumTagRank: Int\n    $sort: [MediaSort] = [POPULARITY_DESC, SCORE_DESC]\n  ) {\n    Page(page: $page, perPage: 20) {\n      pageInfo {\n        total\n        perPage\n        currentPage\n        lastPage\n        hasNextPage\n      }\n      media(\n        id: $id\n        type: $type\n        season: $season\n        format_in: $format\n        status: $status\n        countryOfOrigin: $countryOfOrigin\n        source: $source\n        search: $search\n        onList: $onList\n        seasonYear: $seasonYear\n        startDate_like: $year\n        startDate_lesser: $yearLesser\n        startDate_greater: $yearGreater\n        episodes_lesser: $episodeLesser\n        episodes_greater: $episodeGreater\n        duration_lesser: $durationLesser\n        duration_greater: $durationGreater\n        chapters_lesser: $chapterLesser\n        chapters_greater: $chapterGreater\n        volumes_lesser: $volumeLesser\n        volumes_greater: $volumeGreater\n        licensedById_in: $licensedBy\n        isLicensed: $isLicensed\n        genre_in: $genres\n        genre_not_in: $excludedGenres\n        tag_in: $tags\n        tag_not_in: $excludedTags\n        minimumTagRank: $minimumTagRank\n        sort: $sort\n        isAdult: $isAdult\n      ) {\n        ...MediaResponseFragment\n      }\n    }\n  }\n  \n'
): (typeof documents)['\n  query SEARCH_ANIME_MANGA(\n    $page: Int = 1\n    $id: Int\n    $type: MediaType\n    $isAdult: Boolean\n    $search: String\n    $format: [MediaFormat]\n    $status: MediaStatus\n    $countryOfOrigin: CountryCode\n    $source: MediaSource\n    $season: MediaSeason\n    $seasonYear: Int\n    $year: String\n    $onList: Boolean\n    $yearLesser: FuzzyDateInt\n    $yearGreater: FuzzyDateInt\n    $episodeLesser: Int\n    $episodeGreater: Int\n    $durationLesser: Int\n    $durationGreater: Int\n    $chapterLesser: Int\n    $chapterGreater: Int\n    $volumeLesser: Int\n    $volumeGreater: Int\n    $licensedBy: [Int]\n    $isLicensed: Boolean\n    $genres: [String]\n    $excludedGenres: [String]\n    $tags: [String]\n    $excludedTags: [String]\n    $minimumTagRank: Int\n    $sort: [MediaSort] = [POPULARITY_DESC, SCORE_DESC]\n  ) {\n    Page(page: $page, perPage: 20) {\n      pageInfo {\n        total\n        perPage\n        currentPage\n        lastPage\n        hasNextPage\n      }\n      media(\n        id: $id\n        type: $type\n        season: $season\n        format_in: $format\n        status: $status\n        countryOfOrigin: $countryOfOrigin\n        source: $source\n        search: $search\n        onList: $onList\n        seasonYear: $seasonYear\n        startDate_like: $year\n        startDate_lesser: $yearLesser\n        startDate_greater: $yearGreater\n        episodes_lesser: $episodeLesser\n        episodes_greater: $episodeGreater\n        duration_lesser: $durationLesser\n        duration_greater: $durationGreater\n        chapters_lesser: $chapterLesser\n        chapters_greater: $chapterGreater\n        volumes_lesser: $volumeLesser\n        volumes_greater: $volumeGreater\n        licensedById_in: $licensedBy\n        isLicensed: $isLicensed\n        genre_in: $genres\n        genre_not_in: $excludedGenres\n        tag_in: $tags\n        tag_not_in: $excludedTags\n        minimumTagRank: $minimumTagRank\n        sort: $sort\n        isAdult: $isAdult\n      ) {\n        ...MediaResponseFragment\n      }\n    }\n  }\n  \n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query SEARCH_STAFF(\n    $page: Int = 1\n    $id: Int\n    $search: String\n    $isBirthday: Boolean\n    $sort: [StaffSort] = [FAVOURITES_DESC]\n  ) {\n    Page(page: $page, perPage: 20) {\n      pageInfo {\n        total\n        perPage\n        currentPage\n        lastPage\n        hasNextPage\n      }\n      staff(id: $id, search: $search, isBirthday: $isBirthday, sort: $sort) {\n        id\n        name {\n          userPreferred\n        }\n        description(asHtml: true)\n        image {\n          large\n          medium\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query SEARCH_STAFF(\n    $page: Int = 1\n    $id: Int\n    $search: String\n    $isBirthday: Boolean\n    $sort: [StaffSort] = [FAVOURITES_DESC]\n  ) {\n    Page(page: $page, perPage: 20) {\n      pageInfo {\n        total\n        perPage\n        currentPage\n        lastPage\n        hasNextPage\n      }\n      staff(id: $id, search: $search, isBirthday: $isBirthday, sort: $sort) {\n        id\n        name {\n          userPreferred\n        }\n        description(asHtml: true)\n        image {\n          large\n          medium\n        }\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query SEARCH_CHARACTERS(\n    $page: Int = 1\n    $id: Int\n    $search: String\n    $isBirthday: Boolean\n    $sort: [CharacterSort] = [FAVOURITES_DESC]\n  ) {\n    Page(page: $page, perPage: 20) {\n      pageInfo {\n        total\n        perPage\n        currentPage\n        lastPage\n        hasNextPage\n      }\n      characters(\n        id: $id\n        search: $search\n        isBirthday: $isBirthday\n        sort: $sort\n      ) {\n        id\n        name {\n          userPreferred\n        }\n        description(asHtml: true)\n        image {\n          large\n          medium\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query SEARCH_CHARACTERS(\n    $page: Int = 1\n    $id: Int\n    $search: String\n    $isBirthday: Boolean\n    $sort: [CharacterSort] = [FAVOURITES_DESC]\n  ) {\n    Page(page: $page, perPage: 20) {\n      pageInfo {\n        total\n        perPage\n        currentPage\n        lastPage\n        hasNextPage\n      }\n      characters(\n        id: $id\n        search: $search\n        isBirthday: $isBirthday\n        sort: $sort\n      ) {\n        id\n        name {\n          userPreferred\n        }\n        description(asHtml: true)\n        image {\n          large\n          medium\n        }\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query SEARCH_STUDIO(\n    $page: Int = 1\n    $id: Int\n    $search: String\n    $sort: [StudioSort] = [SEARCH_MATCH]\n  ) {\n    Page(page: $page, perPage: 20) {\n      pageInfo {\n        total\n        perPage\n        currentPage\n        lastPage\n        hasNextPage\n      }\n      studios(id: $id, search: $search, sort: $sort) {\n        id\n        name\n      }\n    }\n  }\n'
): (typeof documents)['\n  query SEARCH_STUDIO(\n    $page: Int = 1\n    $id: Int\n    $search: String\n    $sort: [StudioSort] = [SEARCH_MATCH]\n  ) {\n    Page(page: $page, perPage: 20) {\n      pageInfo {\n        total\n        perPage\n        currentPage\n        lastPage\n        hasNextPage\n      }\n      studios(id: $id, search: $search, sort: $sort) {\n        id\n        name\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query TRENDING_ANIME_MANGA(\n    $page: Int = 1\n    $sort: [MediaSort] = [TRENDING_DESC]\n    $type: MediaType\n    $isAdult: Boolean\n    $format: MediaFormat\n    $status: MediaStatus\n    $season: MediaSeason\n    $seasonYear: Int\n  ) {\n    Page(page: $page, perPage: 25) {\n      pageInfo {\n        total\n        perPage\n        currentPage\n        lastPage\n        hasNextPage\n      }\n      media(\n        sort: $sort\n        type: $type\n        isAdult: $isAdult\n        format: $format\n        status: $status\n        season: $season\n        seasonYear: $seasonYear\n      ) {\n        ...MediaResponseFragment\n      }\n    }\n  }\n  \n'
): (typeof documents)['\n  query TRENDING_ANIME_MANGA(\n    $page: Int = 1\n    $sort: [MediaSort] = [TRENDING_DESC]\n    $type: MediaType\n    $isAdult: Boolean\n    $format: MediaFormat\n    $status: MediaStatus\n    $season: MediaSeason\n    $seasonYear: Int\n  ) {\n    Page(page: $page, perPage: 25) {\n      pageInfo {\n        total\n        perPage\n        currentPage\n        lastPage\n        hasNextPage\n      }\n      media(\n        sort: $sort\n        type: $type\n        isAdult: $isAdult\n        format: $format\n        status: $status\n        season: $season\n        seasonYear: $seasonYear\n      ) {\n        ...MediaResponseFragment\n      }\n    }\n  }\n  \n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query USER_RECOMMENDED(\n    $perPage: Int = 50\n    $page: Int = 1\n    $userName: String\n    $type: MediaType\n  ) {\n    Page(perPage: $perPage, page: $page) {\n      pageInfo {\n        hasNextPage\n        total\n      }\n      mediaList(userName: $userName, type: $type, sort: [SCORE_DESC]) {\n        progress\n        score\n        media {\n          recommendations {\n            edges {\n              node {\n                rating\n                mediaRecommendation {\n                  ...MediaResponseFragment\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n  \n'
): (typeof documents)['\n  query USER_RECOMMENDED(\n    $perPage: Int = 50\n    $page: Int = 1\n    $userName: String\n    $type: MediaType\n  ) {\n    Page(perPage: $perPage, page: $page) {\n      pageInfo {\n        hasNextPage\n        total\n      }\n      mediaList(userName: $userName, type: $type, sort: [SCORE_DESC]) {\n        progress\n        score\n        media {\n          recommendations {\n            edges {\n              node {\n                rating\n                mediaRecommendation {\n                  ...MediaResponseFragment\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n  \n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query USER_UP_NEXT(\n    $perPage: Int = 50\n    $page: Int = 1\n    $userName: String\n    $type: MediaType\n  ) {\n    Page(perPage: $perPage, page: $page) {\n      pageInfo {\n        hasNextPage\n        total\n      }\n      mediaList(\n        userName: $userName\n        type: $type\n        sort: [ADDED_TIME]\n        status: PLANNING\n      ) {\n        media {\n          ...MediaResponseFragment\n        }\n      }\n    }\n  }\n  \n'
): (typeof documents)['\n  query USER_UP_NEXT(\n    $perPage: Int = 50\n    $page: Int = 1\n    $userName: String\n    $type: MediaType\n  ) {\n    Page(perPage: $perPage, page: $page) {\n      pageInfo {\n        hasNextPage\n        total\n      }\n      mediaList(\n        userName: $userName\n        type: $type\n        sort: [ADDED_TIME]\n        status: PLANNING\n      ) {\n        media {\n          ...MediaResponseFragment\n        }\n      }\n    }\n  }\n  \n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query USER_LIST(\n    $perPage: Int = 50\n    $page: Int = 1\n    $userName: String\n    $type: MediaType\n    $status: MediaListStatus = CURRENT\n    $sort: [MediaListSort] = [UPDATED_TIME_DESC]\n  ) {\n    Page(perPage: $perPage, page: $page) {\n      pageInfo {\n        hasNextPage\n        total\n      }\n      mediaList(\n        userName: $userName\n        type: $type\n        sort: $sort\n        status: $status\n      ) {\n        media {\n          ...MediaResponseFragment\n        }\n      }\n    }\n  }\n  \n'
): (typeof documents)['\n  query USER_LIST(\n    $perPage: Int = 50\n    $page: Int = 1\n    $userName: String\n    $type: MediaType\n    $status: MediaListStatus = CURRENT\n    $sort: [MediaListSort] = [UPDATED_TIME_DESC]\n  ) {\n    Page(perPage: $perPage, page: $page) {\n      pageInfo {\n        hasNextPage\n        total\n      }\n      mediaList(\n        userName: $userName\n        type: $type\n        sort: $sort\n        status: $status\n      ) {\n        media {\n          ...MediaResponseFragment\n        }\n      }\n    }\n  }\n  \n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query SEASONAL(\n    $page: Int = 1\n    $perPage: Int = 25\n    $season: MediaSeason\n    $seasonYear: Int\n    $isAdult: Boolean\n  ) {\n    Page(page: $page, perPage: $perPage) {\n      pageInfo {\n        hasNextPage\n      }\n      media(\n        season: $season\n        seasonYear: $seasonYear\n        type: ANIME\n        sort: [POPULARITY_DESC]\n        isAdult: $isAdult\n      ) {\n        ...MediaResponseFragment\n      }\n    }\n  }\n  \n'
): (typeof documents)['\n  query SEASONAL(\n    $page: Int = 1\n    $perPage: Int = 25\n    $season: MediaSeason\n    $seasonYear: Int\n    $isAdult: Boolean\n  ) {\n    Page(page: $page, perPage: $perPage) {\n      pageInfo {\n        hasNextPage\n      }\n      media(\n        season: $season\n        seasonYear: $seasonYear\n        type: ANIME\n        sort: [POPULARITY_DESC]\n        isAdult: $isAdult\n      ) {\n        ...MediaResponseFragment\n      }\n    }\n  }\n  \n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation SET_MEDIA_ENTRY(\n    $id: Int\n    $mediaId: Int\n    $status: MediaListStatus\n    $score: Float\n    $progress: Int\n    $repeat: Int\n    $startedAt: FuzzyDateInput\n    $completedAt: FuzzyDateInput\n    $notes: String\n    $private: Boolean\n  ) {\n    SaveMediaListEntry(\n      id: $id\n      mediaId: $mediaId\n      status: $status\n      score: $score\n      progress: $progress\n      repeat: $repeat\n      startedAt: $startedAt\n      completedAt: $completedAt\n      notes: $notes\n      private: $private\n    ) {\n      id\n    }\n  }\n'
): (typeof documents)['\n  mutation SET_MEDIA_ENTRY(\n    $id: Int\n    $mediaId: Int\n    $status: MediaListStatus\n    $score: Float\n    $progress: Int\n    $repeat: Int\n    $startedAt: FuzzyDateInput\n    $completedAt: FuzzyDateInput\n    $notes: String\n    $private: Boolean\n  ) {\n    SaveMediaListEntry(\n      id: $id\n      mediaId: $mediaId\n      status: $status\n      score: $score\n      progress: $progress\n      repeat: $repeat\n      startedAt: $startedAt\n      completedAt: $completedAt\n      notes: $notes\n      private: $private\n    ) {\n      id\n    }\n  }\n'];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
