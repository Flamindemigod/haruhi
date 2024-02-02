import { gql } from "graphql-tag";

const MediaResponseFragment = gql`
  fragment MediaResponseFragment on Media {
    id
    title {
      userPreferred
      english
      native
      romaji
    }
    coverImage {
      large
      medium
      color
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
    bannerImage
    season
    seasonYear
    description(asHtml: true)
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
    nextAiringEpisode {
      airingAt
      timeUntilAiring
      episode
    }
    mediaListEntry {
      id
      status
      score
      progress
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
      notes
      private
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
`;

export const USER_AUTH = gql`
  query USER_AUTH {
    Viewer {
      id
      name
      avatar {
        medium
      }
      options {
        displayAdultContent
      }
      mediaListOptions {
        scoreFormat
      }
    }
  }
`;

export const GET_GENRES = gql`
  query GET_GENRES {
    GenreCollection
  }
`;

export const GET_TAGS = gql`
  query GET_TAGS {
    MediaTagCollection {
      id
      name
      description
      category
      isAdult
    }
  }
`;

export const SEARCH_ANIME_MANGA = gql`
  query SEARCH_ANIME_MANGA(
    $page: Int = 1
    $id: Int
    $type: MediaType
    $isAdult: Boolean
    $search: String
    $format: [MediaFormat]
    $status: MediaStatus
    $countryOfOrigin: CountryCode
    $source: MediaSource
    $season: MediaSeason
    $seasonYear: Int
    $year: String
    $onList: Boolean
    $yearLesser: FuzzyDateInt
    $yearGreater: FuzzyDateInt
    $episodeLesser: Int
    $episodeGreater: Int
    $durationLesser: Int
    $durationGreater: Int
    $chapterLesser: Int
    $chapterGreater: Int
    $volumeLesser: Int
    $volumeGreater: Int
    $licensedBy: [Int]
    $isLicensed: Boolean
    $genres: [String]
    $excludedGenres: [String]
    $tags: [String]
    $excludedTags: [String]
    $minimumTagRank: Int
    $sort: [MediaSort] = [POPULARITY_DESC, SCORE_DESC]
  ) {
    Page(page: $page, perPage: 20) {
      pageInfo {
        total
        perPage
        currentPage
        lastPage
        hasNextPage
      }
      media(
        id: $id
        type: $type
        season: $season
        format_in: $format
        status: $status
        countryOfOrigin: $countryOfOrigin
        source: $source
        search: $search
        onList: $onList
        seasonYear: $seasonYear
        startDate_like: $year
        startDate_lesser: $yearLesser
        startDate_greater: $yearGreater
        episodes_lesser: $episodeLesser
        episodes_greater: $episodeGreater
        duration_lesser: $durationLesser
        duration_greater: $durationGreater
        chapters_lesser: $chapterLesser
        chapters_greater: $chapterGreater
        volumes_lesser: $volumeLesser
        volumes_greater: $volumeGreater
        licensedById_in: $licensedBy
        isLicensed: $isLicensed
        genre_in: $genres
        genre_not_in: $excludedGenres
        tag_in: $tags
        tag_not_in: $excludedTags
        minimumTagRank: $minimumTagRank
        sort: $sort
        isAdult: $isAdult
      ) {
        ...MediaResponseFragment
      }
    }
  }
  ${MediaResponseFragment}
`;

export const SEARCH_STAFF = gql`
  query SEARCH_STAFF(
    $page: Int = 1
    $id: Int
    $search: String
    $isBirthday: Boolean
    $sort: [StaffSort] = [FAVOURITES_DESC]
  ) {
    Page(page: $page, perPage: 20) {
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
        }
        description(asHtml: true)
        image {
          large
          medium
        }
      }
    }
  }
`;

export const SEARCH_CHARACTERS = gql`
  query SEARCH_CHARACTERS(
    $page: Int = 1
    $id: Int
    $search: String
    $isBirthday: Boolean
    $sort: [CharacterSort] = [FAVOURITES_DESC]
  ) {
    Page(page: $page, perPage: 20) {
      pageInfo {
        total
        perPage
        currentPage
        lastPage
        hasNextPage
      }
      characters(
        id: $id
        search: $search
        isBirthday: $isBirthday
        sort: $sort
      ) {
        id
        name {
          userPreferred
        }
        description(asHtml: true)
        image {
          large
          medium
        }
      }
    }
  }
`;

export const SEARCH_STUDIO = gql`
  query SEARCH_STUDIO(
    $page: Int = 1
    $id: Int
    $search: String
    $sort: [StudioSort] = [SEARCH_MATCH]
  ) {
    Page(page: $page, perPage: 20) {
      pageInfo {
        total
        perPage
        currentPage
        lastPage
        hasNextPage
      }
      studios(id: $id, search: $search, sort: $sort) {
        id
        name
      }
    }
  }
`;

export const TRENDING_ANIME_MANGA = gql`
  query TRENDING_ANIME_MANGA(
    $page: Int = 1
    $sort: [MediaSort] = [TRENDING_DESC]
    $type: MediaType
    $isAdult: Boolean
    $format: MediaFormat
    $status: MediaStatus
    $season: MediaSeason
    $seasonYear: Int
  ) {
    Page(page: $page, perPage: 25) {
      pageInfo {
        total
        perPage
        currentPage
        lastPage
        hasNextPage
      }
      media(
        sort: $sort
        type: $type
        isAdult: $isAdult
        format: $format
        status: $status
        season: $season
        seasonYear: $seasonYear
      ) {
        ...MediaResponseFragment
      }
    }
  }
  ${MediaResponseFragment}
`;

export const USER_RECOMMENDED = gql`
  query USER_RECOMMENDED(
    $perPage: Int = 50
    $page: Int = 1
    $userName: String
    $type: MediaType
  ) {
    Page(perPage: $perPage, page: $page) {
      pageInfo {
        hasNextPage
        total
      }
      mediaList(userName: $userName, type: $type, sort: [SCORE_DESC]) {
        progress
        score
        media {
          recommendations {
            edges {
              node {
                rating
                mediaRecommendation {
                  ...MediaResponseFragment
                }
              }
            }
          }
        }
      }
    }
  }
  ${MediaResponseFragment}
`;

export const USER_UP_NEXT = gql`
  query USER_UP_NEXT(
    $perPage: Int = 50
    $page: Int = 1
    $userName: String
    $type: MediaType
  ) {
    Page(perPage: $perPage, page: $page) {
      pageInfo {
        hasNextPage
        total
      }
      mediaList(
        userName: $userName
        type: $type
        sort: [ADDED_TIME]
        status: PLANNING
      ) {
        media {
          ...MediaResponseFragment
        }
      }
    }
  }
  ${MediaResponseFragment}
`;

export const USER_LIST = gql`
  query USER_LIST(
    $perPage: Int = 50
    $page: Int = 1
    $userName: String
    $type: MediaType
    $status: MediaListStatus = CURRENT
    $sort: [MediaListSort] = [UPDATED_TIME_DESC]
  ) {
    Page(perPage: $perPage, page: $page) {
      pageInfo {
        hasNextPage
        total
      }
      mediaList(
        userName: $userName
        type: $type
        sort: $sort
        status: $status
      ) {
        media {
          ...MediaResponseFragment
        }
      }
    }
  }
  ${MediaResponseFragment}
`;

export const SEASONAL = gql`
  query SEASONAL(
    $page: Int = 1
    $perPage: Int = 25
    $season: MediaSeason
    $seasonYear: Int
    $isAdult: Boolean
  ) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        hasNextPage
      }
      media(
        season: $season
        seasonYear: $seasonYear
        type: ANIME
        sort: [POPULARITY_DESC]
        isAdult: $isAdult
      ) {
        ...MediaResponseFragment
      }
    }
  }
  ${MediaResponseFragment}
`;

export const SET_MEDIA_ENTRY = gql`
  mutation SET_MEDIA_ENTRY(
    $id: Int
    $mediaId: Int
    $status: MediaListStatus
    $score: Float
    $progress: Int
    $repeat: Int
    $startedAt: FuzzyDateInput
    $completedAt: FuzzyDateInput
    $notes: String
    $private: Boolean
  ) {
    SaveMediaListEntry(
      id: $id
      mediaId: $mediaId
      status: $status
      score: $score
      progress: $progress
      repeat: $repeat
      startedAt: $startedAt
      completedAt: $completedAt
      notes: $notes
      private: $private
    ) {
      id
    }
  }
`;
